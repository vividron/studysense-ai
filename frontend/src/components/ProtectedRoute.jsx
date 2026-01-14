import { Navigate, Outlet } from 'react-router-dom'
import AppLayout from './layout/AppLayout'
import { useAuth } from '../context/authContext'
import Loader from './Loader'

const ProtectedRoute = () => {
    const {isAuthenticated, loading} = useAuth();

    if (loading) {
        return <Loader/>
    }

    return (
        isAuthenticated ? (
            <AppLayout>
                <Outlet />
            </AppLayout>
        ) : <Navigate to='/signin' replace/>
    )
}

export default ProtectedRoute