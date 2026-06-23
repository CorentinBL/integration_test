import AdminLogin from "./AdminLogin";

const AdminSection = ({ admin }) => {
    return (
        <div className="admin-area">
            {admin.token ? (
                <div data-testid="admin-panel" className="admin-panel">
                    <span className="admin-badge">Admin connecté</span>
                    <button
                        className="btn-admin-logout"
                        onClick={admin.logout}
                        data-testid="admin-logout-btn"
                    >
                        Déconnexion
                    </button>
                </div>
            ) : (
                <>
                    <button
                        className="btn-admin-login"
                        onClick={admin.toggleLogin}
                        data-testid="admin-login-btn"
                    >
                        {admin.showLogin ? "Retour" : "Espace admin"}
                    </button>

                    {admin.showLogin && (
                        <AdminLogin onLogin={admin.login} />
                    )}
                </>
            )}
        </div>
    );
};

export default AdminSection;