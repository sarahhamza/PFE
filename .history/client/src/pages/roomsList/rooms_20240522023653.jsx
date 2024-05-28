// RowEditingDemo.js

import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { BsXLg } from "react-icons/bs";
import { Link } from "react-router-dom";
import { BsHouseAdd } from "react-icons/bs";
import { AiOutlineCamera } from "react-icons/ai";
import "./Rooms.scss";

export default function RowEditingDemo() {
    const [rooms, setRooms] = useState([]);
    const [editMessage, seteditMessage] = useState("");
    const [deleteMessage, setdeletetMessage] = useState("");
    const [notification, setNotification] = useState(null);
    const [statuses] = useState(['Clean', 'In Progress', 'Messy']);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchRooms();
        fetchUsers();
    }, []);

    const fetchRooms = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/rooms");
            if (!response.ok) {
                throw new Error("Failed to fetch room data");
            }
            const roomData = await response.json();
            setRooms(roomData);
        } catch (error) {
            console.error("Error fetching room data:", error);
        }
    };
    
    const handleImageImport = async (rowData) => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;
    
            try {
                const formData = new FormData();
                formData.append('image', file);
    
                // Envoyer l'image au serveur pour traitement
                const response = await fetch('http://localhost:5000/api/cleanliness', {
                    method: 'POST',
                    body: formData
                });
    
                if (!response.ok) {
                    throw new Error('Échec de l\'importation de l\'image');
                }
    
                const data = await response.json();
                const cleanlinessPercentage = data.cleanliness_percentage;
                setNotification(`Room is ${data.status} with ${cleanlinessPercentage}% cleanliness.`);
                setTimeout(() => setNotification(null), 5000); // Hide notification after 5 seconds
    
            } catch (error) {
                console.error("Erreur lors de l'importation de l'image:", error);
                // Gérer l'erreur
            }
        };
        fileInput.click();
    };
    
    const fetchUsers = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/users");
            if (!response.ok) {
                throw new Error("Failed to fetch user data");
            }
            const userData = await response.json();
            setUsers(userData);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    const userEditor = (options) => {
        return (
            <Dropdown
                value={options.value}
                options={users.map(user => ({ label: user.email, value: user._id }))}
                onChange={(e) => options.editorCallback(e.value)}
                placeholder="Select a User"
            />
        );
    };

    const EditRoom = async (rowData) => {
        const { _id, nbrRoom, Surface, Categorie, State, User, Property } = rowData.newData;

        if (!_id) {
            console.error("Error updating room: Room ID is undefined");
            return;
        }

        const updatedData = { nbrRoom, Surface, Categorie, State, User, Property };

        try {
            const response = await fetch(`http://localhost:8080/api/rooms/${_id}/edit`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedData)
            });

            if (!response.ok) {
                throw new Error("Failed to update room");
            }

            const updatedRooms = rooms.map(room => (room._id === _id ? rowData : room));
            setRooms(updatedRooms);
            fetchRooms();
            seteditMessage("Room updated successfully");
            setTimeout(() => seteditMessage(''), 2000);
        } catch (error) {
            console.error("Error updating room:", error);
        }
    };

    const archiveRoom = async (rowData) => {
        try {
            const response = await fetch(`http://localhost:8080/api/rooms/${rowData._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ archived: true })
            });
    
            if (!response.ok) {
                throw new Error(`Failed to archive room with ID ${rowData._id}`);
            }
    
            setRooms(prevRooms => prevRooms.map(room => {
                if (room._id === rowData._id) {
                    return { ...room, archived: true };
                }
                return room;
            }));
            fetchRooms()
            setdeletetMessage("Room archived successfully");
            setTimeout(() => setdeletetMessage(''), 2000);
    
        } catch (error) {
            console.error("Error archiving room:", error);
        }
    };

    const getSeverity = (value) => {
        switch (value) {
            case 'Clean':
                return 'success';
            case 'In Progress':
                return 'warning';
            case 'Messy':
                return 'danger';
            default:
                return null;
        }
    };

    const textEditor = (options) => {
        return <InputText value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
    };

    const numberEditor = (options) => {
        return <InputNumber value={options.value} onValueChange={(e) => options.editorCallback(e.value)} />;
    };

    const statusEditor = (options) => {
        return (
            <Dropdown
                value={options.value}
                options={statuses.map(status => ({ label: status, value: status }))}
                onChange={(e) => options.editorCallback(e.value)}
                placeholder="Select a Status"
            />
        );
    };

    const statusBodyTemplate = (rowData) => {
        const severity = getSeverity(rowData.State);
        return <Tag className={`status-tag p-tag-${severity}`} value={rowData.State}></Tag>;
    };

    const renderHeader = () => {
        return (
            <div className="table-header">
                <h2>Rooms</h2>
                <div className="icons">
                    <Link to='/Dashboard/AddRoom'>
                        <BsHouseAdd className="add-icon" />
                    </Link>
                </div>
            </div>
        );
    };

    const header = renderHeader();

    return (
        <div className="room-container">
            <h1>Room List</h1>
            <DataTable
                value={rooms}
                editMode="row"
                header={header}
                className="editable-table"
                responsiveLayout="scroll"
                rowClassName={(data) => data.archived ? 'archived-row' : ''}
                onRowEditComplete={EditRoom}
            >
                <Column field="nbrRoom" header="Room Number" editor={(options) => textEditor(options)} />
                <Column field="Surface" header="Surface" editor={(options) => numberEditor(options)} />
                <Column field="Categorie" header="Category" editor={(options) => textEditor(options)} />
                <Column field="State" header="State" body={statusBodyTemplate} editor={(options) => statusEditor(options)} />
                <Column field="User" header="User" editor={(options) => userEditor(options)} />
                <Column
                    body={(rowData) => (
                        <Button icon="pi pi-trash" className="p-button-danger p-mr-2" onClick={() => archiveRoom(rowData)} />
                    )}
                />
                <Column
                    body={(rowData) => (
                        <Button
                            icon={<AiOutlineCamera />}
                            className="p-button-secondary"
                            onClick={() => handleImageImport(rowData)}
                        />
                    )}
                />
            </DataTable>
            {editMessage && <div className="edit-message">{editMessage}</div>}
            {deleteMessage && <div className="delete-message">{deleteMessage}</div>}
            {notification && <div className="notification">{notification}</div>}
        </div>
    );
}
