import { useState } from "react";
import FieldForm from "./FieldForm";
import { loginAdmin } from "../utils/api";

/**
 * Composant AdminLogin – formulaire de connexion administrateur.
 * Réutilise FieldForm pour la cohérence visuelle avec le reste de l'app.
 * @param {Object}   props
 * @param {Function} props.onLogin - Appelé avec le token en cas de succès.
 */
const AdminLogin = ({ onLogin }) => {
    const [fields,  setFields]  = useState({ "admin-email": "", "admin-password": "" });
    const [errors,  setErrors]  = useState({});
    const [apiError, setApiError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (id, value) => {
        setFields((prev) => ({ ...prev, [id]: value }));
        setErrors((prev)  => ({ ...prev, [id]: null }));
    };

    const handleBlur = (id) => {
        if (!fields[id]) {
            setErrors((prev) => ({ ...prev, [id]: "Ce champ est requis" }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError(null);
        setLoading(true);
        try {
            const { token } = await loginAdmin(fields["admin-email"], fields["admin-password"]);
            onLogin(token);
        } catch {
            setApiError("Identifiants invalides");
        } finally {
            setLoading(false);
        }
    };

    const isFormFilled = fields["admin-email"] && fields["admin-password"];

    return (
        <form
            className="admin-login-form"
            onSubmit={handleSubmit}
            noValidate
            data-testid="admin-login-form"
        >
            <h3 className="admin-login-title">Connexion administrateur</h3>

            {apiError && (
                <p className="admin-error" role="alert" data-testid="admin-error">
                    {apiError}
                </p>
            )}

            <FieldForm
                id="admin-email"
                label="Email"
                type="email"
                value={fields["admin-email"]}
                error={errors["admin-email"]}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="admin@exemple.fr"
            />
            <FieldForm
                id="admin-password"
                label="Mot de passe"
                type="password"
                value={fields["admin-password"]}
                error={errors["admin-password"]}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="••••••••"
            />

            <button
                type="submit"
                className="btn-submit"
                disabled={loading || !isFormFilled}
                data-testid="admin-submit"
            >
                {loading ? "Connexion…" : "Se connecter"}
            </button>
        </form>
    );
};

export default AdminLogin;