# Documents API Routes

Complete RESTful API endpoints for document management with OCR processing, clipboard support, and real-time queue integration.

## Overview

This API provides comprehensive document management functionality for the notarial forms system, including:

- **Multipart & Base64 uploads** with clipboard paste support
- **Asynchronous OCR processing** with queue management
- **Dynamic form data extraction** for Ecuadorian notarial documents
- **Real-time processing status** and progress tracking
- **Rate limiting** and error handling

## Base URL

```
/api/documents
```

## Authentication

All endpoints require proper authentication headers. Add your API token:

```bash
Authorization: Bearer <your-token>
```

## Rate Limits

- **Upload endpoints**: 20 requests per 15 minutes
- **Processing endpoints**: 50 requests per 5 minutes  
- **Query endpoints**: 100 requests per minute

## Content Types

- **Multipart uploads**: `multipart/form-data`
- **Clipboard data**: `application/json`
- **All responses**: `application/json`

---

## Endpoints

### 1. Upload Documents

Upload documents via multipart form or base64 clipboard data.

**Endpoint**: `POST /upload`

**Rate limit**: 20/15min

#### Multipart Upload

```bash
curl -X POST /api/documents/upload \
  -H "Authorization: Bearer <token>" \
  -H "X-Upload-Source: drag_drop" \
  -F "files=@document.pdf" \
  -F "notariaId=NOTARIA_18_QUITO" \
  -F "autoProcess=true" \
  -F 'metadata={"clientName":"Juan Perez"}'
```

#### Clipboard Upload (Base64)

```bash
curl -X POST /api/documents/upload \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "files": [
      {
        "name": "vehicle-screenshot.png",
        "type": "image/png",
        "data": "data:image/png;base64,iVBORw0KGgoAAAANS...",
        "source": "clipboard",
        "metadata": {
          "timestamp": 1640995200000,
          "originalFormat": "image/png"
        }
      }
    ],
    "notariaId": "NOTARIA_18_QUITO",
    "autoProcess": true,
    "metadata": {
      "clientName": "Maria Rodriguez"
    }
  }'
```

**Response**:
```json
{
  "success": true,
  "data": {
    "documents": [
      {
        "id": "doc_abc123",
        "fileName": "1640995200_abc123_document.pdf",
        "originalName": "document.pdf",
        "type": "PDF_EXTRACTO",
        "status": "PROCESSING",
        "size": 2048576,
        "uploadedAt": "2025-01-01T10:00:00Z",
        "source": "clipboard_paste",
        "processingJobId": "job_xyz789",
        "metadata": {
          "clientName": "Juan Perez",
          "source": "clipboard_paste",
          "clipboardData": {
            "originalFormat": "image/png",
            "timestamp": 1640995200000
          }
        }
      }
    ]
  }
}
```

---

### 2. Get Documents

Retrieve documents with filtering and pagination.

**Endpoint**: `GET /`

**Rate limit**: 100/min

#### Query Parameters

- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20, max: 100)
- `status` (enum): Filter by status (`UPLOADED`, `PROCESSING`, `EXTRACTED`, `COMPLETED`, `ERROR`)
- `type` (enum): Filter by type (`PDF_EXTRACTO`, `PDF_DILIGENCIA`, `SCREENSHOT_VEHICULO`)
- `notariaId` (string): Filter by notaría
- `search` (string): Search in filename and extracted fields
- `dateFrom` (ISO date): Start date filter
- `dateTo` (ISO date): End date filter
- `includeFields` (boolean): Include extracted fields (default: false)
- `includeSessions` (boolean): Include active sessions (default: false)

#### Example

```bash
curl -X GET "/api/documents?page=1&limit=10&status=EXTRACTED&includeFields=true" \
  -H "Authorization: Bearer <token>"
```

**Response**:
```json
{
  "success": true,
  "data": {
    "documents": [
      {
        "id": "doc_abc123",
        "fileName": "document.pdf",
        "originalName": "Extracto Notarial.pdf",
        "type": "PDF_EXTRACTO",
        "status": "EXTRACTED",
        "size": 2048576,
        "createdAt": "2025-01-01T10:00:00Z",
        "updatedAt": "2025-01-01T10:05:00Z",
        "source": "file_picker",
        "extractedFields": [
          {
            "id": "field_123",
            "fieldName": "COMPRADOR_NOMBRE",
            "value": "JUAN CARLOS MARTINEZ LOPEZ",
            "confidence": 0.95,
            "type": "person_name"
          }
        ]
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "totalCount": 45,
      "totalPages": 5,
      "hasNextPage": true,
      "hasPreviousPage": false
    }
  }
}
```

---

### 3. Get Document by ID

Get a single document with full details.

**Endpoint**: `GET /:id`

**Rate limit**: 100/min

#### Parameters

- `id` (string): Document CUID
- `includeFields` (boolean): Include extracted fields (default: true)
- `includeSessions` (boolean): Include active sessions (default: true)

```bash
curl -X GET "/api/documents/doc_abc123?includeFields=true" \
  -H "Authorization: Bearer <token>"
```

---

### 4. Get Processing Status

Get processing status for a document.

**Endpoint**: `GET /:id/status`

**Rate limit**: 100/min

```bash
curl -X GET "/api/documents/doc_abc123/status" \
  -H "Authorization: Bearer <token>"
```

**Response**:
```json
{
  "success": true,
  "data": {
    "documentId": "doc_abc123",
    "documentStatus": "PROCESSING",
    "updatedAt": "2025-01-01T10:05:00Z",
    "processing": {
      "jobId": "job_xyz789",
      "status": "processing",
      "progress": {
        "stage": "extracting",
        "progress": 65,
        "message": "Extrayendo datos del documento...",
        "details": {
          "fieldsExtracted": 12,
          "confidence": 0.87
        }
      }
    }
  }
}
```

---

### 5. Get Documents by Notaría

Get documents for a specific notaría with queue information.

**Endpoint**: `GET /notaria/:notariaId`

**Rate limit**: 100/min

#### Parameters

- `status` (enum): Filter by status (default: EXTRACTED)
- `includeQueue` (boolean): Include queue data (default: true)

```bash
curl -X GET "/api/documents/notaria/NOTARIA_18_QUITO?includeQueue=true" \
  -H "Authorization: Bearer <token>"
```

**Response**:
```json
{
  "success": true,
  "data": {
    "notariaId": "NOTARIA_18_QUITO",
    "documents": [
      {
        "id": "doc_abc123",
        "fileName": "extracto.pdf",
        "type": "PDF_EXTRACTO",
        "status": "EXTRACTED",
        "queuePosition": 1,
        "clientName": "JUAN MARTINEZ",
        "tramiteType": "COMPRAVENTA"
      }
    ],
    "queueStats": {
      "activeSessionsCount": 3,
      "documentsInQueue": 1
    }
  }
}
```

---

### 6. Get Extracted Data (Structured)

Get extracted data formatted for dynamic forms.

**Endpoint**: `GET /:id/extracted-data`

**Rate limit**: 100/min

```bash
curl -X GET "/api/documents/doc_abc123/extracted-data" \
  -H "Authorization: Bearer <token>"
```

**Response**:
```json
{
  "success": true,
  "data": {
    "documentId": "doc_abc123",
    "documentType": "PDF_EXTRACTO",
    "tramiteType": "COMPRAVENTA",
    "confidence": 0.92,
    "extractedAt": "2025-01-01T10:05:00Z",
    "formData": {
      "personas": [
        {
          "nombres": "JUAN CARLOS",
          "apellidos": "MARTINEZ LOPEZ",
          "nombreCompleto": "JUAN CARLOS MARTINEZ LOPEZ",
          "cedula": "1234567890",
          "telefono": "0987654321",
          "direccion": "Av. Principal 123, Quito"
        }
      ],
      "vehiculo": {
        "marca": "TOYOTA",
        "modelo": "COROLLA",
        "año": "2020",
        "placa": "ABC-1234",
        "motor": "3ZZ1234567",
        "color": "BLANCO",
        "comprador": "JUAN MARTINEZ",
        "vendedor": "MARIA RODRIGUEZ",
        "valorVenta": "25000.00"
      },
      "notarial": {
        "numeroEscritura": "1234",
        "fechaEscritura": "2025-01-01T00:00:00Z",
        "notario": "DR. PEDRO GONZALEZ",
        "canton": "QUITO",
        "provincia": "PICHINCHA",
        "valorOperacion": "25000.00",
        "articulo29": false
      },
      "camposExtraidos": [
        {
          "nombre": "COMPRADOR_NOMBRE",
          "valor": "JUAN CARLOS MARTINEZ LOPEZ",
          "confianza": 0.95,
          "tipo": "person_name"
        }
      ]
    },
    "metadata": {
      "source": "clipboard_paste",
      "processingTime": 5432,
      "ocrEngine": "tesseract.js",
      "version": "1.0.0",
      "clipboardData": {
        "originalFormat": "image/png",
        "timestamp": 1640995200000
      }
    }
  }
}
```

---

### 7. Get Raw Extracted Data

Get all extracted fields without structure processing.

**Endpoint**: `GET /:id/extracted-data/raw`

**Rate limit**: 100/min

#### Parameters

- `minConfidence` (number): Minimum confidence filter (0-1, default: 0)

```bash
curl -X GET "/api/documents/doc_abc123/extracted-data/raw?minConfidence=0.8" \
  -H "Authorization: Bearer <token>"
```

**Response**:
```json
{
  "success": true,
  "data": {
    "documentId": "doc_abc123",
    "documentType": "PDF_EXTRACTO",
    "status": "EXTRACTED",
    "fields": {
      "all": [/* all fields */],
      "byType": {
        "person_name": [/* person name fields */],
        "vehicle_info": [/* vehicle fields */],
        "other": [/* other fields */]
      },
      "byConfidence": {
        "high": [/* >=0.8 confidence */],
        "medium": [/* 0.5-0.79 */],
        "low": [/* <0.5 */]
      }
    },
    "statistics": {
      "totalFields": 24,
      "averageConfidence": 0.87,
      "confidenceDistribution": {
        "high": 18,
        "medium": 5,
        "low": 1
      }
    }
  }
}
```

---

### 8. Process Document Manually

Trigger OCR processing manually or reprocess existing document.

**Endpoint**: `POST /:id/process`

**Rate limit**: 50/5min

```bash
curl -X POST "/api/documents/doc_abc123/process" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "forceReprocess": false,
    "options": {
      "minConfidence": 0.7,
      "extractImages": true,
      "enhanceImage": true,
      "ocrLanguage": "spa"
    }
  }'
```

**Response** (202 Accepted):
```json
{
  "success": true,
  "data": {
    "jobId": "manual_doc_abc123_1640995200",
    "documentId": "doc_abc123",
    "status": "queued",
    "progress": 0,
    "startedAt": "2025-01-01T10:00:00Z"
  }
}
```

---

### 9. Get Processing Status by ID

Get processing status by job ID or document ID.

**Endpoint**: `GET /processing/:id/status`

**Rate limit**: 100/min

#### Parameters

- `type` (enum): 'job' or 'document' (default: 'document')

```bash
curl -X GET "/api/documents/processing/job_xyz789/status?type=job" \
  -H "Authorization: Bearer <token>"
```

---

### 10. Cancel Processing

Cancel an active processing job.

**Endpoint**: `DELETE /processing/:id/cancel`

**Rate limit**: 50/5min

#### Parameters

- `type` (enum): 'job' or 'document' (default: 'document')

```bash
curl -X DELETE "/api/documents/processing/doc_abc123/cancel?type=document" \
  -H "Authorization: Bearer <token>"
```

**Response**:
```json
{
  "success": true,
  "data": {
    "jobId": "job_xyz789",
    "status": "cancelled",
    "message": "Processing job cancelled successfully"
  }
}
```

---

### 11. Retry Failed Processing

Retry a failed processing job.

**Endpoint**: `POST /processing/:id/retry`

**Rate limit**: 50/5min

```bash
curl -X POST "/api/documents/processing/doc_abc123/retry?type=document" \
  -H "Authorization: Bearer <token>"
```

---

### 12. Health Check Endpoints

Monitor service health and get statistics.

#### Main Health Check
`GET /health`

#### Service-specific Health Checks
- `GET /health/upload` - Upload service
- `GET /health/retrieve` - Retrieval service  
- `GET /health/extract` - Extraction service
- `GET /health/process` - Processing service

```bash
curl -X GET "/api/documents/health" \
  -H "Authorization: Bearer <token>"
```

**Response**:
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2025-01-01T10:00:00Z",
    "services": {
      "database": "connected",
      "uploadDirectory": "accessible",
      "processingQueue": "operational"
    }
  }
}
```

---

## Error Responses

All endpoints return standardized error responses:

```json
{
  "success": false,
  "error": "Error title",
  "details": "Detailed error description",
  "code": "ERROR_CODE",
  "timestamp": "2025-01-01T10:00:00Z",
  "requestId": "req_1640995200_abc123"
}
```

### Common Error Codes

- `VALIDATION_ERROR` - Invalid request data
- `DOCUMENT_NOT_FOUND` - Document doesn't exist
- `FILE_TOO_LARGE` - File exceeds size limit
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `PROCESSING_FAILED` - OCR processing failed
- `INTERNAL_ERROR` - Server error

---

## WebSocket Events (Real-time)

Subscribe to real-time processing updates:

```javascript
const socket = io('/documents');

// Join document processing updates
socket.emit('join-document', { documentId: 'doc_abc123' });

// Listen for processing progress
socket.on('processing-progress', (data) => {
  console.log('Progress:', data.progress);
  console.log('Stage:', data.stage);
  console.log('Message:', data.message);
});

// Listen for completion
socket.on('processing-completed', (data) => {
  console.log('Document processed:', data.documentId);
  console.log('Fields extracted:', data.fieldsCount);
});
```

---

## Integration Examples

### React Hook for Document Upload

```typescript
import { useState } from 'react';

interface UploadHook {
  upload: (files: FileList | ClipboardData) => Promise<void>;
  progress: number;
  status: 'idle' | 'uploading' | 'processing' | 'completed' | 'error';
  documents: Document[];
  error: string | null;
}

export const useDocumentUpload = (): UploadHook => {
  const [state, setState] = useState({
    progress: 0,
    status: 'idle' as const,
    documents: [],
    error: null
  });

  const upload = async (input: FileList | ClipboardData) => {
    setState(prev => ({ ...prev, status: 'uploading', error: null }));
    
    try {
      // Handle clipboard paste
      if (input instanceof ClipboardEvent) {
        const clipboardData = await processClipboardData(input);
        const response = await uploadClipboardData(clipboardData);
        setState(prev => ({ 
          ...prev, 
          status: 'processing', 
          documents: response.data.documents 
        }));
      } 
      // Handle file upload
      else {
        const formData = new FormData();
        Array.from(input).forEach(file => formData.append('files', file));
        
        const response = await uploadFiles(formData);
        setState(prev => ({ 
          ...prev, 
          status: 'processing',
          documents: response.data.documents 
        }));
      }
      
      // Monitor processing progress
      await monitorProcessing();
      
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        status: 'error', 
        error: error.message 
      }));
    }
  };

  return { upload, ...state };
};
```

### Python SDK Example

```python
import requests
from typing import List, Dict, Optional

class NotarialFormsAPI:
    def __init__(self, base_url: str, api_token: str):
        self.base_url = base_url
        self.headers = {
            'Authorization': f'Bearer {api_token}',
            'Content-Type': 'application/json'
        }
    
    def upload_clipboard_data(self, 
                            clipboard_data: str, 
                            filename: str,
                            file_type: str) -> Dict:
        """Upload clipboard data (base64) to the API."""
        payload = {
            'files': [{
                'name': filename,
                'type': file_type,
                'data': clipboard_data,
                'source': 'clipboard',
                'metadata': {
                    'timestamp': int(time.time() * 1000)
                }
            }],
            'autoProcess': True
        }
        
        response = requests.post(
            f'{self.base_url}/api/documents/upload',
            json=payload,
            headers=self.headers
        )
        return response.json()
    
    def get_extracted_data(self, document_id: str) -> Dict:
        """Get structured extracted data for forms."""
        response = requests.get(
            f'{self.base_url}/api/documents/{document_id}/extracted-data',
            headers=self.headers
        )
        return response.json()
    
    def monitor_processing(self, document_id: str) -> Dict:
        """Monitor document processing status."""
        response = requests.get(
            f'{self.base_url}/api/documents/{document_id}/status',
            headers=self.headers
        )
        return response.json()

# Usage
api = NotarialFormsAPI('https://api.notaria18.com', 'your-token')

# Upload and process
result = api.upload_clipboard_data(
    clipboard_data='data:image/png;base64,iVBOR...',
    filename='vehicle-screenshot.png',
    file_type='image/png'
)

# Get extracted data
extracted = api.get_extracted_data(result['data']['documents'][0]['id'])
print(f"Extracted {len(extracted['data']['formData']['camposExtraidos'])} fields")
```

---

## Performance Optimization

### Recommended Practices

1. **Batch uploads**: Upload multiple files in single request
2. **Use pagination**: Don't request all documents at once  
3. **Filter effectively**: Use status, type, and date filters
4. **Cache responses**: Implement client-side caching for static data
5. **WebSocket monitoring**: Use real-time updates instead of polling
6. **Compress images**: Optimize image size before clipboard upload

### Monitoring Metrics

Track these key metrics for optimal performance:

- Upload success rate (>95%)
- Average processing time (<30s for PDFs, <15s for images)
- OCR accuracy (>90% confidence for structured documents)
- Queue processing rate (>10 documents/minute)
- API response time (<2s for queries, <5s for uploads)

---

For technical support or feature requests, contact the development team or check the project documentation.