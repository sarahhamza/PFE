import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './userprofil.css';
import "../list/list.scss"
import Sidebar from "../../components/sidebar/side"
import Navbar from "../../components/navbar/Navbar"
import { PrimeReactProvider } from "primereact/api"

const UserProfile = () => {
  const [user, setUser] = useState({});
  const [editedUser, setEditedUser] = useState({});
  const [isModified, setIsModified] = useState(false);
  const [isSaveEnabled, setIsSaveEnabled] = useState(false);
  const [imageFile, setImageFile] = useState(null); // State to hold the selected image file

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
          setEditedUser(response.data); // Initialize editedUser state with user data
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prevState => ({
      ...prevState,
      [name]: value
    }));
    setIsModified(true);
    setIsSaveEnabled(true);
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]); // Set the selected image file
    setIsModified(true);
    setIsSaveEnabled(true);
  };

  const handleSaveClick = async () => {
    // Implement save functionality here
    setIsSaveEnabled(false);
    setIsModified(false);
    setUser(editedUser);

    // Upload the image file if it's selected
    if (imageFile) {
      const formData = new FormData();
      formData.append('image', imageFile);

      try {
        const token = localStorage.getItem("token");
        await axios.post("http://localhost:8080/api/auth/upload", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  const handleCancelClick = () => {
    // Reset editedUser state to user state
    setEditedUser(user);
    setIsModified(false);
    setIsSaveEnabled(false);
    setImageFile(null); // Reset the selected image file
  };

  return (
    <div className="list">
      <Sidebar/>
      <section className="contents">
        <Navbar/>
        <PrimeReactProvider>
          <div className="user-profile">
            <div className="profile-header">
              <img src={`http://localhost:8080/uploads/${user.image}`} alt={user.firstName} className="profile-img" />
              <div className="profile-info">
                <h2>{user.firstName} {user.lastName}</h2>
                <span className="profile-id">ID: {user._id}</span>
                <button className="change-password-btn">Change Password</button>
              </div>
              <div className="button-container">
                <button className="save-btn" disabled={!isSaveEnabled} onClick={handleSaveClick}>Save</button>
                <button className="cancel-btn" onClick={handleCancelClick}>Cancel</button>
              </div>
            </div>
            <div className="profile-details">
              <div className="profile-section">
                <h3>Basic Info</h3>
                <div className="profile-fields">
                  <div className="field-group">
                    <label>First Name:</label>
                    <input type="text" name="firstName" value={editedUser.firstName} onChange={handleInputChange} />
                  </div>
                  <div className="field-group">
                    <label>Last Name:</label>
                    <input type="text" name="lastName" value={editedUser.lastName} onChange={handleInputChange} />
                  </div>
                  <div className="field-group">
                    <label>Department:</label>
                    <input type="text" name="department" value={editedUser.department} onChange={handleInputChange} />
                  </div>
                  <div className="field-group">
                    <label>Position:</label>
                    <input type="text" name="position" value={editedUser.position} onChange={handleInputChange} />
                  </div>
                  <div className="field-group">
                    <label>Hired Date:</label>
                    <input type="text" name="hiredDate" value={editedUser.hiredDate} onChange={handleInputChange} />
                  </div>
                  <div className="field-group">
                    <label>Birth Date:</label>
                    <input type="text" name="birthDate" value={editedUser.birthDate} onChange={handleInputChange} />
                  </div>
                  <div className="field-group">
                    <label>Profile Image:</label>
                    <input type="file" accept="image/*" onChange={handleImageChange} />
                  </div>
                </div>
              </div>
            </div>
            <div className="profile-details">
              <div className="profile-section">
                <h3>Address</h3>
                <div className="profile-fields">
                  <div className="field-group">
                    <label>Address:</label>
                    <input type="text" name="address" value={editedUser.address} onChange={handleInputChange} />
                  </div>
                  <div className="field-group">
                    <label>City:</label>
                    <input type="text" name="city" value={editedUser.city} onChange={handleInputChange} />
                  </div>
                  <div className="field-group">
                    <label>Country:</label>
                    <input type="text" name="country" value={editedUser.country} onChange={handleInputChange} />
                  </div>
                </div>
              </div>
            </div>
            <div className="profile-details">
              <div className="profile-section">
                <h3>Contacts</h3>
                <div className="profile-fields">
                  <div className="field-group">
                    <label>Phone:</label>
                    <input type="text" name="phone" value={editedUser.phone} onChange={handleInputChange} />
                  </div>
                  <div className="field-group">
                    <label>Email:</label>
                    <input type="text" name="email" value={editedUser.email} onChange={handleInputChange} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </PrimeReactProvider>
      </section>
    </div>
  );
};

export default UserProfile;
