import React, { useState, useEffect, useContext } from 'react';
import "./navbar.scss";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import { DarkModeContext } from "../../context/darkModeContext";
import axios from "axios";
import ProfileCard from './profileCard'; // Import ProfileCard component

const Navbar = () => {
    const [user, setUser] = useState(null);
    const [showProfileCard, setShowProfileCard] = useState(false);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (token) {
                    const response = await axios.get("http://localhost:8080/api/auth/user", {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    setUser(response.data);

                    // Fetch notifications based on user role
                    if (response.data.role === "femme de menage") {
                        const notificationsResponse = await axios.get(`http://localhost:8080/api/notifications/${response.data._id}`, {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        });
                        setNotifications(notificationsResponse.data);
                    } else if (response.data.role === "controlleur") {
                        const notificationsResponse = await axios.get("http://localhost:5000/api/notifications", {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        });
                        setNotifications(notificationsResponse.data);
                    }
                }
            } catch (error) {
                console.error("Error fetching user data or notifications:", error);
            }
        };

        fetchData();
    }, []);

    const { dispatch } = useContext(DarkModeContext);

    const toggleProfileCard = () => {
        setShowProfileCard(prev => !prev);
    };

    return (
        <nav>
            <i className="bx bx-menu"></i>
            <a href="#" className="nav-link">Categories</a>
            <form action="#">
                <div className="form-input">
                    <input type="search" placeholder="Search..." />
                    <button type="submit" className="search-btn">
                        <SearchOutlinedIcon />
                    </button>
                </div>
            </form>
            <input type="checkbox" id="switch-mode" hidden />
            <label htmlFor="switch-mode" className="switch-mode" onClick={() => dispatch({ type: 'TOGGLE' })}></label>

            {user && (
                <div className="notification">
                    <NotificationsNoneOutlinedIcon className="icon" />
                    {notifications.length > 0 && (
                        <div className="notifications-dropdown">
                            <ul>
                                {notifications.map((notification, index) => (
                                    <li key={index}>{notification.message}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <span className="num">{notifications.length}</span>
                </div>
            )}

            {user && (
                <div className="profile" onClick={toggleProfileCard}>
                    <img src={`http://localhost:8080/uploads/${user.image}`} alt={user.firstName} className="profile-img" />
                    {showProfileCard && <ProfileCard user={user} />}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
