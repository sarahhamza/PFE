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
import { BASE_URL }  from '../../config';

import "./Rooms.scss";

export default function RowEditingDemo() {
    const [rooms, setRooms] = useState([]);
    const [editMessage, seteditMessage] = useState("");
    const [deleteMessage, setDeleteMessage] = useState("");
    const [statuses] = useState(['Clean', 'In Progress', 'Messy']);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchRooms();
        fetchUsers();
    }, []);

    const fetchRooms = async () => {
        try {
            const response = await fetch(`${BASE_URL}/api/rooms`);
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
            const response = await fetch(`${BASE_URL}/api/users`);
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
                options={users.map(user => ({ label: user.email, value: user._id }))} // Change value to user.email
                onChange={(e) => options.editorCallback(e.value)}
                placeholder="Select a User"
                className='mb-4 custom-input1'
            />
        );
    };

    const EditRoom = async (rowData) => {
        console.log("rowData:", rowData); // Log the rowData to inspect its structure
        const { _id, nbrRoom, Surface, Categorie, State, User, Property } = rowData.newData; // Access _id from newData

        // Ensure that _id is valid
        if (!_id) {
            console.error("Error updating room: Room ID is undefined");
            return;
        }

        const updatedData = { nbrRoom, Surface, Categorie, State, User, Property }; // Create a new object without circular references

        try {
            const response = await fetch(`${BASE_URL}/api/rooms/${_id}/edit`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedData) // Pass the new object for stringification
            });

            if (!response.ok) {
                throw new Error("Failed to update room");
            }

            const updatedRooms = rooms.map(room => (room._id === _id ? rowData : room));
            setRooms(updatedRooms);
            fetchRooms();
            seteditMessage("Room updated successfully");
            setTimeout(() => seteditMessage(''), 2000);
            // Handle success or update UI as needed
        } catch (error) {
            console.error("Error updating room:", error);
            // Handle error or show error message
        }
    };
    const archiveRoom = async (rowData) => {
        console.log("rowData:", rowData); // Log the rowData to inspect its structure
        const { _id } = rowData; // Access _id from rowData
    
        // Ensure that _id is valid
        if (!_id) {
            console.error("Error archiving room: Room ID is undefined");
            return;
        }
    
        const updatedData = { archived: true }; // Set archived to true
    
        try {
            const response = await fetch(`${BASE_URL}/api/rooms/${_id}/archive`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedData) // Pass the new object for stringification
            });
    
            if (!response.ok) {
                throw new Error(`Failed to archive room with ID ${_id}`);
            }
    
            // Update the room's status in the local state
            setRooms(prevRooms => prevRooms.map(room => {
                if (room._id === _id) {
                    return { ...room, archived: true }; // Set archived to true
                }
                return room;
            }));
    
            fetchRooms();
            setDeleteMessage("Room archived successfully");
            setTimeout(() => setDeleteMessage(''), 2000);
    
        } catch (error) {
            console.error("Error archiving room:", error);
        }
    };
    const getSeverity = (value) => {
        switch (value) {
            case 'Cleaned':
                return 'success';
            case 'In progress':
                return 'warning';
            case 'Not cleaned':
                return 'danger';
            default:
                return null;
        }
    };
    const textEditor = (options) => {
        return <InputText value={options.value} onChange={(e) => options.editorCallback(e.target.value)}  style={{ width: '100%' }} className='mb-4 custom-input1' />;
    };

    const numberEditor = (options) => {
        return <InputNumber value={options.value} onValueChange={(e) => options.editorCallback(e.value)} className='mb-4 custom-input1'/>;
    };

    const statusEditor = (options) => {
        return (
            <Dropdown
                value={options.value}
                options={statuses.map(status => ({ label: status, value: status }))}
                onChange={(e) => options.editorCallback(e.value)}
                placeholder="Select a Status"
                className='mb-4 custom-input1'
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
                className='mb-4 custom-input1'
            />
        );
    };
    const allowEdit = (rowData) => {
        // Add your condition here based on rowData if editing is allowed
        return true; // Example: always allow editing
    };
    const handleImport = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            const formData = new FormData();
            formData.append('file', file);

            // Send file to the server for processing
            const response = await fetch(`${BASE_URL}/api/rooms/import`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to import data');
            }

            // Refresh room data after importing
            fetchRooms();
            seteditMessage("Data imported successfully");
            setTimeout(() => seteditMessage(''), 2000);
        } catch (error) {
            console.error("Error importing data:", error);
            // Handle error
        }
    };

    return (
        <div>
        <div className="top1">
            <h1>List Of Rooms</h1>
            <Link to="/rooms/new" className="link1">
              <BsHouseAdd className='neww'/>  <p className='new'>   New </p>
            </Link>
            <input
                type="file"
                id="fileInput"
                style={{ display: 'none' }} // Hide the input visually
                onChange={handleImport}
            />
            <Button
                type="button"
                icon="pi pi-upload"
                label="Export"
                className="p-button-help"
                onClick={() => document.getElementById('fileInput').click()}
                data-pr-tooltip="Export Excel Data"

            />    
            </div>
            {editMessage && <div className="editMessage">{editMessage}</div>}
            {deleteMessage && <div className="deleteMessage">{deleteMessage}</div>}
            <div className="card1 p-fluid">
                <DataTable value={rooms} paginator rows={4} editMode="row" dataKey="id" onRowEditComplete={EditRoom} tableStyle={{ maxWidth: '85rem', height:'300px'}}>
                    <Column field="nbrRoom" header="Number of Rooms" editor={(options) => numberEditor(options)} style={{ width: '20%', lineHeight: '3rem' }}></Column>
                    <Column field="Surface" header="Surface" editor={(options) => numberEditor(options)} style={{ width: '20%' }}></Column>
                    <Column field="Categorie" header="Category" editor={(options) => categoryEditor(options)} style={{ width: '20%' }}></Column>
                    <Column field="State" header="State" body={statusBodyTemplate} editor={(options) => statusEditor(options)} style={{ width: '20%' }}></Column>
                    <Column field="User" header="User" body={(rowData) => {
                        const user = users.find(user => user._id === rowData.User);
                        return user ? user.email : '';
                    }} editor={(options) => userEditor(options)} style={{ width: '20%' }}></Column>
                    <Column field="Property" header="Property" editor={(options) => textEditor(options)} style={{ width: '20%' }}></Column>
                    <Column rowEditor={allowEdit} headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
                    
                    <Column style={{ width: '10%' }} body={(rowData) => (
                        <Button  className="btndelete1" icon={<BsXLg className="btndelete1" />} onClick={() => archiveRoom(rowData)} />
                    )} />
                </DataTable>
            </div>
        </div>
    );
}