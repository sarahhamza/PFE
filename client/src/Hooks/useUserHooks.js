import { useState, useEffect } from 'react';

export function useFetchUsers() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/users");
                if (!response.ok) {
                    throw new Error("Failed to fetch user data");
                }
                const userData = await response.json();
                const acceptedUsers = userData.filter(user => user.accept === 0);
                setUsers(acceptedUsers);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };
        fetchUsers();
    }, []);

    return users;
}

export function useAcceptUser() {
    const [acceptMessage, setAcceptMessage] = useState("");

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

            setAcceptMessage("User accepted successfully. Congratulations email sent!");
            setTimeout(() => setAcceptMessage(''), 2000);
        } catch (error) {
            console.error("Error updating user accept status:", error);
        }
    };

    return [acceptMessage, handleAccept];
}

export function useArchiveUser() {
    const [deleteMessage, setDeleteMessage] = useState("");

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

            setDeleteMessage("User archived successfully");
            setTimeout(() => setDeleteMessage(''), 2000);
        } catch (error) {
            console.error("Error archiving User:", error);
        }
    };

    return [deleteMessage, handleArchiveUser];
}
