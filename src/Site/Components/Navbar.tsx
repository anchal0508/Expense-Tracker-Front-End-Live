import { Link, replace, useNavigate } from "react-router-dom";
import logoImg from '../../Images/logo.png';
import { useEffect, useState } from "react";
import { useAuth } from "../../AuthContext";

const Navbar: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const themes = ['base', 'focus', 'dark', 'happy'];
    const [currentIdx, setCurrentIdx] = useState(0);

    // Setting attribute of ducument element
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', themes[currentIdx]);
    }, [currentIdx]);

 

    const handleChangeTheme = () => {
        setCurrentIdx((prevIdx) => (prevIdx + 1) % themes.length);
    }

    const handleLogout = async () => {
        await logout();
        navigate('/')
    }
    return (
        <nav className="navbar">

            <div className="logo-img">
                <img src={logoImg} alt="" />
            </div>

            <div className="tabs">
                <Link to="/" >Home</Link>
                <Link to="/dashboard" >Dashboard</Link>
                <Link to="/profile" >Profile</Link>
            </div>

            <div className="action" >
                {/* <button className="theme-switch">Theme</button> */}
                <div className="switch" onClick={handleChangeTheme}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-swatch-book-icon lucide-swatch-book"><path d="M11 17a4 4 0 0 1-8 0V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2Z" /><path d="M16.7 13H19a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H7" /><path d="M 7 17h.01" /><path d="m11 8 2.3-2.3a2.4 2.4 0 0 1 3.404.004L18.6 7.6a2.4 2.4 0 0 1 .026 3.434L9.9 19.8" /></svg>
                    <span>Theme: {themes[currentIdx]}</span>
                </div>

                {user ?
                    (
                        <>
                            <p>{user.name}</p>
                            <a onClick={handleLogout} className="logout-link">LogOut</a>
                        </>
                    ) : (
                        <p>-</p>
                    )
                }
            </div>

        </nav>

    );
};

export default Navbar;
