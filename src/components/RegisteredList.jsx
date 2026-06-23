import { useUsersList } from "../hooks/useUsersList";
import { useUsersAdminActions } from "../hooks/useUsersAdminActions";
import UsersDetailsModal from "./UsersDetailsModal";
import {useState} from "react";

const RegisteredList = ({ refresh = false, onUsersChanged, adminToken }) => {
    const [selectedUser, setSelectedUser] = useState(null);
    const { users, loading, error } = useUsersList(refresh);
    const { handleDelete, handleGetDetails } = useUsersAdminActions();

    const onDelete = async (id) => {
        try {
            await handleDelete(id, adminToken);
            onUsersChanged?.();
        } catch (err) {
            console.error(err);
        }
    };

    const onDetails = async (id) => {
        try {
            const user = await handleGetDetails(id, adminToken);
            setSelectedUser(user);
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) {
        return (
            <div className="registered-list registered-list--loading">
                Chargement des inscrits…
            </div>
        );
    }

    if (error) {
        return (
            <div className="registered-list registered-list--error">
                Impossible de charger la liste : {error}
            </div>
        );
    }

    return (
        <section className="registered-list">
            <h2>Inscrits ({users.length})</h2>

            {users.length === 0 ? (
                <p>Aucun inscrit pour le moment.</p>
            ) : (
                <ul>
                    {users.map((user) => (
                        <li
                            data-testid={`registered-item-${user.id}`}
                            key={user.id}>
                            <span>
                                {user.prenom} {user.nom}
                            </span>

                            {adminToken && (
                                <span style={{ marginLeft: "10px" }}>
                                    <button
                                        data-testid={`details-btn-${user.id}`}
                                        onClick={() => onDetails(user.id)}>
                                        Détails
                                    </button>

                                    <button
                                        data-testid={`delete-btn-${user.id}`}
                                        onClick={() => onDelete(user.id)}>
                                        Supprimer
                                    </button>
                                </span>
                            )}
                        </li>
                    ))}
                </ul>
            )}
            {selectedUser && (
                <UsersDetailsModal
                    user={selectedUser}
                    onClose={() => setSelectedUser(null)}
                />
            )}
        </section>
    );
};

export default RegisteredList;