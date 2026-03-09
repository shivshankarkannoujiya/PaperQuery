# PaperQuery

[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-v20+-green)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)

**PaperQuery** is a modern full-stack Retrieval-Augmented Generation (RAG) application that enables intelligent conversations with PDF documents. Upload your PDFs and interact with them using natural language powered by OpenAI's language models.

## 🌟 Features

- **PDF Upload**: Seamlessly upload and process PDF documents
- **Intelligent Chat**: Ask questions about your PDF documents and receive accurate, context-aware responses
- **RAG Architecture**: Uses state-of-the-art retrieval-augmented generation for accurate information extraction
- **Real-time Processing**: Background job queues for efficient PDF ingestion
- **Vector Search**: Leverages Qdrant vector database for semantic search
- **User Authentication**: Secure authentication with Clerk
- **Responsive UI**: Modern, responsive interface built with React and Tailwind CSS
- **Production-Ready**: Docker support for easy deployment

## 🏗️ Architecture

### Tech Stack

| Component           | Technology                                     |
| ------------------- | ---------------------------------------------- |
| **Frontend**        | Next.js 16, React 19, TypeScript, Tailwind CSS |
| **Backend**         | Node.js, Express.js                            |
| **LLM**             | OpenAI API (GPT-4)                             |
| **Embeddings**      | OpenAI Text Embedding 3-Small                  |
| **Vector Database** | Qdrant                                         |
| **Cache Layer**     | Valkey (Redis)                                 |
| **Job Queue**       | BullMQ                                         |
| **File Upload**     | Multer                                         |
| **Auth**            | Clerk                                          |

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v20 or higher
- **pnpm**: v10.17.1 or higher (package manager)
- **Docker & Docker Compose**: For running Qdrant and Valkey
- **OpenAI API Key**: [Get it here](https://platform.openai.com/api-keys)
- **Clerk Authentication Keys**: [Create a Clerk app](https://clerk.com)

## 🚀 Quick Start

### 1. Clone and Install Dependencies

```bash
# Install dependencies for both client and server
pnpm install
```

### 2. Set Up Environment Variables

#### Server Configuration

Create a `.env` file in the `server/` directory:

```env
# Server
PORT=8000

# Database & Cache
VALKEY_HOST=localhost
VALKEY_PORT=6379
QDRANT_URL=http://localhost:6333

# OpenAI
OPENAI_API_KEY=your_openai_api_key_here
```

#### Client Configuration

Create a `.env.local` file in the `client/` directory:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# API
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. Start Infrastructure Services

```bash
cd server
docker-compose up -d
```

This starts:

- **Qdrant**: Vector database (port 6333)
- **Valkey**: Redis-compatible cache (port 6379)

### 4. Start Development Servers

#### Terminal 1 - Backend Server

```bash
cd server
pnpm dev
# Server running on http://localhost:8000
```

#### Terminal 2 - PDF Processing Worker

```bash
cd server
pnpm dev:worker
```

#### Terminal 3 - Frontend Client

```bash
cd client
pnpm dev
# Client running on http://localhost:3000
```

## 📁 Project Structure

```
PaperQuery/
├── client/                      # Next.js Frontend
│   ├── app/
│   │   ├── components/
│   │   │   ├── Chat.tsx        # Chat interface component
│   │   │   └── File-upload.tsx # PDF upload component
│   │   ├── icons/              # Icon components
│   │   ├── layout.tsx          # Root layout with auth
│   │   ├── page.tsx            # Home page
│   │   └── globals.css         # Global styles
│   ├── middleware.ts           # Clerk auth middleware
│   └── package.json
│
├── server/                      # Node.js Backend
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── chat.controller.js         # Chat logic handler
│   │   │   └── ingestion.controller.js    # PDF ingestion handler
│   │   ├── routes/
│   │   │   ├── chat.routes.js    # Chat API endpoints
│   │   │   └── ingesion.routes.js # Ingestion API endpoints
│   │   ├── services/
│   │   │   └── rag.service.js     # RAG implementation with LangChain
│   │   ├── queues/
│   │   │   ├── pdf.queue.js       # PDF processing job queue
│   │   │   └── pdf.worker.js      # PDF processing worker
│   │   ├── middlewares/
│   │   │   └── multer.middleware.js # File upload middleware
│   │   ├── config/
│   │   │   ├── env.js             # Environment configuration
│   │   │   └── valkey.config.js   # Valkey/Redis configuration
│   │   ├── app.js                 # Express app setup
│   │   └── index.js               # Server entry point
│   ├── docker-compose.yml       # Docker services configuration
│   └── package.json
│
└── README.md                    # Project documentation
```

## 🔌 API Endpoints

### Ingestion API

**POST** `/api/v1/ingest`

- Upload and process a PDF document
- **Headers**: `Content-Type: multipart/form-data`
- **Form Data**: `file` (PDF file)
- **Response**: Job ID for tracking

### Chat API

**POST** `/api/v1/chat`

- Query the ingested documents
- **Body**: `{ "question": "Your question here" }`
- **Response**: JSON response with AI-generated answer
- **Streaming**: Supports streaming responses for real-time output

## 🔐 Environment Variables

### Server Configuration

| Variable         | Description          | Example                 |
| ---------------- | -------------------- | ----------------------- |
| `PORT`           | Server port          | `8000`                  |
| `VALKEY_HOST`    | Valkey/Redis host    | `localhost`             |
| `VALKEY_PORT`    | Valkey/Redis port    | `6379`                  |
| `QDRANT_URL`     | Qdrant vector DB URL | `http://localhost:6333` |
| `OPENAI_API_KEY` | OpenAI API key       | `sk-proj-...`           |

### Client Configuration

| Variable                            | Description           |
| ----------------------------------- | --------------------- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key |
| `CLERK_SECRET_KEY`                  | Clerk secret key      |
| `NEXT_PUBLIC_API_URL`               | Backend API URL       |

## 📚 Development

### Available Scripts

#### Client

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
```

#### Server

```bash
pnpm dev          # Start development server with auto-reload
pnpm dev:worker   # Start PDF processing worker with auto-reload
```

### Code Quality

The project uses:

- **ESLint**: JavaScript/TypeScript linting
- **TypeScript**: Type safety and better developer experience
- **Tailwind CSS**: Utility-first CSS framework

## 🐳 Docker Deployment

### Build Docker Image

```bash
docker build -t paperquery-client -f client/Dockerfile .
docker build -t paperquery-server -f server/Dockerfile .
```

### Run with Docker Compose

```bash
docker-compose up -d
```

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

---

**Built with ❤️ for document intelligence**
