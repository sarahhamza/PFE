// src/components/UserList.jsx
import React, { useState } from 'react';
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
import { useFetchUsers, useHandleAcceptUser, useHandleArchiveUser } from '../../Hooks/UserHook';
import { BASE_URL } from '../../config';

export default function UserList() {
    const [users, setUsers, fetchUsers] = useFetchUsers();
    const [acceptMessage, handleAcceptUser] = useHandleAcceptUser();
    const [deleteMessage, handleArchiveUser] = useHandleArchiveUser();

    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        firstName: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        lastName: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        email: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        role: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] }
    });

    const [selectedUser, setSelectedUser] = useState(null);

    const imageBodyTemplate = (rowData) => {
        return (
            <img src={`${BASE_URL}/uploads/${rowData.image}`} alt={rowData.firstName} style={{ width: '30px', height: '30px' }} />
        );
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
                <button onClick={() => handleAcceptUser(rowData._id, users, setUsers)} className="actionButton1"><BiSolidUserCheck className='centericon1' /></button>
                <button onClick={() => handleArchiveUser(rowData, users, setUsers)} className="actionButton"><FaUserXmark className='centericon2' /></button>
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
                    stateStorage="session" stateKey="dt-state-demo-local" emptyMessage="No users found." tableStyle={{ minWidth: '40rem' }}>
                    <Column header="Image" body={imageBodyTemplate} style={{ width: '10%' }}></Column>
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
