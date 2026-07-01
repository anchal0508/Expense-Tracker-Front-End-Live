import type React from "react";
import Anchal from '../Images/logoSmall.png';
import { useAuth } from "../AuthContext";

const Profile: React.FC = () => {
    const {user} = useAuth();
    return (
        <div className="profile-page">
            <div className="hero">
                <div className="profile-img">
                    <img src={Anchal} alt="" />
                </div>
            </div>
            <div className="personal-detail">
                <h2><span>Name:</span><span>{user?.name}</span> </h2>
                <h2><span>Email:</span><span>{user?.email}</span> </h2>
                <h2><span>Phone:</span><span>{user?.phone}</span> </h2>
                <h2><span>Address:</span><span>{user?.address}</span> </h2>
                <h2><span>Premium User:</span><span>{user?.isPremium}</span> </h2>
            </div>
        </div>
    )
}

export default Profile;