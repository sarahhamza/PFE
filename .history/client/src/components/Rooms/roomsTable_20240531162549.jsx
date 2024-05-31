import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './rooms.css';
import { io } from 'socket.io-client';
import { AiOutlineCamera } from 'react-icons/ai';
import { FaVolumeUp } from 'react-icons/fa';

const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [user, setUser] = useState(null);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const userResponse = await axios.get("http://localhost:8080/api/auth/user", {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setUser(userResponse.data);

          if (!socketRef.current) {
            socketRef.current = io("http://localhost:8080", {
              withCredentials: true,
              extraHeaders: {
                "my-custom-header": "abcd",
              }
            });

            socketRef.current.on('connect', () => {
              console.log('Connected to socket server');
              socketRef.current.emit('join', userResponse.data._id);
            });

            socketRef.current.on('notification', (notification) => {
              console.log('Notification received:', notification);
              if (notification && notification.message) {
                setNotificationMessage(notification.message);
                setIsNotificationVisible(true);
                clearTimeout(socketRef.current.notificationTimeout);
                socketRef.current.notificationTimeout = setTimeout(() => setIsNotificationVisible(false), 15000);
              } else {
                console.log('No message in the notification');
              }
            });

            socketRef.current.on('roomAssigned', (data) => {
              console.log('Room assigned event received:', data);
              fetchRooms();
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

          const filteredRooms = response.data.filter(room => 
            room.state === "Not cleaned" || room.state === "In progress"
          );

          setRooms(filteredRooms);
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

  const handleImageImport = async (rowData) => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      try {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('room_number', rowData.nbrRoom);

        const response = await fetch('http://localhost:5000/api/cleanliness', {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          throw new Error('Échec de l\'importation de l\'image');
        }

        const data = await response.json();
        const cleanlinessPercentage = data.cleanliness_percentage;
        console.log(`Room number ${rowData.nbrRoom} is ${cleanlinessPercentage}% clean`);

        const imageFormData = new FormData();
        imageFormData.append('image', file);

        const saveImageResponse = await fetch(`http://localhost:8080/api/rooms/${rowData._id}/image`, {
          method: 'PUT',
          body: imageFormData
        });

        if (!saveImageResponse.ok) {
          throw new Error('Échec de l\'enregistrement de l\'image dans la table rooms');
        }

        console.log('Image enregistrée avec succès dans la table rooms');
      } catch (error) {
        console.error("Erreur lors de l'importation de l'image:", error);
      }
    };
    fileInput.click();
  };

  const handleVoiceReader = () => {
    const message = "Hello, on the right you have rooms to clean, on the left you have rooms to reclean. When you finish cleaning, please put an image.";
    const speech = new SpeechSynthesisUtterance(message);
    speech.lang = 'en-US';
    window.speechSynthesis.speak(speech);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Cleaned':
        return 'clean';
      case 'Not cleaned':
        return 'messy';
      case 'In progress':
        return 'in-progress';
      default:
        return '';
    }
  };

  const handleRowClick = async (roomId) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const response = await axios.put(`http://localhost:8080/api/rooms/${roomId}/state`, { State: 'In progress' }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.status === 200) {
          setRooms(prevRooms =>
            prevRooms.map(room =>
              room._id === roomId ? { ...room, state: 'In progress' } : room
            )
          );
        }
      }
    } catch (error) {
      console.error("Error updating room state:", error);
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
        <button className="voice-button" onClick={handleVoiceReader}>
          <FaVolumeUp size={24} />
        </button>
      </div>
      <table className="room-list-table">
        <thead>
          <tr>
            <th>Room Number</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr key={room._id} onClick={() => handleRowClick(room._id)}>
              <td>{room.nbrRoom}</td>
              <td>
                <span className={`status ${getStatusClass(room.State)}`}>
                  {room.State}
                </span>
              </td>
              <td>
                <button className='button' icon={<AiOutlineCamera />} onClick={(e) => { e.stopPropagation(); handleImageImport(room); }}>Import</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RoomList;
