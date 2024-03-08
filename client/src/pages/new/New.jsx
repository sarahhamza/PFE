import "./new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState } from "react";
//import { useNavigate } from "react-router-dom";
import axios from "axios";

const New = () => {
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: ""
  });

  const [error, setError] = useState("");
  //const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState(""); // New state for success message

  const [file] = useState("");

  const handleChange = ({ target: { name, value } }) => {
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = "http://localhost:8080/api/users";
      const { data: res } = await axios.post(url, data);
      setSuccessMessage("User added successfully");
      //navigate("/login");
      console.log(res.message);
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.message);
      }
    }
  };


  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>Add New User </h1>
        </div>
        <div className="bottom">
          <div className="left">
            <img
              src={
                file
                  ? URL.createObjectURL(file)
                  : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
              }
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
                  //onChange={handleFileChange}
                  style={{ display: "none" }}
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
                  placeholder="John Doe"
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
                  onChange={handleChange}
                  value={data.password}
                  required
                />
              </div>

              <div className="formInput">
                <label htmlFor="role">Role</label>
                <select
                  id="role"
                  name="role"
                  onChange={handleChange}
                  value={data.role}
                  required
                >
                  <option value="">Select Role</option>

                  <option value="controlleur">Controlleur</option>
                  <option value="femme de menage">Femme de menage</option>
                </select>
              </div>
              {successMessage && (
                <div className="success_msg">{successMessage}</div>
              )}

              <button type="submit">Send</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default New;