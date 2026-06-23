const UsersDetailsModal = ({ user, onClose }) => {
    if (!user) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
            >
                <h2>Détails utilisateur</h2>

                <p><strong>Prénom :</strong> {user.prenom}</p>
                <p><strong>Nom :</strong> {user.nom}</p>
                <p><strong>Email :</strong> {user.email}</p>
                <p><strong>Date naissance :</strong> {user.date_naissance}</p>
                <p><strong>Ville :</strong> {user.ville}</p>
                <p><strong>Code postal :</strong> {user.code_postal}</p>

                <button onClick={onClose}>
                    Fermer
                </button>
            </div>
        </div>
    );
};

export default UsersDetailsModal;