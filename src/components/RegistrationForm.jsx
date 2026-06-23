import FieldForm from "./FieldForm";
import Toast from "./Toast";
import { useRegistrationForm } from "../hooks/useRegistrationForm";


/** Date maximale autorisée : aujourd'hui moins 18 ans */
function getMaxBirthDate() {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 18);
    return d.toISOString().split("T")[0];
}

/**
 * Composant RegistrationForm – formulaire complet d'inscription.
 */
const RegistrationForm = ({onRegistered}) => {
    const {
        fields,
        errors,
        toastVisible,
        isFormFilled,
        apiError,
        handleChange,
        handleBlur,
        handleSubmit,
    } = useRegistrationForm(onRegistered);

    return (
        <div className="registration-form-wrapper">
            <Toast visible={toastVisible} />

            <form
                className="registration-form"
                onSubmit={handleSubmit}
                noValidate
                data-testid="registration-form"
            >
                <h2 className="form-title">Inscription</h2>

                <div className="form-row">
                    <FieldForm
                        id="firstName"
                        label="Prénom"
                        value={fields.firstName}
                        error={errors.firstName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Jean" min={undefined} max={undefined}
                    />
                    <FieldForm
                        id="lastName"
                        label="Nom"
                        value={fields.lastName}
                        error={errors.lastName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Dupont" min={undefined} max={undefined}
                    />
                </div>

                <FieldForm
                    id="email"
                    label="Adresse email"
                    type="email"
                    value={fields.email}
                    error={errors.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="jean.dupont@exemple.fr" min={undefined} max={undefined}
                />

                <FieldForm
                    id="birthDate"
                    label="Date de naissance"
                    type="date"
                    value={fields.birthDate}
                    error={errors.birthDate}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    max={getMaxBirthDate()} placeholder={undefined} min={undefined}
                />

                <div className="form-row">
                    <FieldForm
                        id="city"
                        label="Ville"
                        value={fields.city}
                        error={errors.city}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Paris" min={undefined} max={undefined}
                    />
                    <FieldForm
                        id="postalCode"
                        label="Code postal"
                        value={fields.postalCode}
                        error={errors.postalCode}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="75001" min={undefined} max={undefined}
                    />
                </div>

                <button
                    type="submit"
                    className="btn-submit"
                    disabled={!isFormFilled}
                    data-testid="submit-button"
                >
                    Sauvegarder
                </button>
                {apiError && (
                    <p data-testid="form-error" className="form-error">
                        {apiError}
                    </p>
                )}
            </form>
        </div>
    );
};

export default RegistrationForm;