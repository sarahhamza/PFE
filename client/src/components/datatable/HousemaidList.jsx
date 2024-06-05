import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { BASE_URL } from '../../config';
import { useFetchHousemaids, useAcceptHousemaid, useArchiveHousemaid, useImportHousemaids } from '../../Hooks/UserHook';

import 'primeflex/primeflex.css';
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primeicons/primeicons.css';
import "./housemaidList.scss";
import "./flags.scss";

export default function HousemaidList() {
  const [users, fetchUsers] = useFetchHousemaids();
  const [editMessage, seteditMessage] = useState("");
  const [acceptMessage] = useAcceptHousemaid();
  const [importMessage, handleImport] = useImportHousemaids(fetchUsers);
  const [deleteMessage, handleArchiveHousemaid] = useArchiveHousemaid(fetchUsers);

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

  const handleDelete = async (userId) => {
    if (!userId) {
      console.error("Attempted to delete user with undefined ID");
      return; // Or show an error message to the user
    }
    try {
      await handleArchiveHousemaid(userId);
    } catch (error) {
      console.error(`Failed to delete user with ID ${userId}:`, error);
    }
  };

  const renderActions = (rowData) => {
    return (
      <div>
        <button onClick={() => handleDelete(rowData._id)} className="p-button p-button-success p-ml-2">Delete</button>
        <Link to={`/user/${rowData._id}`} className="p-button p-button-info p-ml-2">
          <p className='paragraph'>View</p>
        </Link>
      </div>
    );
  };

  const header = renderHeader();

  return (
    <div>
      <div className="top">
        <h1>Housemaid List</h1>
        <input
          type="file"
          id="fileInput"
          style={{ display: 'none' }}
          onChange={handleImport}
        />
        <Button
          type="button"
          icon="pi pi-upload"
          label="Import"
          className=" p-button-help1"
          onClick={() => document.getElementById('fileInput').click()}
          data-pr-tooltip="Export Excel Data"
        />
      </div>
      {importMessage && <div className="acceptMessage">{importMessage}</div>}
      {editMessage && <div className="editMessage">{editMessage}</div>}
      {acceptMessage && <div className="acceptMessage">{acceptMessage}</div>}
      {deleteMessage && <div className="deleteMessage">{deleteMessage}</div>}
      <div className="card2">
        <DataTable value={users} paginator rows={4} header={header} filters={filters} onFilter={(e) => setFilters(e.filters)}
          selection={selectedUser} onSelectionChange={(e) => setSelectedUser(e.value)} selectionMode="single" dataKey="_id"
          stateStorage="session" stateKey="dt-state-demo-local" emptyMessage="No users found." tableStyle={{ minWidth: '40rem' }}>
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
