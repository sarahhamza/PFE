import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MainContent.css';
import { BASE_URL }  from '../../config';

const MainContentC = () => {
  const [stats, setStats] = useState({ rooms: 0, clean: 0, messy: 0 });
  const [recentRooms, setRecentRooms] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/rooms/stats`);
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching stats", error);
      }
    };

    fetch(`${BASE_URL}/api/rooms/recent-rooms`)
      .then(response => response.json())
      .then(data => setRecentRooms(data))
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
            <p>Total Rooms</p>
          </span>
        </li>
        <li>
          <i className='bx bxs-group'></i>
          <span className="text">
            <h3>{stats.clean}</h3>
            <p>Clean Rooms</p>
          </span>
        </li>
        <li>
          <i className='bx bxs-dollar-circle'></i>
          <span className="text">
            <h3>{stats.messy}</h3>
            <p>Messy Rooms</p>
          </span>
        </li>
      </ul>

      <div className="table-data">
        <div className="order">
          <div className="head">
            <h3>Recent Roomss</h3>
            <i className='bx bx-search'></i>
            <i className='bx bx-filter'></i>
          </div>
          <table>
            <thead>
              <tr>
                <th>Room</th>
                <th>Date Joined</th>
                <th>State</th>
              </tr>
            </thead>
            <tbody>
            {recentRooms.map(room => (
                <tr key={room._id}>
                  <td>
                  {/* <img src={`${BASE_URL}/uploads/${room.image}`} alt={room.firstName} className="profile-img" /> */}
                    <p>{room.nbrRoom}</p>
                  </td>
                  <td>{new Date(room.createdAt).toLocaleDateString()}</td>
                  <td>{room.Property}</td>
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

export default MainContentC;