import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title, CategoryScale, LinearScale, PointElement, LineElement, BarElement, RadialLinearScale, Filler } from 'chart.js';
import './MainContent.css';
import { BASE_URL }  from '../../config';

// Register the required components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Filler
);

const MainContent = () => {
  const [stats, setStats] = useState({ rooms: 0, housemaids: 0, controllers: 0 });
  const [recentUsers, setRecentUsers] = useState([]);
  const [distribution, setDistribution] = useState({
    "Not cleaned": 0,
    "In progress": 0,
    "Cleaned": 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsResponse = await axios.get(`${BASE_URL}/api/users/stats`);
        setStats(statsResponse.data);

        const recentUsersResponse = await fetch(`${BASE_URL}/api/users/recent-users`);
        const recentUsersData = await recentUsersResponse.json();
        setRecentUsers(recentUsersData);

        const distributionResponse = await fetch(`${BASE_URL}/api/rooms/distribution`);
        const distributionData = await distributionResponse.json();
        setDistribution(distributionData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const data = {
    labels: ['Not cleaned', 'In progress', 'Cleaned'],
    datasets: [{
      data: [distribution["Not cleaned"], distribution["In progress"], distribution["Cleaned"]],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
    }]
  };

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
                    <img src={`${BASE_URL}/uploads/${user.image}`} alt={user.firstName} className="profile-img" />
                    <p>{user.firstName} {user.lastName}</p>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Removed the Todo section and added the chart here */}
        <div className="chart-container">
          <h3>Room States Distribution</h3>
          <Doughnut data={data} />
        </div>
      </div>
    </main>
  );
};

export default MainContent;
