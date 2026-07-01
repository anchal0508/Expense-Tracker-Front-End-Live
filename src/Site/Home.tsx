import type React from "react";
import logo from "../Images/logo.png";
import LogIn from "./Components/LogIn";
import SignUp from "./Components/SignUp";
import { useState } from "react";




const Home: React.FC = () => {
    const [isLogin, setIsLogIn] = useState(true);

    return (
        <div className="home-page">

            <div className="welcome-page">
                <img src={logo} alt="" />
            </div>
            <div className="form">
                {isLogin ?
                    (
                        <>
                            <LogIn />
                            <div className="change">
                                <p>Not Registered?</p>
                                <a onClick={()=>setIsLogIn(false)}>SignUp</a>
                            </div>
                        </>
                    ) : (
                        <>
                            <SignUp />
                            <div className="change">
                                <p>already have an Account?</p>
                                <a onClick={()=>setIsLogIn(true)}>LogIn</a>
                            </div>
                        </>
                    )
                }

            </div>

        </div>
    )
}

export default Home;