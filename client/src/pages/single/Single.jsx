import "./single.scss";
import Sidebar from "../../components/sidebar/side"
import axios from 'axios';
import Navbar from "../../components/navbar/Navbar";
import Chart from "../../components/chart/Chart";
import List from "../../components/table/Table";
import RoomTable from "../../components/table/RoomTable";
import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { BASE_URL }  from '../../config';
import { Link } from "react-router-dom";


const Single = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showRoomCard, setShowRoomCard] = useState(false); // State to control the visibility of the room card
  const isAssignRoomDisabled = userData && userData.rooms && userData.rooms.length >= 3;


  useEffect(() => {
    const fetchHousemaidData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/users/${userId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const userData = await response.json();
        console.log(userData);
        setUserData(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchAvailableRooms();
    fetchHousemaidData();
  }, [userId]);

  const fetchAvailableRooms = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/rooms/available`);
      setAvailableRooms(response.data);
    } catch (error) {
      console.error('Error fetching available rooms:', error);
    }
  };
  const handleRoomAssignment = async () => {
    if (!selectedRoom) {
      console.error('No room selected');
      return;
    }
  
    try {
      // Update user data with the assigned room ID
      const updatedUserData = { ...userData, rooms: [...userData.rooms, selectedRoom._id] };
      setUserData(updatedUserData);
  
      // Update room data with the user ID
      const updatedRoomData = availableRooms.map(room =>
        room._id === selectedRoom._id ? { ...room, user: userId } : room
      );
      setAvailableRooms(updatedRoomData);
  
      // Assign the room to the user
      const response = await axios.put(`${BASE_URL}/api/users/${userId}/assign-room/${selectedRoom._id}`);
      console.log(response.data.message);
    // Send a notification to the user
      await axios.post(`${BASE_URL}/api/notifications/push/${userId}`, {
        message: "You have a new room to clean"
      });
      
      fetchAvailableRooms();
    } catch (error) {
      console.error('Error assigning room:', error);
    }
  };


  return (
    <div className="single">
      <div className="singleContainer">
        <div className="top">
          <div className="left">
          <Link to={`/users/update/${userData?._id}`} state={{ imageUrl: `${BASE_URL}/uploads/${userData?.image}` }}>
              <button className="p-button5">
                <p className='paragraph'>Update</p>
              </button>    </Link> 
                  <h1 className="title">Information</h1>
            {userData && (
              <div className="item">
                <img
                  src={`${BASE_URL}/uploads/${userData.image}`}
                  alt=""
                  className="itemImg"
                />
                <div className="details">
                  <h1 className="itemTitle">{`${userData.firstName} ${userData.lastName}`}</h1>
                  <div className="detailItem">
                    <span className="itemKey">Email:</span>
                    <span className="itemValue">{userData.email}</span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Phone:</span>
                    <span className="itemValue">{userData.phone}</span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Address:</span>
                    <span className="itemValue">{userData.address}</span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Country:</span>
                    <span className="itemValue">{userData.country}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="right2">
            <Chart aspect={3 / 1} title="User Spending ( Last 6 Months)" />
          </div>
        </div>
        <div className="bottom">
  <div className="first">
    <button className="btn" onClick={() => setShowRoomCard(true)} disabled={isAssignRoomDisabled}>Affect a Room</button>
    <h1 className="title">Affected Rooms</h1>
    <List/>
    <button className="btn" onClick={handleRoomAssignment} disabled={isAssignRoomDisabled}>Assign Room</button>
    {/* Optionally, display a message indicating room assignment success */}
  </div>
  {/* Conditionally render the room card */}
  {showRoomCard && (
    <div className="roomCard">
      <h1 className="cardTitle">Available Rooms</h1>
      {/* Replace the existing room table with the RoomTable component */}
      <RoomTable availableRooms={availableRooms} setSelectedRoom={setSelectedRoom} />
      <button className="btn" onClick={() => setShowRoomCard(false)} >Close</button>
    </div>
  )}
</div>
      </div>
    </div>
  );
};

export default Single;