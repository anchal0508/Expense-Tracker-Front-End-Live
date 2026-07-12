import { Bubbles, Loader } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import API from "../axiosConfig";
import { useParams } from "react-router-dom";

const ResetPassword: React.FC = () => {
    const [newPassword, setNewPassword] = useState<string>('');
    const [Confirmpass, setConfirmPass] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [linkValidation, setLinkValidation] = useState<boolean | null>(null);
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        if (!id) {
            setLinkValidation(false);
            setLoading(false);
            return;
        }

        const verifyLink = async () => {
            try {
                const response = await API.get(`/password/passwordverification/${id}`);
                console.log(response);
                if (response.status === 200) {
                    setLinkValidation(true);
                    setMessage(response.data?.message);

                }
            } catch (error: any) {
                setMessage(error.response?.data?.message);
                setLinkValidation(false);
            } finally {
                setLoading(false);
            }
        };

        verifyLink();
    }, [id]);

    if (loading) {
        return <div className="loading">Loading...</div>
    }
    const handleReset = async (e: React.SubmitEvent<HTMLElement>) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        if (newPassword !== Confirmpass) {
            setMessage('Error: Both passwords should be same');
            return;
        }
        try {
            const response = await API.post(`/password/updatepassword/${id}`, { newPassword });
            if (response.status === 200) {
                setMessage(`${response.data.message}` || "Password reset Successfull");
            }
        } catch (error: any) {
            setMessage(error.response?.data?.message);
        } finally {
            setLoading(false);
        }

    }
    return (
        <div className="resetPassword-page">
            {
                linkValidation ? (
                    <div className="card">
                        <header>
                            <h1>Enter Your Password</h1>
                            {message && <p style={{ color: "red" }}> {message}</p>}
                        </header>
                        <br />
                        <form className="form-field" onSubmit={handleReset}>


                            <div className="form-group">
                                <label htmlFor="newPassword">New Password</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    id="newPassword"
                                    required
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="    : New Password"

                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="Confirmpass">Confirm Password</label>
                                <input
                                    type="password"
                                    name="Confirmpass"
                                    id="Confirmpass"
                                    required
                                    value={Confirmpass}
                                    onChange={(e) => setConfirmPass(e.target.value)}
                                    placeholder="    : Confirm Password"
                                />
                            </div>
                            <button className='btn btn--primary' type="submit">
                                {loading ?
                                    (<>
                                        <Loader />
                                        <Bubbles />
                                    </>) : (
                                        <span>Reset Your Password</span>
                                    )
                                }
                            </button>
                        </form>
                    </div>

                ) : (

                    <p>Link is not valid or Expired</p>)
            }
        </div>
    )
}


export default ResetPassword;