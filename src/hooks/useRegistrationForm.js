import { useState } from "react";
import { validateForm } from "../utils/validators";
import { createUser } from "../utils/api";
import { saveRegistration } from "../utils/localStorage";

const INITIAL_FIELDS = {
    firstName: "",
    lastName: "",
    email: "",
    birthDate: "",
    city: "",
    postalCode: "",
};

/**
 * Hook qui gère l'état, la validation et la soumission du formulaire d'inscription.
 * @returns {Object} État et gestionnaires du formulaire.
 */
export function useRegistrationForm() {
    const [fields, setFields] = useState(INITIAL_FIELDS);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [toastVisible, setToastVisible] = useState(false);
    const [isLoading,    setIsLoading]    = useState(false);
    const [apiError,     setApiError]     = useState(null);

    /** Détermine si tous les champs sont remplis (pour activer le bouton). */
    const isFormFilled = Object.values(fields).every((v) => v.trim() !== "");

    /**
     * Met à jour un champ et rejoue la validation sur ce champ si déjà touché.
     * @param {string} name - Le nom du champ.
     * @param {string} value - La nouvelle valeur.
     */
    const handleChange = (name, value) => {
        const updatedFields = { ...fields, [name]: value };
        setFields(updatedFields);
        if (touched[name]) {
            const { errors: newErrors } = validateForm(updatedFields);
            setErrors((prev) => ({ ...prev, [name]: newErrors[name] }));
        }
    };

    /**
     * Marque un champ comme touché et valide à la perte de focus.
     * @param {string} name - Le nom du champ.
     */
    const handleBlur = (name) => {
        setTouched((prev) => ({ ...prev, [name]: true }));
        const { errors: newErrors } = validateForm(fields);
        setErrors((prev) => ({ ...prev, [name]: newErrors[name] }));
    };

    /**
     * Soumet le formulaire : valide, sauvegarde, affiche le toast et réinitialise.
     * @param {Event} e - L'événement de soumission.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        const { isValid, errors: validationErrors } = validateForm(fields);

        const allTouched = Object.keys(INITIAL_FIELDS).reduce(
            (acc, k) => ({ ...acc, [k]: true }),
            {}
        );
        setTouched(allTouched);

        if (!isValid) {
            setErrors(validationErrors);
            return;
        }

        setIsLoading(true);
        setApiError(null);

        try {
            await createUser(fields);
            setFields(INITIAL_FIELDS);
            setErrors({});
            setTouched({});
            setToastVisible(true);
            setTimeout(() => setToastVisible(false), 3000);
        } catch (err) {
            setApiError(err.message || "Erreur lors de l'enregistrement");
        } finally {
            setIsLoading(false);
        }
    };

    return {
        fields,
        errors,
        touched,
        toastVisible,
        isFormFilled,
        isLoading,
        apiError,
        handleChange,
        handleBlur,
        handleSubmit,
    };
}