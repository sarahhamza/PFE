import "./new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState } from "react";
import axios from "axios";
import styles from "../../components/Singup/styles.module.css";

const New = () => {
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "",
    phone: "", // New field
    address: "", // New field
    country: "", // New field
    gender: "",
    cin: "",
    birthdate: ""
  });

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [image, setFile] = useState(null);

  const handleChange = ({ target: { name, value } }) => {
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = "http://localhost:8080/api/users";
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });

      if (image) {
        formData.append("image", image, image.name);
      }

      const { data: res } = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccessMessage("User added successfully");
      console.log(res.message);
    } catch (error) {
      if (error.response && error.response.status >= 400 && error.response.status <= 500) {
        setError(error.response.data.message);
      }
    }
  };

  return (
    <div className="new">
      <div className="newContainer">
        <div className="top2">
          <h1>Add New User </h1>
        </div>
        <div className="bottom2">
          <div className="left">
            <img
              src={image ? URL.createObjectURL(image) : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"}
              alt=""
            />

          </div>

          <div className="right">
            <form onSubmit={handleSubmit}>
              <div className="formInput">
                <label htmlFor="file">
                  Image: <DriveFolderUploadOutlinedIcon className="icon" />
                </label>
              </div>
              <div className="formInput">
                <label htmlFor="CIN">CIN</label>
                <input
                  type="text"
                  id="cin"
                  name="cin"
                  placeholder="11447566"
                  onChange={handleChange}
                  value={data.cin}
                  required
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
                <label htmlFor="birthdate">Birthdate</label>
                <input
                  type="date"
                  id="birthdate"
                  name="birthdate"
                  onChange={handleChange}
                  value={data.birthdate}
                />
              </div>
              <input type="file" id="file" style={{ display: 'none' }} onChange={handleFileChange} />
                <div className="formInput">
                  <label htmlFor="gender">Gender</label>
                  <select id="gender" name="gender" onChange={handleChange} value={data.gender} required>
                    <option value="Select Gender">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>


              <button type="submit" >Send</button>
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

export default New;
