import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext"


const GuestRoutes = () => {
    const {user} = useAuth();
    if(user){
        return <Navigate to="/dashboard" replace />;
    }
    return <Outlet />
}

export default GuestRoutes;