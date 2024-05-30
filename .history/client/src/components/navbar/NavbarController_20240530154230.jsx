import "./navbarController.scss";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import FullscreenExitOutlinedIcon from "@mui/icons-material/FullscreenExitOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import { DarkModeContext } from "../../context/darkModeContext";
import { useContext, useState, useEffect } from "react";
import axios from "axios";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const response = await axios.get("http://localhost:8080/api/auth/user", {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setUser(response.data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchNotifications = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/notifications");
        setNotifications(response.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchUser();
    fetchNotifications();
  }, []);

  const { dispatch } = useContext(DarkModeContext);

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
      <div className="notification" onClick={() => setShowNotifications(!showNotifications)}>
        <NotificationsNoneOutlinedIcon className="icon" />
        <span className="num">{notifications.length}</span>
        {showNotifications && (
          <div className="notifications-dropdown">
            {notifications.length === 0 ? (
              <p>No notifications</p>
            ) : (
              <ul>
                {notifications.map((notification, index) => (
                  <li key={index}>{notification.message}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
      {user && (
        <a href="#" className="profile">
          <img src={`http://localhost:8080/uploads/${user.image}`} alt={user.firstName} className="profile-img" />
        </a>
      )}
    </nav>
  );
};

export default Navbar;
