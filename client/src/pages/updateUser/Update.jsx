import "./Update.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState, useEffect } from "react";
import { useParams, useLocation} from 'react-router-dom';
import axios from "axios";


const Update = () => {
  const { userId } = useParams();
  const location = useLocation();
  const imageUrl = location.state ? location.state.imageUrl : null;
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: ""
  });

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [image, setFile] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/users/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const userData = await response.json();
        setData(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userId]);

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
      const url = `http://localhost:8080/api/users/${userId}`;
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
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
          <h1>Update User </h1>
        </div>
        <div className="bottom">
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
              {error && <div className="error_msg">{error}</div>}

              <button type="submit">Send</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Update;
