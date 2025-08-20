import { Server, Socket } from 'socket.io';
import winston from 'winston';
import { 
  ISocketManager, 
  ConnectionInfo, 
  SocketEvent, 
  SocketEventPayloads,
  NotificationType,
  CACHE_KEYS
} from '../types';
import { ICacheManager } from '../types';

export class SocketManager implements ISocketManager {
  private io: Server;
  private logger: winston.Logger;
  private cache?: ICacheManager;
  private connections: Map<string, ConnectionInfo> = new Map();
  private heartbeatInterval: NodeJS.Timeout | null = null;

  // Room naming conventions
  private readonly ROOM_PATTERNS = {
    NOTARIA: (notariaId: string) => `notaria:${notariaId}`,
    SESSION: (sessionId: string) => `session:${sessionId}`,
    ADMIN: (notariaId: string) => `admin:${notariaId}`,
    GLOBAL: 'global'
  };

  // Heartbeat configuration
  private readonly HEARTBEAT_INTERVAL = 30000; // 30 seconds
  private readonly CONNECTION_TIMEOUT = 60000; // 60 seconds

  constructor(
    io: Server,
    logger: winston.Logger,
    cache?: ICacheManager
  ) {
    this.io = io;
    this.logger = logger;
    this.cache = cache;
  }

  /**
   * Initialize Socket.io server with event handlers
   */
  async initialize(): Promise<void> {
    try {
      this.logger.info('Initializing Socket Manager');

      // Set up connection handler
      this.io.on('connection', (socket: Socket) => {
        this.handleConnection(socket);
      });

      // Start heartbeat monitoring
      this.startHeartbeatMonitoring();

      // Set up middleware for authentication/validation
      this.io.use((socket, next) => {
        this.validateConnection(socket, next);
      });

      this.logger.info('Socket Manager initialized successfully');

    } catch (error) {
      this.logger.error('Failed to initialize Socket Manager', {
        error: error instanceof Error ? error.message : error
      });
      throw error;
    }
  }

  /**
   * Handle new socket connection
   */
  handleConnection(socket: Socket): void {
    const socketId = socket.id;
    const userAgent = socket.handshake.headers['user-agent'] || 'Unknown';
    const ipAddress = socket.handshake.address;

    this.logger.info('New socket connection', { 
      socketId, 
      userAgent: userAgent.substring(0, 100),
      ipAddress 
    });

    // Create connection info
    const connectionInfo: ConnectionInfo = {
      socketId,
      userType: 'CLIENT',
      notariaId: '',
      connectedAt: new Date(),
      lastActivity: new Date(),
      isActive: true,
      metadata: {
        userAgent,
        ipAddress,
        device: this.detectDevice(userAgent),
        browser: this.detectBrowser(userAgent)
      }
    };

    this.connections.set(socketId, connectionInfo);

    // Set up event handlers
    this.setupEventHandlers(socket);

    // Send connection acknowledgment
    socket.emit('connected', {
      socketId,
      timestamp: new Date(),
      serverTime: new Date().toISOString()
    });
  }

  /**
   * Handle socket disconnection
   */
  handleDisconnection(socketId: string): void {
    const connection = this.connections.get(socketId);
    
    if (connection) {
      this.logger.info('Socket disconnected', {
        socketId,
        notariaId: connection.notariaId,
        sessionId: connection.sessionId,
        connectionDuration: Date.now() - connection.connectedAt.getTime()
      });

      // Leave all rooms
      const socket = this.io.sockets.sockets.get(socketId);
      if (socket) {
        socket.rooms.forEach(room => {
          if (room !== socketId) {
            socket.leave(room);
          }
        });
      }

      // Remove from connections
      this.connections.delete(socketId);

      // Clear from cache
      if (this.cache && connection.notariaId) {
        this.cache.del(`${CACHE_KEYS.CONNECTIONS(connection.notariaId)}:${socketId}`);
      }
    }
  }

  /**
   * Broadcast event to all clients in a notaria
   */
  broadcast(notariaId: string, event: SocketEvent, data: any): void {
    try {
      const room = this.ROOM_PATTERNS.NOTARIA(notariaId);
      
      this.logger.debug('Broadcasting event', {
        event,
        notariaId,
        room,
        dataKeys: Object.keys(data || {})
      });

      this.io.to(room).emit(event, {
        ...data,
        timestamp: new Date(),
        notariaId
      });

      // Log broadcast metrics
      this.logBroadcastMetrics(notariaId, event, data);

    } catch (error) {
      this.logger.error('Failed to broadcast event', {
        error: error instanceof Error ? error.message : error,
        event,
        notariaId
      });
    }
  }

  /**
   * Emit event to specific socket
   */
  emit(socketId: string, event: SocketEvent, data: any): void {
    try {
      const socket = this.io.sockets.sockets.get(socketId);
      
      if (socket) {
        this.logger.debug('Emitting event to socket', {
          socketId,
          event,
          dataKeys: Object.keys(data || {})
        });

        socket.emit(event, {
          ...data,
          timestamp: new Date()
        });

        // Update last activity
        const connection = this.connections.get(socketId);
        if (connection) {
          connection.lastActivity = new Date();
        }
      } else {
        this.logger.warn('Socket not found for emission', { socketId, event });
      }

    } catch (error) {
      this.logger.error('Failed to emit event', {
        error: error instanceof Error ? error.message : error,
        socketId,
        event
      });
    }
  }

  /**
   * Join socket to room
   */
  join(socketId: string, room: string): void {
    try {
      const socket = this.io.sockets.sockets.get(socketId);
      
      if (socket) {
        socket.join(room);
        
        this.logger.debug('Socket joined room', { socketId, room });

        // Update connection info
        const connection = this.connections.get(socketId);
        if (connection) {
          connection.lastActivity = new Date();
          
          // Extract notaria from room if applicable
          if (room.startsWith('notaria:')) {
            connection.notariaId = room.replace('notaria:', '');
          }
          
          // Extract session from room if applicable
          if (room.startsWith('session:')) {
            connection.sessionId = room.replace('session:', '');
          }
        }
      } else {
        this.logger.warn('Socket not found for join', { socketId, room });
      }

    } catch (error) {
      this.logger.error('Failed to join room', {
        error: error instanceof Error ? error.message : error,
        socketId,
        room
      });
    }
  }

  /**
   * Remove socket from room
   */
  leave(socketId: string, room: string): void {
    try {
      const socket = this.io.sockets.sockets.get(socketId);
      
      if (socket) {
        socket.leave(room);
        this.logger.debug('Socket left room', { socketId, room });
      }

    } catch (error) {
      this.logger.error('Failed to leave room', {
        error: error instanceof Error ? error.message : error,
        socketId,
        room
      });
    }
  }

  /**
   * Get connected clients for a notaria
   */
  getConnectedClients(notariaId: string): ConnectionInfo[] {
    return Array.from(this.connections.values()).filter(
      conn => conn.notariaId === notariaId && conn.isActive
    );
  }

  /**
   * Disconnect a specific socket
   */
  disconnect(socketId: string): void {
    try {
      const socket = this.io.sockets.sockets.get(socketId);
      
      if (socket) {
        socket.disconnect(true);
        this.logger.info('Socket force disconnected', { socketId });
      }

    } catch (error) {
      this.logger.error('Failed to disconnect socket', {
        error: error instanceof Error ? error.message : error,
        socketId
      });
    }
  }

  /**
   * Send notification to specific session
   */
  sendNotification(
    sessionId: string, 
    notification: SocketEventPayloads['notification']
  ): void {
    try {
      // Find socket for this session
      const connection = Array.from(this.connections.values()).find(
        conn => conn.sessionId === sessionId
      );

      if (connection) {
        this.emit(connection.socketId, 'notification', notification);
        
        this.logger.info('Notification sent', {
          sessionId,
          socketId: connection.socketId,
          type: notification.type,
          priority: notification.priority
        });
      } else {
        this.logger.warn('No active connection found for session', { sessionId });
        
        // Broadcast to session room as fallback
        this.io.to(this.ROOM_PATTERNS.SESSION(sessionId)).emit('notification', notification);
      }

    } catch (error) {
      this.logger.error('Failed to send notification', {
        error: error instanceof Error ? error.message : error,
        sessionId,
        notification
      });
    }
  }

  /**
   * Check if socket is connected
   */
  isConnected(socketId: string): boolean {
    return this.io.sockets.sockets.has(socketId);
  }

  // Private methods

  private setupEventHandlers(socket: Socket): void {
    const socketId = socket.id;

    // Client -> Server events
    socket.on('join-notaria', (data: SocketEventPayloads['join-notaria']) => {
      this.handleJoinNotaria(socket, data);
    });

    socket.on('join-session', (data: SocketEventPayloads['join-session']) => {
      this.handleJoinSession(socket, data);
    });

    socket.on('leave-notaria', (data: SocketEventPayloads['leave-notaria']) => {
      this.handleLeaveNotaria(socket, data);
    });

    socket.on('leave-session', (data: SocketEventPayloads['leave-session']) => {
      this.handleLeaveSession(socket, data);
    });

    socket.on('heartbeat', (data: SocketEventPayloads['heartbeat']) => {
      this.handleHeartbeat(socket, data);
    });

    socket.on('client-ready', (data: SocketEventPayloads['client-ready']) => {
      this.handleClientReady(socket, data);
    });

    socket.on('cancel-session', (data: SocketEventPayloads['cancel-session']) => {
      this.handleCancelSession(socket, data);
    });

    socket.on('request-position', (data: SocketEventPayloads['request-position']) => {
      this.handleRequestPosition(socket, data);
    });

    // Admin events
    socket.on('admin-join', (data: SocketEventPayloads['admin-join']) => {
      this.handleAdminJoin(socket, data);
    });

    socket.on('call-next', (data: SocketEventPayloads['call-next']) => {
      this.handleCallNext(socket, data);
    });

    socket.on('complete-session', (data: SocketEventPayloads['complete-session']) => {
      this.handleCompleteSession(socket, data);
    });

    // Disconnection
    socket.on('disconnect', (reason: string) => {
      this.logger.info('Socket disconnect event', { socketId, reason });
      this.handleDisconnection(socketId);
    });

    // Error handling
    socket.on('error', (error: Error) => {
      this.logger.error('Socket error', {
        socketId,
        error: error.message,
        stack: error.stack
      });
    });
  }

  private handleJoinNotaria(
    socket: Socket, 
    data: SocketEventPayloads['join-notaria']
  ): void {
    const { notariaId, userType = 'CLIENT' } = data;
    const socketId = socket.id;

    this.logger.info('Client joining notaria', { socketId, notariaId, userType });

    // Join notaria room
    const room = this.ROOM_PATTERNS.NOTARIA(notariaId);
    this.join(socketId, room);

    // Update connection info
    const connection = this.connections.get(socketId);
    if (connection) {
      connection.notariaId = notariaId;
      connection.userType = userType;
      connection.lastActivity = new Date();
    }

    // Send confirmation
    socket.emit('joined-notaria', {
      notariaId,
      room,
      timestamp: new Date(),
      connectedClients: this.getConnectedClients(notariaId).length
    });

    // Broadcast new client joined (admin only)
    socket.to(this.ROOM_PATTERNS.ADMIN(notariaId)).emit('client-joined', {
      socketId,
      userType,
      timestamp: new Date()
    });
  }

  private handleJoinSession(
    socket: Socket, 
    data: SocketEventPayloads['join-session']
  ): void {
    const { sessionId, clientInfo } = data;
    const socketId = socket.id;

    this.logger.info('Client joining session', { socketId, sessionId });

    // Join session room
    const room = this.ROOM_PATTERNS.SESSION(sessionId);
    this.join(socketId, room);

    // Update connection info
    const connection = this.connections.get(socketId);
    if (connection) {
      connection.sessionId = sessionId;
      connection.lastActivity = new Date();
      
      if (clientInfo) {
        connection.metadata = { ...connection.metadata, ...clientInfo };
      }
    }

    // Send confirmation
    socket.emit('joined-session', {
      sessionId,
      room,
      timestamp: new Date()
    });
  }

  private handleLeaveNotaria(
    socket: Socket, 
    data: SocketEventPayloads['leave-notaria']
  ): void {
    const { notariaId } = data;
    const socketId = socket.id;

    this.logger.info('Client leaving notaria', { socketId, notariaId });

    // Leave notaria room
    const room = this.ROOM_PATTERNS.NOTARIA(notariaId);
    this.leave(socketId, room);

    // Update connection info
    const connection = this.connections.get(socketId);
    if (connection) {
      connection.notariaId = '';
      connection.lastActivity = new Date();
    }

    socket.emit('left-notaria', { notariaId, timestamp: new Date() });
  }

  private handleLeaveSession(
    socket: Socket, 
    data: SocketEventPayloads['leave-session']
  ): void {
    const { sessionId } = data;
    const socketId = socket.id;

    this.logger.info('Client leaving session', { socketId, sessionId });

    // Leave session room
    const room = this.ROOM_PATTERNS.SESSION(sessionId);
    this.leave(socketId, room);

    // Update connection info
    const connection = this.connections.get(socketId);
    if (connection) {
      connection.sessionId = undefined;
      connection.lastActivity = new Date();
    }

    socket.emit('left-session', { sessionId, timestamp: new Date() });
  }

  private handleHeartbeat(
    socket: Socket, 
    data: SocketEventPayloads['heartbeat']
  ): void {
    const socketId = socket.id;
    const connection = this.connections.get(socketId);

    if (connection) {
      connection.lastActivity = new Date();
      connection.isActive = true;
    }

    // Send heartbeat response
    socket.emit('heartbeat-ack', {
      timestamp: new Date(),
      serverTime: Date.now(),
      clientTime: data.timestamp
    });
  }

  private handleClientReady(
    socket: Socket, 
    data: SocketEventPayloads['client-ready']
  ): void {
    const { sessionId, timestamp } = data;
    
    this.logger.info('Client marked ready', {
      socketId: socket.id,
      sessionId,
      timestamp
    });

    // Emit to session room
    socket.to(this.ROOM_PATTERNS.SESSION(sessionId)).emit('client-ready-confirmed', {
      sessionId,
      timestamp: new Date()
    });

    // Notify admins
    const connection = this.connections.get(socket.id);
    if (connection && connection.notariaId) {
      socket.to(this.ROOM_PATTERNS.ADMIN(connection.notariaId)).emit('client-ready-admin', {
        sessionId,
        socketId: socket.id,
        timestamp: new Date()
      });
    }
  }

  private handleCancelSession(
    socket: Socket, 
    data: SocketEventPayloads['cancel-session']
  ): void {
    const { sessionId, reason } = data;
    
    this.logger.info('Session cancel requested', {
      socketId: socket.id,
      sessionId,
      reason
    });

    // This would typically trigger session manager logic
    socket.emit('cancel-session-received', {
      sessionId,
      status: 'processing',
      timestamp: new Date()
    });
  }

  private handleRequestPosition(
    socket: Socket, 
    data: SocketEventPayloads['request-position']
  ): void {
    const { sessionId } = data;
    
    // This would typically query the queue manager
    socket.emit('position-response', {
      sessionId,
      requested: true,
      timestamp: new Date()
    });
  }

  private handleAdminJoin(
    socket: Socket, 
    data: SocketEventPayloads['admin-join']
  ): void {
    const { notariaId, adminId } = data;
    const socketId = socket.id;

    this.logger.info('Admin joining', { socketId, notariaId, adminId });

    // Join admin room
    const room = this.ROOM_PATTERNS.ADMIN(notariaId);
    this.join(socketId, room);

    // Update connection info
    const connection = this.connections.get(socketId);
    if (connection) {
      connection.userType = 'ADMIN';
      connection.notariaId = notariaId;
      connection.userId = adminId;
      connection.lastActivity = new Date();
    }

    socket.emit('admin-joined', {
      notariaId,
      adminId,
      timestamp: new Date()
    });
  }

  private handleCallNext(
    socket: Socket, 
    data: SocketEventPayloads['call-next']
  ): void {
    const { notariaId, counter } = data;
    
    this.logger.info('Call next requested', {
      socketId: socket.id,
      notariaId,
      counter
    });

    // This would trigger queue manager logic
    // For now, just acknowledge
    socket.emit('call-next-received', {
      notariaId,
      counter,
      status: 'processing',
      timestamp: new Date()
    });
  }

  private handleCompleteSession(
    socket: Socket, 
    data: SocketEventPayloads['complete-session']
  ): void {
    const { sessionId, duration, notes } = data;
    
    this.logger.info('Session completion requested', {
      socketId: socket.id,
      sessionId,
      duration,
      notes
    });

    // This would trigger session manager logic
    socket.emit('complete-session-received', {
      sessionId,
      status: 'processing',
      timestamp: new Date()
    });
  }

  private validateConnection(socket: Socket, next: Function): void {
    // Add any authentication/validation logic here
    // For now, allow all connections
    
    const origin = socket.handshake.headers.origin;
    this.logger.debug('Validating connection', {
      socketId: socket.id,
      origin
    });

    next();
  }

  private startHeartbeatMonitoring(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    this.heartbeatInterval = setInterval(() => {
      this.checkConnectionHealth();
    }, this.HEARTBEAT_INTERVAL);

    this.logger.info('Heartbeat monitoring started');
  }

  private checkConnectionHealth(): void {
    const now = Date.now();
    const staleConnections: string[] = [];

    this.connections.forEach((connection, socketId) => {
      const timeSinceLastActivity = now - connection.lastActivity.getTime();
      
      if (timeSinceLastActivity > this.CONNECTION_TIMEOUT) {
        staleConnections.push(socketId);
        connection.isActive = false;
      }
    });

    // Clean up stale connections
    staleConnections.forEach(socketId => {
      this.logger.warn('Removing stale connection', { socketId });
      this.disconnect(socketId);
    });

    if (staleConnections.length > 0) {
      this.logger.info('Cleaned up stale connections', {
        count: staleConnections.length
      });
    }
  }

  private logBroadcastMetrics(notariaId: string, event: string, data: any): void {
    const clientCount = this.getConnectedClients(notariaId).length;
    
    this.logger.debug('Broadcast metrics', {
      notariaId,
      event,
      clientCount,
      dataSize: JSON.stringify(data).length
    });
  }

  private detectDevice(userAgent: string): string {
    if (/Mobile|Android|iPhone|iPad/.test(userAgent)) {
      return 'mobile';
    }
    if (/Tablet/.test(userAgent)) {
      return 'tablet';
    }
    return 'desktop';
  }

  private detectBrowser(userAgent: string): string {
    if (/Chrome/.test(userAgent)) return 'Chrome';
    if (/Firefox/.test(userAgent)) return 'Firefox';
    if (/Safari/.test(userAgent)) return 'Safari';
    if (/Edge/.test(userAgent)) return 'Edge';
    return 'Unknown';
  }
}