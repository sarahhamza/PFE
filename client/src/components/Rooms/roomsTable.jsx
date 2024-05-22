import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './rooms.css';
import { io } from 'socket.io-client';

const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);
  const socketRef = useRef(null);

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

          if (!socketRef.current) {
            socketRef.current = io("http://localhost:8080", {
              withCredentials: true,
              extraHeaders: {
                "my-custom-header": "abcd",
              }
            });

            socketRef.current.on('connect', () => {
              console.log('Connected to socket server');
              socketRef.current.emit('join', response.data._id);
            });

            socketRef.current.on('notification', (notification) => {
              console.log('Notification received:', notification);
              if (notification && notification.message) {
                setNotificationMessage(notification.message);
                setIsNotificationVisible(true);
              } else {
                console.log('No message in the notification');
              }
            });

            // Listen for roomAssigned event
            socketRef.current.on('roomAssigned', (data) => {
              console.log('Room assigned event received:', data);
              fetchRooms(); // Fetch updated room list
            });

            socketRef.current.on('disconnect', () => {
              console.log('Client disconnected');
            });
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchRooms = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const response = await axios.get("http://localhost:8080/api/auth/user-rooms", {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setRooms(response.data);
        }
      } catch (error) {
        console.error("Error fetching room data:", error);
      }
    };

    fetchData();
    fetchRooms();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  const handleEdit = (id) => {
    console.log(`Edit room with ID: ${id}`);
  };


  const getStatusClass = (status) => {
    switch (status) {
      case 'Clean':
        return 'clean';
      case 'Messy':
        return 'messy';
      case 'In Progress':
        return 'in-progress';
      default:
        return '';
    }
  };

  return (
    <div className="room-list-container">
{isNotificationVisible && (
        <div className="notification-popup">
          {notificationMessage}
        </div>
      )}

      <div className="headerRoom">
        <h1>Room List</h1>
      </div>
      <table className="room-list-table">
        <thead>
          <tr>
            <th>Room Number</th>
            <th>Surface</th>
            <th>Category</th>
            <th>Status</th>
            <th>Employed</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr key={room._id}>
              <td>{room.nbrRoom}</td>
              <td>{room.Surface} m²</td>
              <td>{room.Categorie}</td>
              <td>
                <span className={`status ${getStatusClass(room.State)}`}>
                  {room.State}
                </span>
              </td>
              <td>{room.User ? new Date(room.employedDate).toLocaleDateString() : 'N/A'}</td>
              <td>
                <button className='button' onClick={() => handleEdit(room._id)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="notifications">
        <h2>Notifications</h2>
        <ul>
          {notifications.map((notification, index) => (
            <li key={index}>{notification.message}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RoomList;
