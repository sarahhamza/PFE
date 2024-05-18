// src/App.js
import React from 'react';
import RoomsTable from '../../components/Rooms/roomsTable';
import Sidebar from "../../components/sidebar/Sidebar"
import Navbar from "../../components/navbar/Navbar"
import { PrimeReactProvider } from "primereact/api"

const HMRoomList = () => {
  return (
    <div className="list">
    <Sidebar/>
    <div className="listContainer">
    <div>
      <Navbar />
      </div>
      <PrimeReactProvider>
      <RoomsTable/>
      </PrimeReactProvider>
    </div>
  </div>
  );
}

export default HMRoomList ;
