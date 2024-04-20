import "./single.scss";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import Chart from "../../components/chart/Chart";
import List from "../../components/table/Table";
import RoomTable from "../../components/table/RoomTable";

const Single = () => {
  const [availableRooms, setAvailableRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showRoomCard, setShowRoomCard] = useState(false); // State to control the visibility of the room card

  useEffect(() => {
    fetchAvailableRooms();
  }, []);
  const fetchAvailableRooms = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/rooms/available');
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
      const response = await axios.put(`http://localhost:8080/api/rooms/${selectedRoom._id}`, { userId: 'user_id_here' }); // Replace 'user_id_here' with the actual user ID
      console.log(response.data.message); // Log the response message
      // Optionally, you can fetch the available rooms again after assignment
      fetchAvailableRooms();
    } catch (error) {
      console.error('Error assigning room:', error);
    }
  };

  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />
        <div className="top">
          <div className="left">
            <div className="editButton">Edit</div>
            <h1 className="title">Information</h1>
            <div className="item">
              <img
                src="https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260"
                alt=""
                className="itemImg"
              />
              <div className="details">
                <h1 className="itemTitle">Jane Doe</h1>
                <div className="detailItem">
                  <span className="itemKey">Email:</span>
                  <span className="itemValue">janedoe@gmail.com</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Phone:</span>
                  <span className="itemValue">+1 2345 67 89</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Address:</span>
                  <span className="itemValue">
                    Elton St. 234 Garden Yd. NewYork
                  </span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Country:</span>
                  <span className="itemValue">USA</span>
                </div>
              </div>
            </div>
          </div>
          <div className="right">
            <Chart aspect={3 / 1} title="User Spending ( Last 6 Months)" />
          </div>
        </div>
        <div className="bottom">  
  <div className="first">
    <button className="btn" onClick={() => setShowRoomCard(true)}>Affect a Room</button>
    <h1 className="title">Last Transactions</h1>
    <List/>
    <button className="btn" onClick={handleRoomAssignment}>Assign Room</button>
    {/* Optionally, display a message indicating room assignment success */}
  </div>
  {/* Conditionally render the room card */}
  {showRoomCard && (
    <div className="roomCard">
      <h1 className="cardTitle">Available Rooms</h1>
      {/* Replace the existing room table with the RoomTable component */}
      <RoomTable availableRooms={availableRooms} setSelectedRoom={setSelectedRoom} />
      <button className="btn" onClick={() => setShowRoomCard(false)}>Close</button>
    </div>
  )}
</div>
      </div>
    </div>
  );
};

export default Single;