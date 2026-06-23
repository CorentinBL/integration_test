import { useUsersList } from "../hooks/useUsersList";
import { useUsersAdminActions } from "../hooks/useUsersAdminActions";

const RegisteredList = ({ refresh = false, onUsersChanged, adminToken }) => {
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
            console.log("User details:", user);
            alert(JSON.stringify(user, null, 2));
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
                        <li key={user.id}>
                            <span>
                                {user.prenom} {user.nom}
                            </span>

                            {adminToken && (
                                <span style={{ marginLeft: "10px" }}>
                                    <button onClick={() => onDetails(user.id)}>
                                        Détails
                                    </button>

                                    <button onClick={() => onDelete(user.id)}>
                                        Supprimer
                                    </button>
                                </span>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
};

export default RegisteredList;