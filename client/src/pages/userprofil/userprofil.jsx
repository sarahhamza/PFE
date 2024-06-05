import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal'; // Import react-modal
import './userprofil.css';
import "../list/list.scss";
import Sidebar from "../../components/sidebar/side";
import Navbar from "../../components/navbar/Navbar";
import { PrimeReactProvider } from "primereact/api";
import { BASE_URL } from '../../config';
import { URL } from '../../config';


Modal.setAppElement('#root'); // Required for accessibility

const UserProfile = () => {
  const [user, setUser] = useState({});
  const [editedUser, setEditedUser] = useState({});
  const [isModified, setIsModified] = useState(false);
  const [isSaveEnabled, setIsSaveEnabled] = useState(false);
  const [imageFile, setImageFile] = useState(null); 
  const [imagePreview, setImagePreview] = useState(null); // State for image preview
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const response = await axios.get(`${BASE_URL}/api/auth/user`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setUser(response.data);
          setEditedUser(response.data);
          setImagePreview(`${BASE_URL}/uploads/${response.data.image}`); // Set initial image preview
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

  const handleInputFocus = () => {
    setIsModified(true);
    setIsSaveEnabled(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file)); // Set image preview URL
    setIsModified(true);
    setIsSaveEnabled(true);
  };

  const handleSaveClick = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = user._id;

      if (!userId) {
        throw new Error('User ID is not defined');
      }

      const cleanedData = { ...editedUser };

      Object.keys(cleanedData).forEach(key => {
        if (cleanedData[key] === '' || cleanedData[key] === null) {
          delete cleanedData[key];
        }
      });

      const formData = new FormData();
      for (const key in cleanedData) {
        formData.append(key, cleanedData[key]);
      }

      if (imageFile) {
        formData.append('image', imageFile);
      }

      await axios.put(`${BASE_URL}/api/users/${userId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setIsSaveEnabled(false);
      setIsModified(false);
      setUser(editedUser);
      alert("Profile modified successfully");
    } catch (error) {
      console.error("Error saving user data:", error);
    }
  };

  const handleCancelClick = () => {
    setEditedUser(user);
    setIsModified(false);
    setIsSaveEnabled(false);
    setImageFile(null);
    setImagePreview(`${BASE_URL}/uploads/${user.image}`); // Reset image preview to original
  };

  const handleChangePasswordClick = () => {
    setIsPasswordModalOpen(true);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    try {
        const response = await axios.post(`${BASE_URL}/api/auth/change-password/${user._id}`, {
            currentPassword,
            newPassword
        });

        if (response.status === 200) {
            alert("Password changed successfully");
            setIsPasswordModalOpen(false);
            setCurrentPassword('');
            setNewPassword('');
        }
    } catch (error) {
        console.error("Error changing password:", error);
        alert("Failed to change password. Please check your current password.");
    }
};
  const closeModal = () => {
    setIsPasswordModalOpen(false);
    setCurrentPassword('');
    setNewPassword('');
  };

  return (
    <div className="list">
      <Sidebar />
      <section className="contents">
        <Navbar />
        <PrimeReactProvider>
          <div className="user-profile">
            <div className="profile-header">
              <img src={imagePreview} alt={user.firstName} className="profile-img" />
              <div className="profile-info">
                <h2>{user.firstName} {user.lastName}</h2>
                <span className="profile-id">ID: {user.cin}</span>
                <button className="change-password-btn" onClick={handleChangePasswordClick}>Change Password</button>
              </div>
              <div className="button-container">
                <button className="save-btn" disabled={!isSaveEnabled} onClick={handleSaveClick}>Save</button>
                <button className="cancel-btn" onClick={handleCancelClick}>Cancel</button>
              </div>
            </div>
            <div className="profile-details">
              <div className="profile-section">
                <h3>Basic Info</h3>
                <div className="field-group">
                  <label>Profile Image:</label>
                  <input type="file" accept="image/*" onChange={handleImageChange} />
                </div>
                <div className="profile-fields">
                  <div className="field-group">
                    <label>First Name:</label>
                    <input type="text" name="firstName" value={editedUser.firstName} onChange={handleInputChange} onFocus={handleInputFocus} />
                  </div>
                  <div className="field-group">
                    <label>Last Name:</label>
                    <input type="text" name="lastName" value={editedUser.lastName} onChange={handleInputChange} onFocus={handleInputFocus} />
                  </div>
                  <div className="field-group">
                    <label>Gender:</label>
                    <input type="text" name="gender" value={editedUser.gender} onChange={handleInputChange} onFocus={handleInputFocus} />
                  </div>
                  <div className="field-group">
                    <label>Birth Date:</label>
                    <input type="date" name="birthdate" value={editedUser.birthdate} onChange={handleInputChange} onFocus={handleInputFocus} />
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
                    <input type="text" name="address" value={editedUser.address} onChange={handleInputChange} onFocus={handleInputFocus} />
                  </div>
                  <div className="field-group">
                    <label>Country:</label>
                    <input type="text" name="country" value={editedUser.country} onChange={handleInputChange} onFocus={handleInputFocus} />
                  </div>
                  <div className="field-group">
                    <label>Postal code:</label>
                    <input type="text" name="postalcode" value={editedUser.postalcode} onChange={handleInputChange} onFocus={handleInputFocus} />
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
                    <input type="text" name="phone" value={editedUser.phone} onChange={handleInputChange} onFocus={handleInputFocus} />
                  </div>
                  <div className="field-group">
                    <label>Email:</label>
                    <input type="text" name="email" value={editedUser.email} onChange={handleInputChange} onFocus={handleInputFocus} required />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </PrimeReactProvider>
      </section>

      {/* Password Change Modal */}
      <Modal
        isOpen={isPasswordModalOpen}
        onRequestClose={closeModal}
        contentLabel="Change Password"
        className="password-modal"
        overlayClassName="password-modal-overlay"
      >
        <h2>Change Password</h2>
        <form onSubmit={handlePasswordChange}>
          <div className="field-group">
            <label>Current Password:</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          <div className="field-group">
            <label>New Password:</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="submit-btn">Change Password</button>
          <button type="button" className="cancel-btn" onClick={closeModal}>Cancel</button>
        </form>
      </Modal>
    </div>
  );
};

export default UserProfile;
