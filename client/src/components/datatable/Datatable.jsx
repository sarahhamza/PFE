import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./datatable.scss";

const Datatable = () => {
  const [data, setData] = useState([]);
  const [acceptMessage, setAcceptMessage] = useState(""); // Ajout de la variable d'état pour le message d'acceptation

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/users");
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      const userData = await response.json();
      // Filtrer les utilisateurs avec accept === 1
      const acceptedUsers = userData.filter(user => user.accept === 0);
      setData(acceptedUsers);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  

  const handleAccept = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/users/${id}/accept`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ accept: 1 })
      });
      if (!response.ok) {
        throw new Error("Failed to update user accept status");
      }
      setData(prevData => prevData.map(user => user._id === id ? { ...user, accept: 1 } : user));
      
      // Mettre à jour le message d'acceptation
      setAcceptMessage("User accepted successfully");
      
      // Recharger la page
      window.location.reload();
    } catch (error) {
      console.error("Error updating user accept status:", error);
    }
  };
  

  const handleDelete = (id) => {
    console.log("Deleting user with ID:", id);
  };

  return (
    <div className="datatable">
      <div className="datatableTitle">
        Add New User
        <Link to="/users/new" className="link">
          Add New
        </Link>
      </div>
      <div className="datatable-container">
        {/* Afficher le message d'acceptation si le message est défini */}
        {acceptMessage && <div className="acceptMessage">{acceptMessage}</div>}
        <table className="user-table">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((user) => (
              <tr key={user._id}>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <div
                    className="viewButton"
                    onClick={() => handleAccept(user._id)} // Utiliser handleAccept pour accepter l'utilisateur
                  >
                    Accept
                  </div>
                  <div
                    className="deleteButton"
                    onClick={() => handleDelete(user._id)}
                  >
                    Delete
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Datatable;
