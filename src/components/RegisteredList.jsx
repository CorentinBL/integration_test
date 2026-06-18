// src/components/RegisteredList.jsx
import { useEffect, useState } from "react";
import { getAllUsers } from "../utils/api";

/**
 * Composant RegisteredList
 *
 * Affiche le nombre total d'inscrits et la liste de leurs prénoms / noms.
 * Les données sont chargées depuis le backend (GET /users).
 *
 * @param {Object}  props
 * @param {boolean} [props.refresh=false] - Passer `true` pour forcer un rechargement
 *                                          (utile après une soumission de formulaire).
 */
const RegisteredList = ({ refresh = false }) => {
    const [users,     setUsers]     = useState([]);
    const [loading,   setLoading]   = useState(true);
    const [error,     setError]     = useState(null);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError(null);

        getAllUsers()
            .then((data) => { if (!cancelled) setUsers(data); })
            .catch((err) => { if (!cancelled) setError(err.message); })
            .finally(() => { if (!cancelled) setLoading(false); });

        return () => { cancelled = true; };
    }, [refresh]);   // se relance quand `refresh` change

    if (loading) {
        return (
            <div className="registered-list registered-list--loading" aria-live="polite">
                Chargement des inscrits…
            </div>
        );
    }

    if (error) {
        return (
            <div className="registered-list registered-list--error" role="alert">
                Impossible de charger la liste : {error}
            </div>
        );
    }

    return (
        <section
            className="registered-list"
            aria-label="Liste des inscrits"
            data-testid="registered-list"
        >
            <h2 className="registered-list__title">
                Inscrits{" "}
                <span className="registered-list__count" data-testid="registered-count">
                    ({users.length})
                </span>
            </h2>

            {users.length === 0 ? (
                <p className="registered-list__empty">Aucun inscrit pour le moment.</p>
            ) : (
                <ul className="registered-list__items">
                    {users.map((user) => (
                        <li
                            key={user.id}
                            className="registered-list__item"
                            data-testid="registered-item"
                        >
                            <span className="registered-list__name">
                                {user.prenom} {user.nom}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
};

export default RegisteredList;