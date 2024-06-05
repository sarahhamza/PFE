// src/hooks/useAuth.js
import { useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../config';
import { useNavigate } from 'react-router-dom';

export function useHandleLogin() {
    const [data, setData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [user, setUser] = useState(null);

    const handleChange = ({ target }) => {
        setData({ ...data, [target.name]: target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const url = `${BASE_URL}/api/auth`;
            const { data: res } = await axios.post(url, data);
            localStorage.setItem("token", res.data);

            const userData = await axios.get(`${BASE_URL}/api/auth/user`, {
                headers: {
                    Authorization: `Bearer ${res.data}`
                }
            });

            setUser(userData.data);
            return userData.data;
        } catch (error) {
            if (error.response && error.response.status >= 400 && error.response.status <= 500) {
                setError(error.response.data.message);
                console.error(error.response.data);
            }
            throw error;
        }
    };

    return {
        data,
        error,
        user,
        handleChange,
        handleLogin
    };
}
export function useSignup() {
    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: ""
    });
    const [image, setFile] = useState(null);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();

    const handleChange = ({ currentTarget: input }) => {
        setData({ ...data, [input.name]: input.value });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            const url = `${BASE_URL}/api/users`;
            const formData = new FormData();

            // Append all form data
            Object.entries(data).forEach(([key, value]) => {
                formData.append(key, value);
            });

            // Append the image file
            if (image) {
                formData.append("image", image, image.name);
            }

            const { data: res } = await axios.post(url, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            navigate("/login");

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

    return {
        data,
        image,
        error,
        successMessage,
        handleChange,
        handleFileChange,
        handleSignUp,
    };
}