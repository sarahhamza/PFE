import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./datatable.scss";

const Datatable = () => {
  const [data, setData] = useState([]);
  const [acceptMessage, setAcceptMessage] = useState(""); // Ajout de la variable d'état pour le message d'acceptation
  const [deleteMessage, setdeletetMessage] = useState(""); // Ajout de la variable d'état pour le message d'acceptation

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
  
      // Wait for the PUT request to complete before reloading the page
      //await response.json();
  
      setData((prevData) =>
        prevData.map((user) => (user._id === id ? { ...user, accept: 1 } : user))
      );
      const updatedUsers = data.filter(user => user._id !== id);
      setData(updatedUsers);
      // Mettre à jour le message d'acceptation
      setAcceptMessage("User accepted successfully. Congratulations email sent!");
      setTimeout(() => setAcceptMessage(''), 2000);      setTimeout(() => setAcceptMessage(''), 2000);

  
      // Ne rechargez la page qu'après que la requête ait réussi
      //window.location.reload();
    } catch (error) {
      console.error("Error updating user accept status:", error);
    }
  };
  

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/users/${id}/delete`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        throw new Error(`Failed to delete user with ID ${id}`);
      }
  
      // Filtrer les utilisateurs après la suppression de l'utilisateur
      const updatedUsers = data.filter(user => user._id !== id);
      setData(updatedUsers);
      setdeletetMessage("User deleted successfully");
      setTimeout(() => setdeletetMessage(''), 2000);


    } catch (error) {
      console.error("Error deleting user:", error);
    }
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
        {deleteMessage && <div className="deleteMessage">{deleteMessage}</div>}

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