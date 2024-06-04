import { useState, useEffect } from 'react';
import { BASE_URL } from '../config';

export function useFetchHousemaids() {
    const [users, setUsers] = useState([]);

    const fetchHousemaids = async () => {
        try {
            const response = await fetch(`${BASE_URL}/api/users`);
            if (!response.ok) {
                throw new Error("Failed to fetch user data");
            }
            const userData = await response.json();
            const acceptedUsers = userData.filter(user => user.accept === 1 && user.role === "femme de menage");
            setUsers(acceptedUsers);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    useEffect(() => {
        fetchHousemaids();
    }, []);

    return [users, fetchHousemaids];
}

export function useAcceptHousemaid() {
    const [acceptMessage, setAcceptMessage] = useState("");

    const handleAcceptHousemaid = async (id) => {
        try {
            const response = await fetch(`${BASE_URL}/api/users/${id}/accept`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ accept: 1 })
            });

            if (!response.ok) {
                throw new Error("Failed to update user accept status");
            }

            setAcceptMessage("User accepted successfully. Congratulations email sent!");
            setTimeout(() => setAcceptMessage(''), 2000);
        } catch (error) {
            console.error("Error updating user accept status:", error);
        }
    };

    return [acceptMessage, handleAcceptHousemaid];
}

export function useArchiveHousemaid() {
    const [deleteMessage, setDeleteMessage] = useState("");

    const handleArchiveHousemaid = async (rowData) => {
        try {
            const response = await fetch(`${BASE_URL}/api/users/${rowData._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ archived: true })
            });

            if (!response.ok) {
                throw new Error(`Failed to archive user with ID ${rowData._id}`);
            }

            setDeleteMessage("User archived successfully");
            setTimeout(() => setDeleteMessage(''), 2000);
        } catch (error) {
            console.error("Error archiving User:", error);
        }
    };

    return [deleteMessage, handleArchiveHousemaid];
}

export function useImportHousemaids(fetchHousemaids) {
    const [importMessage, setImportMessage] = useState("");

    const handleImportHousemaid = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            const formData = new FormData();
            formData.append('file', file);

            console.log('FormData:', formData);

            const response = await fetch(`${BASE_URL}/api/users/import`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response text:', errorText);
                throw new Error('Failed to import data');
            }
            fetchHousemaids();
            setImportMessage("Data imported successfully");
            setTimeout(() => setImportMessage(''), 2000);
        } catch (error) {
            console.error("Error importing data:", error);
            setImportMessage("Error importing data");
            setTimeout(() => setImportMessage(''), 2000);
        }
    };

    return [importMessage, handleImportHousemaid];
}

//controller

export function useFetchControllers() {
    const [users, setUsers] = useState([]);

    const fetchControllers = async () => {
        try {
            const response = await fetch(`${BASE_URL}/api/users`);
            if (!response.ok) {
                throw new Error("Failed to fetch user data");
            }
            const userData = await response.json();
            const acceptedUsers = userData.filter(user => user.accept === 1 && user.role === "controlleur");
            setUsers(acceptedUsers);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    useEffect(() => {
        fetchControllers();
    }, []);

    return [users, fetchControllers];
}

export function useImportControllers(fetchControllers) {
    const [importMessage, setImportMessage] = useState("");

    const handleImportControllers = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch(`${BASE_URL}/api/users/import`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response text:', errorText);
                throw new Error('Failed to import data');
            }

            await fetchControllers(); // Ensure the state is updated with the latest data
            setImportMessage("Data imported successfully");
            setTimeout(() => setImportMessage(''), 2000);
        } catch (error) {
            console.error("Error importing data:", error);
            setImportMessage("Error importing data");
            setTimeout(() => setImportMessage(''), 2000);
        }
    };

    return [importMessage, handleImportControllers];
}

export function useArchiveController(fetchControllers) {
    const [deleteMessage, setDeleteMessage] = useState("");

    const handleArchiveController = async (userId) => {
        try {
            const response = await fetch(`${BASE_URL}/api/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ archived: true })
            });

            if (!response.ok) {
                throw new Error(`Failed to archive user with ID ${userId}`);
            }

            await fetchControllers(); // Refresh the list after archiving
            setDeleteMessage("User archived successfully");
            setTimeout(() => setDeleteMessage(''), 2000);
        } catch (error) {
            console.error("Error archiving user:", error);
        }
    };

    return [deleteMessage, handleArchiveController];
}