# StudySense AI

🔗 Live App: https://studysense-ai.vercel.app

StudySense AI turns your documents into an interactive study space.
Upload your notes or any PDF and it generates quizzes to test you. If you get stuck on a question or have a doubt, you can ask the AI directly from the same document. It also provides quick summaries and helps you manage all your study material in one place.
Built mainly for students, but works for anyone who wants to learn or remember things faster.

## 🖥️ Desktop View
<img width="1919" height="866" alt="Screenshot 2026-01-24 145616" src="https://github.com/user-attachments/assets/81d5fffe-6684-4bd5-8bf3-72ca55fb3c18" />
<img width="1919" height="858" alt="Screenshot 2026-01-24 145641" src="https://github.com/user-attachments/assets/a59de5d7-c74c-4623-9503-50d052c688c9" />
<img width="1919" height="865" alt="Screenshot 2026-01-24 150201" src="https://github.com/user-attachments/assets/14edb30a-4466-4599-ba79-00b6d89ee338" />
<img width="1919" height="863" alt="Screenshot 2026-01-24 145753" src="https://github.com/user-attachments/assets/95cba9e1-09c7-4ce8-aa4c-5d568d26d397" />
<img width="1917" height="859" alt="Screenshot 2026-01-24 145833" src="https://github.com/user-attachments/assets/01e7fc94-4aac-41f1-8e36-875b625899a2" />
<img width="1919" height="862" alt="Screenshot 2026-01-24 145912" src="https://github.com/user-attachments/assets/03b2cda4-f423-4061-94e0-cfff8a58bff4" />

## 📱 Mobile View
<table>
  <tr>
    <td><img src="https://github.com/user-attachments/assets/aa8f39eb-37de-4de2-a254-4dcff943f7ee" width="250"/></td>
    <td><img src="https://github.com/user-attachments/assets/f2c2eaa5-bbe6-48c3-a173-1fe2ac90b47c" width="250"/></td>
    <td><img src="https://github.com/user-attachments/assets/4305f3c3-a1d1-4307-83d8-53312fffb506" width="250"/></td>
    <td><img src="https://github.com/user-attachments/assets/af411222-c98a-429f-8782-fdbc51d88dbf" width="250"/></td>
  </tr>
</table>


## ✨ Key Features of StudySense AI
 
- 🧠 **AI-Powered Quiz Generation**: Automatically generate quizzes from your study documents using Gemini AI  
- ❓ **Interactive Chat**: Ask AI doubts directly from your document to clarify concepts and get explanations  
- 📚 **Document Summarization**: Get AI-generated summaries of your study materials for faster revision  
- 🔥 **Quiz Streak System**: To build daily study consistency  
- 📊 **Quiz Tracking**: Track quiz performance and view detailed results  
- 🗂️ **Activity Dashboard**: Monitor your study activity and overall progress  
- 🗃️ **Organized Document Hub**: Manage and access all uploaded documents in one place  
- 🔎 **Semantic Search**: Find relevant content using vector-based document search  
- 📱 **Fully Responsive UI**: Smooth experience on desktop and mobile  

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library  
- **Vite** - Fast build tool and dev server  
- **Tailwind CSS** - Utility-first CSS framework  
- **React Router** - Client-side routing  
- **React Hook Form** - Form state management  
- **Axios** - HTTP client  
- **React Markdown** - Markdown rendering  
- **Lucide React** - Icon library  
- **React Hot Toast** - Toast notifications  

### Backend
- **Node.js** - JavaScript runtime  
- **Express 5** - Web framework  
- **MongoDB** - Database  
- **Mongoose** - MongoDB object modeling  
- **Gemini API (Google Generative AI)** - LLM for quiz generation, summaries, and Q&A  
- **JWT** - Authentication  
- **Bcrypt** - Password hashing  
- **Multer** - File upload handling  
- **PDF-Parse** - PDF text extraction  

### AI & Search
- **Gemini Embedding Model** - Vector embeddings generation  
- **MongoDB Vector Index** - Semantic search and context retrieval  
- **RAG (Retrieval Augmented Generation)** - Document-based AI responses 

### Cloud & Storage
- **AWS S3** - Document storage  
- **AWS S3 Presigned URLs** - Secure, time-limited document access  

## 💻 Local Setup

### 📋 Prerequisites

Before running this application, ensure you have:

- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager
- **MongoDB** (local or Atlas account)
- **Google Gemini API Key** (for AI features)
- **AWS S3 Bucket with credentials** (for cloud storage)

Clone the repository:

```bash
git clone https://github.com/vividron/studysense-ai.git
cd studysense-ai
```

```bash
# Backend
cd backend
npm install
```

```bash
# Frontend
cd frontend
npm install
```


## Environment Variables
Create a .env file

```bash
#frontend
VITE_API_BASE_URL=http://localhost:8000
```

```bash
#backend
FRONTEND_URL=http://localhost:5173
PORT=8000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

# Gemini
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash-lite
GEMINI_EMBEDDING_API_KEY=your_gemini_embedding_api_key
EMBEDDING_MODEL=gemini-embedding-001

# AWS S3
AWS_BUCKET_NAME=your_s3_bucket_name
AWS_REGION=your_s3_bucket_region
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
```

## Run the Project

```bash
cd backend
npm run dev
```

```bash
cd frontend
npm run dev
```

## 📡 API Endpoints

### Authentication (`/api/auth`)
- `POST /signup` - Register a new user
- `POST /signin` - Login user
- `POST /logout` - Logout user

### Documents (`/api/documents`)
- `GET /` - Get all user documents
- `POST /upload` - Upload a new document
- `GET /:id` - Get document details
- `DELETE /:id` - Delete a document

### AI Features (`/api/ai`)
- `POST /chat` - Chat about documents
- `POST /summarize` - Generate document summary

### Quizzes (`/api/quizzes`)
- `GET /` - Get all quizzes
- `POST /generate` - Generate quiz from document
- `GET /:id` - Get quiz details
- `POST /:id/submit` - Submit quiz answers
- `DELETE /:id` - Delete a quiz

### Activity (`/api/activity`)
- `GET /` - Get user activity stats
- `GET /streak` - Get study streak information

## 📁 Project Structure

```
studysense-ai/
├── backend/
│   ├── config/                 # Configuration files
│   │   ├── aws.js              # AWS S3 setup
│   │   ├── db.js               # MongoDB connection
│   │   └── multer.js           # File upload config
│   ├── controllers/            # Request handlers
│   │   ├── activityController.js
│   │   ├── aiController.js
│   │   ├── authController.js
│   │   ├── documentController.js
│   │   └── quizController.js
│   ├── middleware/             # Express middleware
│   │   ├── authMiddleware.js
│   │   └── errorHandler.js
│   ├── models/                 # Database schemas
│   │   ├── chat.js
│   │   ├── document.js
│   │   ├── quiz.js
│   │   └── user.js
│   ├── routes/                 # API routes
│   │   ├── activityRoutes.js
│   │   ├── aiRoutes.js
│   │   ├── authRoutes.js
│   │   ├── documentRoutes.js
│   │   └── quizRoutes.js
│   ├── utils/                  # Utility functions
│   │   ├── AppError.js
│   │   ├── fileSizeFormatter.js
│   │   ├── geminiService.js
│   │   ├── pdfParser.js
│   │   ├── quizStreakHelper.js
│   │   └── textChunker.js
│   ├── uploads/                # Local uploads directory
│   ├── package.json
│   └── server.js               # Entry point
│
└── frontend/
    ├── src/
    │   ├── api/                # API integration
    │   │   ├── activity.api.js
    │   │   ├── ai.api.js
    │   │   ├── auth.api.js
    │   │   ├── document.api.js
    │   │   ├── quiz.api.js
    │   │   └── config/
    │   │       ├── axios.js
    │   │       └── utils/
    │   ├── assets/             # Static assets
    │   │   └── fonts/
    │   ├── components/         # Reusable React components
    │   │   ├── document-detail/
    │   │   ├── documents/
    │   │   ├── layout/
    │   │   ├── quizzes/
    │   │   ├── Button.jsx
    │   │   ├── DeleteConfimModal.jsx
    │   │   ├── Loader.jsx
    │   │   ├── ProtectedRoute.jsx
    │   │   ├── StatCard.jsx
    │   │   └── Tabs.jsx
    │   ├── context/            # React Context
    │   │   └── authContext.jsx
    │   ├── pages/              # Page components
    │   │   ├── auth/
    │   │   ├── documents/
    │   │   ├── quizzes/
    │   │   ├── ActivityPage.jsx
    │   │   └── ProfilePage.jsx
    │   ├── schemas/            # Validation schemas
    │   │   └── authSchema.js
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    ├── eslint.config.js
    ├── package.json
    ├── vite.config.js
    ├── vercel.json
    ├── README.md
    └── index.html
```

## 📝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues, questions, or suggestions, please open an issue on the repository.

---

**Happy Studying! 📚**
