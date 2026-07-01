import type React from "react";
import logoImg from '../../Images/logo.png';
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
    return (
        <footer>
            <img src={logoImg} alt="logo" />
            @Anchal Koshta | 555-Transformation | abcrob.in
            <div className="links">
                <Link to="/">Home</Link>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/profile">Profile</Link>
                <Link to="/login">LogIn | SignUp</Link>
            </div>
        </footer>
    )
}

export default Footer;