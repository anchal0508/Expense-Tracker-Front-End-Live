import { Bubbles, Loader } from "lucide-react";
import type React from "react";
import { useState } from "react";
import API from "../axiosConfig";
import { Link } from "react-router-dom";


const ForgotPassword: React.FC = () => {
    const [message, setMessage] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);


    const handleFormSubmit = async (e: React.SubmitEvent<HTMLElement>) => {
        e.preventDefault();
        setMessage('');
        setLoading(true);

        try {
            const response = await API.post('/password/forgotreq', { email });
            console.log(response);
            if (response.status === 200) {
                setMessage(response.data.message);
                setSuccess(true);
            }
        } catch (error: any) {
            setMessage(`Password Reset Error:  ${error.response?.data?.message || error.message}`);
            setSuccess(false);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="password-page">
            <div className="card">
                <header>
                    <h1>Forgot Password</h1>
                    {message && <p style={{ color: "red" }}> {message}</p>}
                </header>
                <br />
                {!success && (
                    <form className="form-field" onSubmit={handleFormSubmit}>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="    : 555@xyz.com"
                                autoComplete="email"
                            />
                        </div>

                        <button className='btn btn--primary' type="submit">
                            {loading ?
                                (<>
                                    <Loader />
                                    <Bubbles />
                                </>) : (
                                    <span>Request Password reset</span>
                                )
                            }
                        </button>
                    </form>)}
                <br />
                <p>Back to <Link to="/">Login/SignUp</Link> </p>
            </div>
        </div>
    );
}



export default ForgotPassword;