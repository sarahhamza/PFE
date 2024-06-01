import React, { useState, useEffect } from "react";
import { useParams, useLocation } from 'react-router-dom';
import axios from "axios";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import "./Update.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";

const Update = () => {
  const { userId } = useParams();
  const location = useLocation();
  const imageUrl = location.state ? location.state.imageUrl : null;
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "",
    phone: "", // New field
    address: "", // New field
    country: "" ,// New field
    gender: "", // New field
    cin: "", // New field
    birthdate: "", // New field
  });

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [image, setFile] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/users/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const userData = await response.json();
        setData({
          ...userData,
          password: "" // Keep password empty
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleChange = ({ target: { name, value } }) => {
    setData((prevData) => ({
      ...prevData,
      [name]: name === 'rooms' ? value.split(',').map(id => id.trim()) : value,
    }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const url = `http://localhost:8080/api/users/${userId}`;
      const formData = new FormData();
  
      Object.entries(data).forEach(([key, value]) => {
        if (
          (key !== 'password' || value) && // Only append password if it's not empty
          (key !== 'rooms' || (Array.isArray(value) && value.length > 0)) // Only append rooms if it's a non-empty array
        ) {
          formData.append(key, value);
        }
      });
      
  
      if (image) {
        formData.append("image", image, image.name);
      }
  
      const { data: res } = await axios.put(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      setSuccessMessage("User updated successfully");
      console.log(res.message);
    } catch (error) {
      console.error("Error updating user:", error);
      if (error.response && error.response.status >= 400 && error.response.status <= 500) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred");
      }
    }
  };
  

  return (
    <div className="new">
      <div className="newContainer">
        <div className="top2">
          <h1>Update User</h1>
        </div>
        <div className="bottom2">
          <div className="left">
            <img
              src={imageUrl || "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"}
              alt=""
            />
          </div>
          <div className="right">
            <form onSubmit={handleSubmit}>
              <div className="formInput">
                <label htmlFor="file">
                  Image: <DriveFolderUploadOutlinedIcon className="icon" />
                </label>
                <input
                  type="file"
                  id="file"
                  onChange={handleFileChange}
                />
              </div>

              <div className="formInput">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  placeholder="john_doe"
                  onChange={handleChange}
                  value={data.firstName}
                  required
                />
              </div>

              <div className="formInput">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  placeholder="Doe"
                  onChange={handleChange}
                  value={data.lastName}
                  required
                />
              </div>

              <div className="formInput">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="john_doe@gmail.com"
                  onChange={handleChange}
                  value={data.email}
                  required
                />
              </div>

              <div className="formInput">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="password"
                  onChange={handleChange}
                  value={data.password}
                  required
                />
              </div>

              <div className="formInput">
                <label htmlFor="role">Role</label>
                <select id="role" name="role" onChange={handleChange} value={data.role} required>
                  <option value="">Select role</option>
                  <option value="controlleur">Controlleur</option>
                  <option value="femme de menage">Femme de menage</option>
                </select>
              </div>

              <div className="formInput">
                <label htmlFor="phone">Phone</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  placeholder="123-456-7890"
                  onChange={handleChange}
                  value={data.phone}
                />
              </div>

              <div className="formInput">
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  placeholder="123 Main St"
                  onChange={handleChange}
                  value={data.address}
                />
              </div>

              <div className="formInput">
                <label htmlFor="country">Country</label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  placeholder="USA"
                  onChange={handleChange}
                  value={data.country}
                />
              </div>

              <div className="formInput">
                <label htmlFor="gender">Gender</label>
                <select
                  id="gender"
                  name="gender"
                  onChange={handleChange}
                  value={data.gender}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div className="formInput">
                <label htmlFor="cin">CIN</label>
                <input
                  type="text"
                  id="cin"
                  name="cin"
                  placeholder="CIN"
                  onChange={handleChange}
                  value={data.cin}
                />
              </div>

              <div className="formInput">
                <label htmlFor="birthdate">Birthdate</label>
                <input
                  type="date"
                  id="birthdate"
                  name="birthdate"
                  onChange={handleChange}
                  value={data.birthdate}
                />
              </div>
              
              <button type="submit">Send</button>
              {successMessage && (
                <div className="success_msg">{successMessage}</div>
              )}
              {error && <div className="error_msg">{error}</div>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Update;