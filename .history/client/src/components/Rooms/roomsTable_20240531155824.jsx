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
                // Clear any existing timeouts to avoid overlapping
          clearTimeout(socketRef.current.notificationTimeout);
          // Set a new timeout for this notification
          socketRef.current.notificationTimeout = hideNotification ();
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
    
                // Envoyer l'image au serveur pour traitement
                const response = await fetch('http://localhost:5000/api/cleanliness', {
                    method: 'POST',
                    body: formData
                });
    
                if (!response.ok) {
                    throw new Error('Échec de l\'importation de l\'image');
                }
    
                const data = await response.json();
            const cleanlinessPercentage = data.cleanliness_percentage;
                        console.log( cleanlinessPercentage + "%");
    
            } catch (error) {
                console.error("Erreur lors de l'importation de l'image:", error);
                // Gérer l'erreur
            }
        };
        fileInput.click();
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
    
          // Filtrer les salles dont l'état est "Not cleaned" ou "In progress"
          const filteredRooms = response.data.filter(room => 
            room.state === "Not cleaned" || room.state === "In progress"
          );
    
          // Mettre à jour l'état avec les salles filtrées
          setRooms(filteredRooms);
        }
      } catch (error) {
        console.error("Error fetching room data:", error);
      }
    };
    

    fetchData();
    fetchRooms();
    hideNotification();

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
            console.log('Selected file:', file); // Log the selected file
            console.log('Room number:', rowData.nbrRoom); // Log the room number

            const formData = new FormData();
            formData.append('image', file);
            formData.append('room_number', rowData.nbrRoom);  // Ajout du numéro de la salle

            console.log('FormData:', formData); // Log the FormData before sending

            // Vérifiez que rowData.id est défini
            if (!rowData || !rowData._id) {
                throw new Error('Room ID is missing.');
            }

            const roomId = rowData._id;

            // Envoyer l'image au serveur pour traitement
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

            // Appel pour enregistrer l'image dans la table rooms
            const imageFormData = new FormData();
            imageFormData.append('image', file);

            const saveImageResponse = await fetch(`http://localhost:8080/api/rooms/${roomId}/image`, {
                method: 'PUT',
                body: imageFormData
            });

            if (!saveImageResponse.ok) {
                throw new Error('Échec de l\'enregistrement de l\'image dans la table rooms');
            }

            console.log('Image enregistrée avec succès dans la table rooms');

        } catch (error) {
            console.error("Erreur lors de l'importation de l'image:", error);
            // Gérer l'erreur ou continuer selon le besoin
        }
    };
    fileInput.click();
};




  // Function to handle text-to-speech
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
      case 'Messy':
        return 'messy';
      case 'In Progress':
        return 'in-progress';
      default:
        return '';
    }
  };
 // Function to handle hiding the notification after 30 seconds
 const hideNotification = () => {
  const timerId = setTimeout(() => {
    setIsNotificationVisible(false);
  }, 15000); // Hide the notification after 30 seconds

  // Cleanup function to clear the timeout if the component unmounts
  return () => clearTimeout(timerId);
};

useEffect(() => {
  hideNotification();
}, []);

const handleRowClick = async (roomId) => {
  try {
    const token = localStorage.getItem("token");
    if (token) {
      const response = await axios.put(`http://localhost:8080/api/rooms/${roomId}/state`, { State: 'In Progress' }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        setRooms(prevRooms =>
          prevRooms.map(room =>
            room._id === roomId ? { ...room, State: 'In Progress' } : room
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
