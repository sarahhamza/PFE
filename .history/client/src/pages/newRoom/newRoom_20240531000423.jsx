import "./newRoom.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useState, useEffect } from "react"; // Import useEffect hook
import axios from "axios";

const NewRoom = () => {
    const [data, setData] = useState({
        nbrRoom: "",
        Surface: "",
        Categorie: "",
        User: ""
    });

    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [image, setFile] = useState(null);
    const [users, setUsers] = useState([]); // State to store users

    useEffect(() => {
        // Fetch users when the component mounts
        const fetchUsers = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/users");
                setUsers(response.data); // Set the users state with the fetched data
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers(); // Call the fetchUsers function
    }, []); // Empty dependency array to fetch users only once when the component mounts

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
            const url = "http://localhost:8080/api/rooms";
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

            setSuccessMessage("Room added successfully");
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
            <div className="newContainer">
                <div className="top2">
                    <h1>Add New Room</h1>
                </div>
                <div className="bottom2">
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
                    <div className="right">
                        <form onSubmit={handleSubmit}>
                            <div className="formInput">
                                <label htmlFor="file">Image</label>
                                <input
                                    type="file"
                                    id="file"
                                    onChange={handleFileChange}
                                />
                            </div>

                            <div className="formInput">
                                <label htmlFor="nbrRoom">Number of the Room</label>
                                <input
                                    type="text"
                                    id="nbrRoom"
                                    name="nbrRoom"
                                    placeholder="Number of Rooms"
                                    onChange={handleChange}
                                    value={data.nbrRoom}
                                    required
                                />
                            </div>

                            <div className="formInput">
                                <label htmlFor="Surface">Surface</label>
                                <input
                                    type="text"
                                    id="Surface"
                                    name="Surface"
                                    placeholder="Surface"
                                    onChange={handleChange}
                                    value={data.Surface}
                                    required
                                />
                            </div>

                            <div className="formInput">
                                <label htmlFor="Categorie">Category</label>
                                <input
                                    type="text"
                                    id="Categorie"
                                    name="Categorie"
                                    placeholder="Category"
                                    onChange={handleChange}
                                    value={data.Categorie}
                                    required
                                />
                            </div>

                            
                            <div className="formInput">
                                <label htmlFor="User">User</label>
                                <select
                                    id="User"
                                    name="User"
                                    onChange={handleChange}
                                    value={data.User}
                                >
                                    <option value="">Select User</option>
                                    {users.map((user) => (
                                        <option key={user._id} value={user._id}>{user.email}</option>
                                    ))}
                                </select>
                            </div>

                            {successMessage && (
                                <div className="success_msg">{successMessage}</div>
                            )}
                            {error && <div className="error_msg">{error}</div>}

                            <button type="submit">Add Room</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewRoom;
