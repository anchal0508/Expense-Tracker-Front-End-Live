import { Bubbles, Loader } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../axiosConfig";
interface signupDetails {
    name: string,
    email: string,
    phone: string,
    password: string
    Confirmpass: string
}
const SignUp: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');
    const navigate = useNavigate();

    const [signup, setSignup] = useState<signupDetails>({
        name: '',
        email: '',
        phone: '',
        password: '',
        Confirmpass: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setSignup((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFormSubmit = async (e: React.SubmitEvent<HTMLElement>) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        if (signup.password !== signup.Confirmpass) {
            setMessage('Both Password sould be Same...');
            setLoading(false);
            return;
        }

        const newUser = {
            name: signup.name,
            email: signup.email,
            phone: signup.phone,
            password: signup.password,
        }

        try {
            const response = await API.post('/users/addUser', newUser);
            if (response.status === 201) {
                setMessage(response.data.data.message);
                navigate('/');
            }
        } catch (error: any) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
        e.target.reset();
    }

    return (
        <div className="card">
            <header>
                <h1>Join us Today</h1>
                {message && <span>{message}</span>}
            </header>
            <form className="form-field" onSubmit={handleFormSubmit}>

                <div className="form-group">
                    <label htmlFor="name">Your Name</label>
                    <input
                        type="name"
                        name="name"
                        id="name"
                        required
                        value={signup.name}
                        onChange={handleChange}
                        placeholder="    : Anchal Koshta"
                        autoComplete="name"
                    />
                </div>



                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        required
                        value={signup.email}
                        onChange={handleChange}
                        placeholder="    : 555@xyz.com"
                        autoComplete="email"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input
                        type="tel"
                        name="phone"
                        id="phone"
                        required
                        value={signup.phone}
                        onChange={handleChange}
                        placeholder="    : 9876543210"
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
                        value={signup.password}
                        onChange={handleChange}
                        placeholder="    : Password"
                        autoComplete="password"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="Confirmpass">Confirm Password</label>
                    <input
                        type="password"
                        name="Confirmpass"
                        id="Confirmpass"
                        required
                        value={signup.Confirmpass}
                        onChange={handleChange}
                        placeholder="    : Confirm Password"
                        autoComplete="Confirmpass"
                    />
                </div>
                <button className='btn btn--primary' type="submit">
                    {loading ?
                        (<>
                            <Loader />
                            <Bubbles />
                        </>) : (
                            <span>SignUp</span>
                        )
                    }
                </button>

            </form>

        </div>
    )
}

export default SignUp;