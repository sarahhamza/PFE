import React , { useEffect } from 'react';
import './side.css';
import { Link} from "react-router-dom";
import { useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { DarkModeContext } from "../../context/darkModeContext";

const Sidebar = () => {
    const navigate = useNavigate();
    const { dispatch } = useContext(DarkModeContext);
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate('/login');
        
      };
  return (
    <section className="sidebar">
    <a href="#" className="brand">
      <i className='bx bxs-smile'></i>
      <span className="text">CleanCare</span>
    </a>
    <ul className="side-menu topp">     
     <Link to="/newhome" style={{ textDecoration: "none" }}>
      <li className="active">
        <a href="#">
          <i className='bx bxs-dashboard'></i>
          <span className="text">Dashboard</span>
        </a>
        
      </li>
      </Link>
      <Link to="/users" style={{ textDecoration: "none" }}>
      <li>
        <a href="#">
          <i className='bx bxs-shopping-bag-alt'></i>
          <span className="text">Requests</span>
        </a>
      </li>
      </Link>
      <Link to="/rooms" style={{ textDecoration: "none" }}>
      <li >
        <a href="#">
          <i className='bx bxs-doughnut-chart'></i>
          <span className="text">Rooms</span>
        </a>
      </li>
      </Link>
      <Link to="/ListHousemaid" style={{ textDecoration: "none" }}>
      <li>
        <a href="#">
          <i className='bx bxs-message-dots'></i>
          <span className="text">Housemaids</span>
        </a>
      </li>
      </Link>
      <Link to="/ListController" style={{ textDecoration: "none" }}>
      <li>
        <a href="#">
          <i className='bx bxs-group'></i>
          <span className="text">Controllers</span>
        </a>
      </li>
      </Link>
      <Link to="/ControllerRooms" style={{ textDecoration: "none" }}>
      <li >
        <a href="#">
          <i className='bx bxs-doughnut-chart'></i>
          <span className="text">ControllerRooms</span>
        </a>
      </li>
      </Link>
    </ul>
    <ul className="side-menu">
      <li>
        <a href="#">
          <i className='bx bxs-cog'></i>
          <span className="text">Settings</span>
        </a>
      </li>
      <li>
        <a href="#" className="logout" onClick={handleLogout}>
          <i className='bx bxs-log-out-circle'></i>
          <span className="text">Logout</span>
        </a>
      </li>
    </ul>
    </section>
  );
};

export default Sidebar;
