import type React from "react";
import { useState } from "react";
import API from "../../axiosConfig";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import { Bubbles, Loader } from "lucide-react";

interface loginDetail {
    email: string,
    password: string
}
const LogIn: React.FC = () => {
    const { login: setAuthUser } = useAuth();
    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');
    const navigate = useNavigate();

    const [login, setLogin] = useState<loginDetail>({
        email: '',
        password: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        const { name, value } = e.target;
        setLogin((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleLogin = async (e: React.SubmitEvent<HTMLElement>) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        const loginUser = {
            email: login.email,
            password: login.password
        }
        try {
            const response = await API.post('/users/login', loginUser);

            if (response.status === 200 || response.data?.success) {

                const userData = response.data.data;

                setAuthUser({
                    id: userData?.id,
                    name: userData?.name,
                    email: userData?.email,
                    role: userData?.role || 'user',
                    phone: userData?.phone,
                    dob: userData?.dob,
                    profilePhoto: userData?.profilePhoto,
                    address: userData?.address,
                    isPremium: userData?.isPremium === true || userData?.isPremium === 'true'
                });
                navigate('/dashboard');
            }
        } catch (error: any) {
            console.error("Login failed", error);
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    }
    return (
        <div className="card">
            <header>
                <h1>Welcome Back</h1>
                {message && <p style={{ color: "red" }}> {message}</p>}
            </header>
            <form className="form-field" onSubmit={handleLogin}>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        required
                        value={login.email}
                        onChange={handleChange}
                        placeholder="    : 555@xyz.com"
                        autoComplete="email"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        required
                        value={login.password}
                        onChange={handleChange}
                        placeholder="    : Password"
                        autoComplete="password"
                    />
                </div>
                <button className='btn btn--primary' type="submit">
                    {loading ?
                        (<>
                            <Loader />
                            <Bubbles />
                        </>) : (
                            <span>LogIn</span>
                        )
                    }
                </button>
            </form>
            <Link to="/fogotpassword">Forgot Password?</Link>

        </div>
    )
}

export default LogIn;