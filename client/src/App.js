import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DarkModeContext } from './context/darkModeContext';
import Home from './pages/home/Home';
import Log from './components/Login/log';
import SignUp from './components/Singup/signup';
import List from './pages/list/List';
import ListHousemaid from './pages/list/ListHousemaid';
import ListRoom from './pages/list/ListRoom';
import NewHome from './pages/home/NewHome';
import NewHome2 from './pages/ControlerDashboard/NewHomeC';
import UserProfile from './pages/userprofil/userprofil';
import BasicDemo from './components/datatable/UsersList';
import New from './pages/new/NewList';
import NewRoom from './pages/newRoom/newRoomList';
import { userInputs } from './formSource';
import Single from './pages/single/SingleDetails';
import Update from './pages/updateUser/UpdateList';
import UserListRooms from './pages/list/UserRoomList';
import ListController from './pages/list/ListController';
import ListControllerRooms from './pages/list/ListControllerRooms';
import ResetPassword from './pages/ResetPassword/ReserPassword';
import './style/dark.scss';

function App() {
  const { darkMode } = useContext(DarkModeContext);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={darkMode ? 'app dark' : 'app'}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Log/>} />
          <Route path="/login" element={<Log setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/home" element={isAuthenticated ? <Home /> : <Navigate to="/login" replace />} />
          <Route path="/newHome" element={isAuthenticated ? <NewHome /> : <Navigate to="/login" replace />} />
          <Route path="/newHomeC" element={isAuthenticated ? <NewHome2 /> : <Navigate to="/login" replace />} />
          <Route path="/profil" element={isAuthenticated ? <UserProfile /> : <Navigate to="/login" replace />} />
          <Route path="/users" element={isAuthenticated ? <List /> : <Navigate to="/login" replace />} />
          <Route path="/ListHousemaid" element={isAuthenticated ? <ListHousemaid /> : <Navigate to="/login" replace />} />
          <Route path="/rooms" element={isAuthenticated ? <ListRoom /> : <Navigate to="/login" replace />} />
          <Route path="/roomstable" element={isAuthenticated ? <UserListRooms /> : <Navigate to="/login" replace />} />
          <Route path="/ListController" element={isAuthenticated ? <ListController /> : <Navigate to="/login" replace />} />
          <Route path="/products" element={isAuthenticated ? <BasicDemo /> : <Navigate to="/login" replace />} />
          <Route path="/users/new" element={isAuthenticated ? <New inputs={userInputs} title="Add New User" /> : <Navigate to="/login" replace />} />
          <Route path="/rooms/new" element={isAuthenticated ? <NewRoom title="Add New Room" /> : <Navigate to="/login" replace />} />
          <Route path="/user/:userId" element={isAuthenticated ? <Single /> : <Navigate to="/login" replace />} />
          <Route path="/resetPassword" element={<ResetPassword />} />
          <Route path="/users/update/:userId" element={isAuthenticated ? <Update inputs={userInputs} title="Update User" /> : <Navigate to="/login" replace />} />
          <Route path="/ControllerRooms" element={isAuthenticated ? <ListControllerRooms /> : <Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
