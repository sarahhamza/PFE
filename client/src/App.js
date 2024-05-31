import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { DarkModeContext } from './context/darkModeContext';
import Home from './pages/home/Home';
import Login from './components/Login';
import Signup from './components/Singup';
import List from './pages/list/List';
import Single from './pages/single/SingleDetails';
import New from './pages/new/NewList';
import NewRoom from './pages/newRoom/newRoomList';
import { userInputs } from './formSource';
import './style/dark.scss';
import BasicDemo from './components/datatable/UsersList';
import ListRoom from './pages/list/ListRoom';
import Update from './pages/updateUser/UpdateList';
import ListHousemaid from './pages/list/ListHousemaid';
import Log from './components/Login/log';
import SignUp from './components/Singup/signup';
//import RoomsTable from './pages/HMRoomsList/HmRoomsList'
import ListController from './pages/list/ListController';
import NewHome from './pages/home/NewHome';
import NewHome2 from './pages/ControlerDashboard/NewHomeC';

import UserListRooms from './pages/list/UserRoomList';
//import AdminDashboard from './components/Dashboard/AdminDashboard';
import ResetPassword from './pages/ResetPassword/ReserPassword';
import UserProfile from './pages/userprofil/userprofil';

function App() {
  const { darkMode } = useContext(DarkModeContext);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated (e.g., by checking token in local storage)
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);

  }, []);


  return (
    <div className={darkMode ? 'app dark' : 'app'}>
      <BrowserRouter>
        <Routes>
          <Route path="/home" element={isAuthenticated ? <Home /> : <Navigate to="/login" replace />} />
          <Route path="/login" element={<Log />} />
          <Route path="/newHome" element={<NewHome/>} />
          <Route path="/newHomeC" element={<NewHome2/>} />
          <Route path="/profil" element={<UserProfile/>} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/users" element={isAuthenticated ? <List /> : <Navigate to="/login" replace />} />
          <Route path="/ListHousemaid" element={isAuthenticated ? <ListHousemaid /> : <Navigate to="/login" replace />} />
          <Route path="/" element={<Navigate replace to="/login" />} />
          <Route path="/rooms" element={isAuthenticated ? <ListRoom /> : <Navigate to="/login" replace />} />
          <Route path="/roomstable" element={isAuthenticated ? <UserListRooms /> : <Navigate to="/login" replace />} />
          <Route path="/ListController" element={isAuthenticated ? <ListController /> : <Navigate to="/login" replace />} />
          <Route path="/products" element={<BasicDemo />} />
          <Route path="/users/new" element={isAuthenticated ?<New inputs={userInputs} title="Add New User" />: <Navigate to="/login" replace />} />
          <Route path="/rooms/new" element={isAuthenticated ? <NewRoom title="Add New Room" />: <Navigate to="/login" replace />} />
          <Route path="/user/:userId" element={<Single />} />
          <Route path="/resetPassword" element={<ResetPassword/>} />

          <Route path="/users/update/:userId" element={isAuthenticated ? <Update inputs={userInputs} title="Update User" /> : <Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
