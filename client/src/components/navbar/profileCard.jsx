import React from 'react';
import './profileCard.scss'; // Create a CSS file for the ProfileCard styles
import { useNavigate } from 'react-router-dom';
import { Link} from "react-router-dom";
import { BASE_URL }  from '../../config';

const ProfileCard = ({ user }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate('/login');
        
      };
    return (
        <div className="profile-card">
            <div className="profile-card-header">
                <img src={`http://192.168.0.141:8080/uploads/${user.image}`} alt={user.firstName} className="profile-card-img" />
                <div className="profile-card-info">
                    <h3>{user.firstName} {user.lastName}</h3>
                    <p>{user.email}</p>
                </div>
            </div>
            <div className="profile-card-body">
            <Link to="/profil" className="profile-card-link">
                My Profile
                </Link>                
                <Link to="/resetPassword" className="profile-card-link">
                Reset Password
                </Link>

                
                <a href="#" className="logout" onClick={handleLogout}>Logout</a>
            </div>
        </div>
    );
};

export default ProfileCard;
