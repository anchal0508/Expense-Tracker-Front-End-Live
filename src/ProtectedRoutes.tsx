import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoutes: React.FC = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="loading">Loading Authorization Matrix...</div>;
    }

    if (!user) {
        return <Navigate to='/' replace={true} />;
    }

    return <Outlet />;
};

export default ProtectedRoutes;
