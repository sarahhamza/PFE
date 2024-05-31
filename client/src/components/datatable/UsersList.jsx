import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import 'primeflex/primeflex.css';
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primeicons/primeicons.css';
import { BiSolidUserCheck } from "react-icons/bi";
import { FaUserXmark } from "react-icons/fa6";
import { HiUserAdd } from "react-icons/hi";
import "./userList.scss";
import "./flags.scss";

export default function UserList() {
    const [users, setUsers] = useState([]);
    const [acceptMessage, setAcceptMessage] = useState("");
    const [deleteMessage, setdeletetMessage] = useState("");
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        firstName: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        lastName: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        email: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        role: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] }
    });

    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/users");
            if (!response.ok) {
                throw new Error("Failed to fetch user data");
            }
            const userData = await response.json();
            const acceptedUsers = userData.filter(user => user.accept === 0 );
            setUsers(acceptedUsers);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    const imageBodyTemplate = (rowData) => {
        return (
            <img src={`http://localhost:8080/uploads/${rowData.image}`} alt={rowData.firstName} style={{ width: '30px', height:'30px' }} />
        );
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
    
            setUsers((prevData) =>
                prevData.map((user) => (user._id === id ? { ...user, accept: 1 } : user))
            );
            const updatedUsers = users.filter(user => user._id !== id);
            setUsers(updatedUsers);
            setAcceptMessage("User accepted successfully. Congratulations email sent!");
            setTimeout(() => setAcceptMessage(''), 2000);
    
        } catch (error) {
            console.error("Error updating user accept status:", error);
        }
    };

    const handleArchiveUser = async (rowData) => {
        try {
            const response = await fetch(`http://localhost:8080/api/users/${rowData._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ archived: true })
            });
    
            if (!response.ok) {
                throw new Error(`Failed to archive user with ID ${rowData._id}`);
            }
    
            setUsers(prevUsers => prevUsers.map(user => {
                if (user._id === rowData._id) {
                    return { ...user, archived: true };
                }
                return user;
            }));
            const updatedUsers = users.filter(user => user._id !==rowData._id);
            setUsers(updatedUsers);
            setdeletetMessage("User archived successfully");
            setTimeout(() => setdeletetMessage(''), 2000);
    
        } catch (error) {
            console.error("Error archiving User:", error);
        }
    };

    const onGlobalFilterChange = (event) => {
        const value = event.target.value;
        let _filters = { ...filters };
        _filters['global'].value = value;
        setFilters(_filters);
    };

    const renderHeader = () => {
        const value = filters['global'] ? filters['global'].value : '';
        return (
            <span className="p-input-icon-left custom-header">
                <i className="pi pi-search iconsearch" />
                <InputText className='inputsearch' type="search" value={value || ''} onChange={(e) => onGlobalFilterChange(e)} placeholder="Global Search" />
            </span>
        );
    };

    const renderActions = (rowData) => {
        return (
            <div>
                <button onClick={() => handleAccept(rowData._id)} className="p-button p-button-success p-button-rounded p-mr-2"><BiSolidUserCheck /></button>
                <button onClick={() => handleArchiveUser(rowData)} className="p-button p-button-danger p-button-rounded actionButton"><FaUserXmark /></button>
            </div>
        );
    };

    const header = renderHeader();

    return (
        <div>
            <div className="top">
                <h1>Add New User</h1>
                <Link to="/users/new" className="link1">
                    add new user <HiUserAdd />
                </Link>
            </div>
            <div className="card2">
                {acceptMessage && <div className="acceptMessage">{acceptMessage}</div>}
                {deleteMessage && <div className="deleteMessage">{deleteMessage}</div>}
                <DataTable value={users} paginator rows={4} header={header} filters={filters} onFilter={(e) => setFilters(e.filters)}
                    selection={selectedUser} onSelectionChange={(e) => setSelectedUser(e.value)} selectionMode="single" dataKey="_id"
                    stateStorage="session" stateKey="dt-state-demo-local" emptyMessage="No users found." tableStyle={{ minWidth: '40rem'}}>
                    <Column header="Image" body={imageBodyTemplate} style={{ width: '10%' }} ></Column>
                    <Column field="firstName" header="First Name" sortable filter filterPlaceholder="Search" style={{ width: '15%' }}></Column>
                    <Column field="lastName" header="Last Name" sortable filter filterPlaceholder="Search" style={{ width: '15%' }}></Column>
                    <Column field="email" header="Email" sortable filter filterPlaceholder="Search" style={{ width: '15%' }}></Column>
                    <Column field="role" header="Role" sortable filter filterPlaceholder="Search" style={{ width: '20%' }}></Column>
                    <Column header="Actions" body={renderActions} style={{ width: '20%' }}></Column>
                </DataTable>
            </div>
        </div>
    );
}
