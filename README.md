# Notarial Forms

A modern monorepo for notarial form management and processing.

## Project Structure

```
notarial-forms/
├── packages/
│   ├── frontend/          # React + TypeScript frontend
│   └── backend/           # Node.js + Express backend
└── package.json           # Workspace configuration
```

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Framer Motion** for animations
- **React Hook Form** for form handling
- **Zod** for validation
- **Zustand** for state management
- **Day.js** for date handling

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **Zod** for validation
- **Day.js** for date handling
- **Helmet** for security
- **CORS** enabled

## Getting Started

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

```bash
# Install all dependencies
npm install

# Start development servers
npm run dev

# Build all packages
npm run build

# Start production server
npm start
```

### Development

#### Frontend Development
```bash
# Start frontend dev server (port 3000)
npm run dev --workspace=frontend
```

#### Backend Development
```bash
# Start backend dev server (port 3001)
npm run dev --workspace=backend
```

## Available Scripts

- `npm run dev` - Start frontend development server
- `npm run build` - Build all packages
- `npm start` - Start production backend server
- `npm test` - Run tests in all packages
- `npm run lint` - Lint all packages
- `npm run clean` - Clean build artifacts

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/hello` - Simple greeting endpoint

## License

Private project for notarial form management.