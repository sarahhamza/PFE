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

import "./Rooms.scss"

export default function RowEditingDemo() {
    const [rooms, setRooms] = useState([]);
    const [editMessage, seteditMessage] = useState(""); // Ajout de la variable d'état pour le message d'acceptation
    const [deleteMessage, setdeletetMessage] = useState(""); 
    const [statuses] = useState(['Clean', 'In Progress', 'Messy']); // Assuming these are the possible states
    const [users, setUsers] = useState([]); // State to store users

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
    const deleteRoom = async (rowData) => {
        try {
            const response = await fetch(`http://localhost:8080/api/rooms/${rowData._id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error(`Failed to delete room with ID ${rowData._id}`);
            }

            const updatedRooms = rooms.filter(room => room._id !== rowData._id);
            setRooms(updatedRooms);
            setdeletetMessage("Room deleted successfully");
            setTimeout(() => setdeletetMessage(''), 2000);

        } catch (error) {
            console.error("Error deleting room:", error);
        }
    };
    const userEditor = (options) => {
        return (
            <Dropdown
                value={options.value}
                options={users.map(user => ({ label: user.email, value: user._id }))} // Change value to user.email
                onChange={(e) => options.editorCallback(e.value)}
                placeholder="Select a User"
            />
        );
    };
    
    const onRowEditComplete = async (rowData) => {
        console.log("rowData:", rowData); // Log the rowData to inspect its structure
        const { _id, nbrRoom, Surface, Categorie, State, User, Property } = rowData.newData; // Access _id from newData
    
        // Ensure that _id is valid
        if (!_id) {
            console.error("Error updating room: Room ID is undefined");
            return;
        }
    
        const updatedData = { nbrRoom, Surface, Categorie, State, User, Property }; // Create a new object without circular references
    
        try {
            const response = await fetch(`http://localhost:8080/api/rooms/${_id}/edit`, {
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
        // Add your condition here based on rowData if editing is allowed
        return true; // Example: always allow editing
    };
    return (
        <div>
        <div className="top">
        <h1>List Of Rooms</h1>
        <Link to="/rooms/new" className="link">
         add new room <BsHouseAdd />
        </Link>
      </div>
                {editMessage && <div className="editMessage">{editMessage}</div>}
                {deleteMessage && <div className="deleteMessage">{deleteMessage}</div>}
        <div className="card p-fluid">
                
            <DataTable value={rooms} editMode="row" dataKey="id" onRowEditComplete={onRowEditComplete} tableStyle={{ minWidth: '50rem' }}>
                <Column field="nbrRoom" header="Number of Rooms" editor={(options) => numberEditor(options)} style={{ width: '20%' }}></Column>
                <Column field="Surface" header="Surface" editor={(options) => numberEditor(options)} style={{ width: '20%' }}></Column>
                <Column field="Categorie" header="Category" editor={(options) => categoryEditor(options)} style={{ width: '20%' }}></Column>
                <Column field="State" header="State" body={statusBodyTemplate}  editor={(options) => statusEditor(options)} style={{ width: '20%' }}></Column>
                <Column field="User" header="User"  editor={(options) => userEditor(options)} style={{ width: '20%' }}></Column>
                <Column field="Property" header="Property" editor={(options) => textEditor(options)} style={{ width: '20%' }}></Column>
                <Column rowEditor={allowEdit} headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
                <Column body={(rowData) => <Button onClick={() => deleteRoom(rowData)}  ><BsXLg /> </Button>} style={{ width: '10%' }} />
            </DataTable>
        </div>
        </div>
    );
}
