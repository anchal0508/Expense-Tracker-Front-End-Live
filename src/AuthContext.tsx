import React, { createContext, useState, useEffect, useContext } from 'react';
import API from './axiosConfig';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    phone?: string;
    dob?: string;
    profilePhoto?: string;
    address?: string;
    isPremium?: boolean;
}

interface AuthContextType {
    user: User | null;
    login: (userData: User) => void;
    logout: () => void;
    loading: boolean;
}

interface AuthProviderProps {
    children: React.ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);


    useEffect(() => {
        const checkLoggedInUser = async () => {
            try {

                setTimeout(() => {
                    console.log('Normal delay');
                }, 1000);
                const response = await API.get('/users/profile');
                if (response.data?.success) {
                    setUser(response.data.data);
                    console.log("User is premium: ", response.data.data);
                }
            } catch (error: any) {
                console.error("Profile check failed with error: ", error.response?.data || error.message);
                //   await API.post('/users/logout');
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        setTimeout(() => {
            console.log('Normal delay');
            checkLoggedInUser();
        }, 1500);
    }, []);


    const login = (userData: User) => {
        setUser(userData);
    };

    const logout = async () => {
        try {
            const response = await API.post('/users/logout');
            console.log(response);
        } catch (error) {
            console.error("Logout failed", error);
        } finally {
            setUser(null);
            localStorage.clear();
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom Hook, so that we can use it in any component
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};
