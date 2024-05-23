import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
//import { HiUserAdd } from "react-icons/hi";
import 'primeflex/primeflex.css';
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primeicons/primeicons.css';
import "./housemaidList.scss";
import "./flags.scss";

export default function HousemaidList() {
  const [users, setUsers] = useState([]);
  //const [data, setData] = useState([]);
  const [editMessage, seteditMessage] = useState("");
  // const [acceptMessage, setAcceptMessage] = useState(""); // Ajout de la variable d'état pour le message d'acceptation
  // const [deleteMessage, setdeletetMessage] = useState(""); // Ajout de la variable d'état pour le message d'acceptation
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    firstName: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    lastName: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    email: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
    role: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] }
  });

  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchHousemaids();
  }, []);

  const fetchHousemaids = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/users");
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      const userData = await response.json();
      // Filtrer les utilisateurs avec accept === 1
      const acceptedUsers = userData.filter(user => user.accept === 1 && user.role === "femme de menage");
      setUsers(acceptedUsers);
      //setUsers(userData);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  const imageBodyTemplate = (rowData) => {
    return (
      <img src={`http://localhost:8080/uploads/${rowData.image}`} alt={rowData.firstName} style={{ width: '30px', height: '30px' }} />
    );
  };

  const handleImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Send file to the server for processing
      const response = await fetch('http://localhost:8080/api/users/import', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to import data');
      }

      // Refresh room data after importing
      fetchHousemaids();
      seteditMessage("Data imported successfully");
      setTimeout(() => seteditMessage(''), 2000);
    } catch (error) {
      console.error("Error importing data:", error);
      // Handle error
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
        <Link to={{
        pathname: `/users/update/${rowData._id}`,
        state: { imageUrl: `http://localhost:8080/uploads/${rowData.image}` }
        }} className="p-button p-button-info p-button-rounded p-ml-2">
        Update
        </Link>

        <Link to={`/user/${rowData._id}`} className="p-button p-button-success p-button-rounded p-ml-2">
          View
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
          style={{ display: 'none' }} // Hide the input visually
          onChange={handleImport}
        />
        <Button
          type="button"
          icon="pi pi-upload"
          label="Export"
          className="p-button-help p-button-help1"
          onClick={() => document.getElementById('fileInput').click()}
          data-pr-tooltip="Export Excel Data"

        />
      </div>
      {editMessage && <div className="editMessage">{editMessage}</div>}

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
