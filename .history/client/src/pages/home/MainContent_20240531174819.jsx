import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title, CategoryScale, LinearScale, PointElement, LineElement, BarElement, RadialLinearScale, Filler } from 'chart.js';
import './MainContent.css';

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
        const statsResponse = await axios.get('http://localhost:8080/api/users/stats');
        setStats(statsResponse.data);

        const recentUsersResponse = await fetch('http://localhost:8080/api/users/recent-users');
        const recentUsersData = await recentUsersResponse.json();
        setRecentUsers(recentUsersData);

        const distributionResponse = await fetch('http://localhost:8080/api/rooms/distribution');
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
      {/* Le reste de votre contenu JSX reste inchangé */}
    </main>
  );
};

export default MainContent;
