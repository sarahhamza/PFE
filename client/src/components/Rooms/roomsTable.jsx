import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './rooms.css';
import { io } from 'socket.io-client';
import { AiOutlineCamera } from 'react-icons/ai';
import { FaVolumeUp } from 'react-icons/fa';

const RoomList = () => {
  const [toCleanRooms, setToCleanRooms] = useState([]);
  const [toRecleanRooms, setToRecleanRooms] = useState([]);
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

          const toClean = response.data.filter(room =>
            (room.State === "Not cleaned" || room.State === "In progress") && room.type === "ToClean"
          );
          const toReclean = response.data.filter(room =>
            (room.State === "Not cleaned" || room.State === "In progress") && room.type === "ToReclean"
          );

          setToCleanRooms(toClean);
          setToRecleanRooms(toReclean);
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

        const updateStateResponse = await fetch(`http://localhost:8080/api/rooms/${rowData._id}/state`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ State: 'Cleaned' })
        });

        if (!updateStateResponse.ok) {
          throw new Error('Échec de la mise à jour de l\'état de la salle');
        }

        console.log('État de la salle mis à jour avec succès');

        setToCleanRooms(prevRooms =>
          prevRooms.map(room =>
            room._id === rowData._id ? { ...room, State: 'Cleaned' } : room
          )
        );
        setToRecleanRooms(prevRooms =>
          prevRooms.map(room =>
            room._id === rowData._id ? { ...room, State: 'Cleaned' } : room
          )
        );
      } catch (error) {
        console.error("Erreur lors de l'importation de l'image:", error);
      }
    };
    fileInput.click();
  };

  const handleVoiceReader = () => {
    const message = "Hello, on the left you have rooms to clean, on the right you have rooms to reclean. When you finish cleaning, please put an image.";
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
          setToCleanRooms(prevRooms =>
            prevRooms.map(room =>
              room._id === roomId ? { ...room, State: 'In progress' } : room
            )
          );
          setToRecleanRooms(prevRooms =>
            prevRooms.map(room =>
              room._id === roomId ? { ...room, State: 'In progress' } : room
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
      <div className="room-lists">
        <div className="room-cards-container">
          <h2>Rooms to Clean</h2>
          {toCleanRooms.map((room) => (
            <div key={room._id} className="room-card-clean" onClick={() => handleRowClick(room._id)}>
              <div className="room-card-header">
                <h3>Room {room.nbrRoom}</h3>
                <span className={`status ${getStatusClass(room.State)}`}>
                  {room.State}
                </span>
              </div>
              <button className='button' onClick={(e) => { e.stopPropagation(); handleImageImport(room); }}>
                <AiOutlineCamera size={24} />
                Import
              </button>
            </div>
          ))}
        </div>
        <div className="room-cards-container">
          <h2>Rooms to Reclean</h2>
          {toRecleanRooms.map((room) => (
            <div key={room._id} className="room-card-reclean" onClick={() => handleRowClick(room._id)}>
              <div className="room-card-header">
                <h3>Room {room.nbrRoom}</h3>
                <span className={`status ${getStatusClass(room.State)}`}>
                  {room.State}
                </span>
              </div>
              <button className='button' onClick={(e) => { e.stopPropagation(); handleImageImport(room); }}>
                <AiOutlineCamera size={24} />
                Import
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoomList;
