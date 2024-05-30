import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { AiOutlineCamera } from "react-icons/ai";
import { Dialog } from 'primereact/dialog';
import "./controllerRooms.scss";
import io from 'socket.io-client';

export default function ControllerRooms() {
    const [rooms, setRooms] = useState([]);
    const [editMessage, seteditMessage] = useState("");
    const [deleteMessage, setdeletetMessage] = useState("");
    const [cleanlinessMessage, setCleanlinessMessage] = useState("");
    const [statuses] = useState(['Clean', 'In Progress', 'Messy']);
    const [users, setUsers] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [showDialog, setShowDialog] = useState(false);

    useEffect(() => {
        fetchRooms();
        fetchUsers();

        const socket = io('http://localhost:5000');  // Assurez-vous que le port correspond à celui de votre backend
        socket.on('cleanliness_result', (data) => {
            console.log('Received cleanliness_result:', data);  // Debugging print
            if (data.percentage !== null) {
                setCleanlinessMessage(`Cleanliness detected: ${data.percentage}%`);
                setTimeout(() => setCleanlinessMessage(''), 5000);
            } else {
                console.error("Error: cleanliness percentage is null");
            }
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
            console.log("Fetched room data:", roomData); // Debugging print
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

    const showImage = (imageUrl) => {
        const fullImageUrl = `http://localhost:8080/images/${imageUrl}`;
        console.log('Full Image URL:', fullImageUrl);  // Debugging print
        setSelectedImage(fullImageUrl);
        setShowDialog(true);
    };

    const hideDialog = () => {
        setShowDialog(false);
        setSelectedImage(null);
    };

    const cameraBodyTemplate = (rowData) => {
        console.log('Row Data:', rowData);  // Debugging print
        return <AiOutlineCamera className="camera-icon" onClick={() => showImage(rowData.image)} />;
    };

    return (
        <div>
            <div className="top1">
                <h1>List Of Rooms</h1>
            </div>
            {editMessage && <div className="editMessage">{editMessage}</div>}
            {deleteMessage && <div className="deleteMessage">{deleteMessage}</div>}
            {cleanlinessMessage && <div className="notification-popup">{cleanlinessMessage}</div>}
            <div className="card1 p-fluid">
                <DataTable value={rooms} paginator rows={4} editMode="row" dataKey="id" tableStyle={{ maxWidth: '85rem', height:'300px'}}>
                    <Column field="nbrRoom" header="Number of Rooms" editor={(options) => numberEditor(options)} style={{ width: '15%', lineHeight: '3rem' }}></Column>
                    <Column field="Surface" header="Surface" editor={(options) => numberEditor(options)} style={{ width: '15%' }}></Column>
                    <Column field="Categorie" header="Category" editor={(options) => categoryEditor(options)} style={{ width: '15%' }}></Column>
                    <Column field="State" header="State" body={statusBodyTemplate} editor={(options) => statusEditor(options)} style={{ width: '15%' }}></Column>
                    <Column field="User" header="User" body={(rowData) => {
                        const user = users.find(user => user._id === rowData.User);
                        return user ? user.email : '';
                    }} editor={(options) => userEditor(options)} style={{ width: '15%' }}></Column>
                    <Column field="Property" header="Property" editor={(options) => textEditor(options)} style={{ width: '15%' }}></Column>
                    <Column body={cameraBodyTemplate} style={{ width: '10%', textAlign: 'center' }}></Column>
                </DataTable>
            </div>
            <Dialog visible={showDialog} onHide={hideDialog} header="Room Image">
                {selectedImage ? (
                    <img src={selectedImage} alt="Room" style={{ width: '100%' }} />
                ) : (
                    <p>No image available</p>
                )}
            </Dialog>
        </div>
    );
}
