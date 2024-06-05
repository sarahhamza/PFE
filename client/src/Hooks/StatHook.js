import { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../config';

export const useStatsHook = () => {
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

    const fetchRecentRooms = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/rooms/recent-rooms`);
        setRecentRooms(response.data);
      } catch (error) {
        console.error('Error fetching recent rooms:', error);
      }
    };

    fetchStats();
    fetchRecentRooms();
  }, []);

  return { stats, recentRooms };
};
