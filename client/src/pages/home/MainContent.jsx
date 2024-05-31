import React, { useState, useEffect } from 'react';
import axios from 'axios';

import './MainContent.css';

const MainContent = () => {
  const [stats, setStats] = useState({ rooms: 0, housemaids: 0, controllers: 0 });
  const [recentUsers, setRecentUsers] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/users/stats');
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching stats", error);
      }
    };

    fetch('http://localhost:8080/api/users/recent-users')
      .then(response => response.json())
      .then(data => setRecentUsers(data))
      .catch(error => console.error('Error fetching recent users:', error));
    fetchStats();
  }, []);
  return (
    <main className='body'>
      <div className="head-title">
        <div className="left">
          <h1>Dashboard</h1>
          <ul className="breadcrumb">
            <li>
              <a href="#">Dashboard</a>
            </li>
            <li><i className='bx bx-chevron-right'></i></li>
            <li>
              <a className="active" href="#">Home</a>
            </li>
          </ul>
        </div>
        <a href="#" className="btn-download">
          <i className='bx bxs-cloud-download'></i>
          <span className="text">Download PDF</span>
        </a>
      </div>

      <ul className="box-info">
        <li>
          <i className='bx bxs-calendar-check'></i>
          <span className="text">
            <h3>{stats.rooms}</h3>
            <p>Rooms</p>
          </span>
        </li>
        <li>
          <i className='bx bxs-group'></i>
          <span className="text">
            <h3>{stats.controllers}</h3>
            <p>Controllers</p>
          </span>
        </li>
        <li>
          <i className='bx bxs-dollar-circle'></i>
          <span className="text">
            <h3>{stats.housemaids}</h3>
            <p>Housemaids</p>
          </span>
        </li>
      </ul>

      <div className="table-data">
        <div className="order">
          <div className="head">
            <h3>Recent Users</h3>
            <i className='bx bx-search'></i>
            <i className='bx bx-filter'></i>
          </div>
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Date Joined</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
            {recentUsers.map(user => (
                <tr key={user._id}>
                  <td>
                  <img src={`http://localhost:8080/uploads/${user.image}`} alt={user.firstName} className="profile-img" />
                    <p>{user.firstName} {user.lastName}</p>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="todo">
          <div className="head">
            <h3>Todos</h3>
            <i className='bx bx-plus' ></i>
            <i className='bx bx-filter' ></i>
          </div>
          <ul className="todo-list">
            <li className="completed">
              <p>Todo List</p>
              <i className='bx bx-dots-vertical-rounded' ></i>
            </li>
            <li className="completed">
              <p>Todo List</p>
              <i className='bx bx-dots-vertical-rounded' ></i>
            </li>
            <li className="not-completed">
              <p>Todo List</p>
              <i className='bx bx-dots-vertical-rounded' ></i>
            </li>
            <li className="completed">
              <p>Todo List</p>
              <i className='bx bx-dots-vertical-rounded' ></i>
            </li>
            <li className="not-completed">
              <p>Todo List</p>
              <i className='bx bx-dots-vertical-rounded' ></i>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
};

export default MainContent;