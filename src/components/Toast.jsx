/**
 * Composant Toast – affiche une notification de succès.
 * @param {Object} props
 * @param {boolean} props.visible - Si true, le toast est affiché.
 * @param {string} [props.message] - Message à afficher.
 */
const Toast = ({ visible, message = "Inscription enregistrée avec succès !" }) => {
    if (!visible) return null;

    return (
        <div className="toast toast--success" role="status" aria-live="polite">
            <span className="toast-icon">✓</span>
            <span className="toast-message">{message}</span>
        </div>
    );
};

export default Toast;