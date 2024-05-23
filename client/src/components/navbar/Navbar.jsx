import "./navbar.scss";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import FullscreenExitOutlinedIcon from "@mui/icons-material/FullscreenExitOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import { DarkModeContext } from "../../context/darkModeContext";
import { useContext } from "react";
import { useState, useEffect } from "react";
import axios from "axios";


const Navbar = () => {
  const [user, setUser] = useState(null);

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
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchData();
    }, []);
  const { dispatch } = useContext(DarkModeContext);
  return (
   // {/* Navbar */}
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
    <a href="#" className="notification">
      <NotificationsNoneOutlinedIcon className="icon" />
      <span className="num">8</span>
    </a>
    {user && (
      <a href="#" className="profile">
        <img src={`http://localhost:8080/uploads/${user.image}`} alt={user.firstName} className="profile-img" />
      </a>
    )}
  </nav>
  );
};

export default Navbar;
