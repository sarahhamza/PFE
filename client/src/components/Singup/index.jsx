import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";


const Signup = () => {
    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: ""
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [image, setFile] = useState(null); 
    const [successMessage, setSuccessMessage] = useState("");



    const handleChange = ({ currentTarget: input }) => {
        setData({ ...data, [input.name]: input.value });
    };
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const url = "http://localhost:8080/api/users";
          const formData = new FormData();
    
          // Append all form data
          Object.entries(data).forEach(([key, value]) => {
            formData.append(key, value);
          });
    
          // Append the image file
        if (image) {
          formData.append("image", image, image.name); // Add the third parameter with the file name
        }
    
          const { data: res } = await axios.post(url, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          navigate("/login")
    
          setSuccessMessage("User added successfully");
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
        <div className={styles.signup_container}>
            <div className={styles.signup_form_container}>
                <div className={styles.left}>
                    <h1>Welcome Back</h1>
                    <Link to="/login">
                        <button type="button" className={styles.white_btn}>
                            Sing in
                        </button>
                    </Link>
                </div>
                <div className={styles.right}>
                <div className="left">
            <img
              src={
                image
                  ? URL.createObjectURL(image)
                  : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
              }
              alt=""
            />
          </div>
                    <form className={styles.form_container} onSubmit={handleSubmit}>
                        <h1>Create Account</h1>
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
                        <input
                            type="text"
                            placeholder="First Name"
                            name="firstName"
                            onChange={handleChange}
                            value={data.firstName}
                            required
                            className={styles.input}
                        />
                        <input
                            type="text"
                            placeholder="Last Name"
                            name="lastName"
                            onChange={handleChange}
                            value={data.lastName}
                            required
                            className={styles.input}
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            name="email"
                            onChange={handleChange}
                            value={data.email}
                            required
                            className={styles.input}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            name="password"
                            onChange={handleChange}
                            value={data.password}
                            required
                            className={styles.input}
                        />
                        {/* Champ role */}
                        <select
                            name="role"
                            onChange={handleChange}
                            value={data.role}
                            required
                            className={styles.input}
                        >
                            <option value="">Select Role</option>
                            <option value="controlleur">Controlleur</option>
                            <option value="femme de menage">Femme de menage</option>
                        </select>
                        {error && <div className={styles.error_msgE}>{error}</div>}
                        {successMessage && <div className={styles.success_msg}>{successMessage}</div>}

                        <button type="submit" className={styles.green_btn}>
                            Sing Up
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Signup;
