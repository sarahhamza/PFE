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
import "./controllerRooms.scss";
import io from 'socket.io-client';

export default function ControllerRooms() {
    const [rooms, setRooms] = useState([]);
    const [editMessage, seteditMessage] = useState("");
    const [deleteMessage, setdeletetMessage] = useState("");
    const [cleanlinessMessage, setCleanlinessMessage] = useState("");
    const [statuses] = useState(['Clean', 'In Progress', 'Messy']);
    const [users, setUsers] = useState([]);
    
    useEffect(() => {
        fetchRooms();
        fetchUsers();

        const socket = io('http://localhost:5000');  // Assurez-vous que le port correspond à celui de votre backend
        socket.on('cleanliness_result', (data) => {
            setCleanlinessMessage(`Cleanliness detected: ${data.percentage}%`);
            setTimeout(() => setCleanlinessMessage(''), 5000);
        });

        return () => {
            socket.disconnect();
        };
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
        console.log("rowData:", rowData);
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
            fetchRooms();
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
        return <Tag className={`status-tag p-tag-${severity}`} value={rowData.State} />;
    };

    const categoryEditor = (options) => {
        return (
            <Dropdown
                value={options.value}
                options={['Category1', 'Category2', 'Category3']}
                onChange={(e) => options.editorCallback(e.value)}
                placeholder="Select Category"
            />
        );
    };

    const allowEdit = (rowData) => {
        return true;
    };

    const handleImport = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('http://localhost:8080/api/rooms/import', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to import data');
            }

            fetchRooms();
            seteditMessage("Data imported successfully");
            setTimeout(() => seteditMessage(''), 2000);
        } catch (error) {
            console.error("Error importing data:", error);
        }
    };

    return (
        <div>
            <div className="top1">
                <h1>List Of Rooms</h1>
                <Link to="/rooms/new" className="link1">
                    <BsHouseAdd className='neww'/>  <p className='new'>New</p>
                </Link>
                <Link to="/capture-room" className="link1">
                    <AiOutlineCamera className='neww'/> <p className='new'>Capture</p>
                </Link>
            </div>
            <div className="top2">
                <input type="file" accept=".csv" onChange={handleImport} />
            </div>
            {editMessage && <div className="edit-message">{editMessage}</div>}
            {deleteMessage && <div className="delete-message">{deleteMessage}</div>}
            {cleanlinessMessage && <div className="cleanliness-message">{cleanlinessMessage}</div>}
            <div className="card1">
                <DataTable value={rooms} editable="true" editMode="row" onRowEditComplete={EditRoom} dataKey="_id" className="datatable-room">
                    <Column field="nbrRoom" header="Room Number" editor={textEditor} style={{ minWidth: '8rem' }} />
                    <Column field="Surface" header="Surface" editor={numberEditor} style={{ minWidth: '8rem' }} />
                    <Column field="Categorie" header="Category" editor={categoryEditor} style={{ minWidth: '8rem' }} />
                    <Column field="State" header="State" body={statusBodyTemplate} editor={statusEditor} style={{ minWidth: '8rem' }} />
                    <Column field="User" header="User" editor={userEditor} style={{ minWidth: '10rem' }} />
                    <Column rowEditor headerStyle={{ width: '7rem', minWidth: '7rem' }} bodyStyle={{ textAlign: 'center' }} body={rowData => allowEdit(rowData) && <Button type="button" icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" />} />
                    <Column body={(rowData) => <Button type="button" icon={<BsXLg />} className="p-button-rounded p-button-danger" onClick={() => archiveRoom(rowData)} />} headerStyle={{ width: '7rem', minWidth: '7rem' }} bodyStyle={{ textAlign: 'center' }} />
                </DataTable>
            </div>
        </div>
    );
}
