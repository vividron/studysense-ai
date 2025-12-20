import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

import SignInPage from './pages/auth/SignInPage'
import SignUpPage from './pages/auth/SignUpPage'
import PageNotFound from './pages/PageNotFound'
import DocumentListPage from './pages/documents/DocumentListPage'
import DocumentDetailPage from './pages/documents/DocumentDetailPage'
import ActivityPage from './pages/activityPage'
import QuizPage from './pages/quizzes/QuizPage'
import QuizResultPage from './pages/quizzes/QuizResultPage'
import ProfilePage from './pages/ProfilePage'

const App = () => {
  const isAuthenticated = false;
  const isLoading = false;

  if (isLoading) {
    return (
      <div className='flex justify-center items-center'>
        Loading...
      </div>
    )
  }
  return (
    <Router>
      <Routes>
        <Route path='/' element={isAuthenticated ? <Navigate to='/activity' replace /> : <Navigate to='/signin' replace />} />
        <Route path='/signin' element={<SignInPage />} />
        <Route path='/signup' element={<SignUpPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/activity" element={<ActivityPage />} />
          <Route path="/documents" element={<DocumentListPage />} />
          <Route path="/documents/:id" element={<DocumentDetailPage />} />
          <Route path="/quizzes/: quizId" element={<QuizPage />} />
          <Route path="/quizzes/: quizId/results" element={<QuizResultPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        <Route path='*' element={<PageNotFound />} />
      </Routes>
    </Router>
  )
}

export default App