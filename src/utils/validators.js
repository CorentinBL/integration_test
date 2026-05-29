/**
 * Calcule l'âge en années à partir d'une date de naissance.
 * @param {string|Date} birthDate - La date de naissance.
 * @returns {number} L'âge en années entières.
 */
export function calculateAge(birthDate) {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
}

/**
 * Vérifie si une personne est majeure (≥ 18 ans).
 * @param {string|Date} birthDate - La date de naissance.
 * @returns {boolean} true si la personne a 18 ans ou plus.
 */
export function isAdult(birthDate) {
    if (!birthDate) return false;
    return calculateAge(birthDate) >= 18;
}

/**
 * Vérifie si un code postal est au format français (5 chiffres).
 * @param {string} postalCode - Le code postal à valider.
 * @returns {boolean} true si le format est valide.
 */
export function isValidPostalCode(postalCode) {
    return /^\d{5}$/.test(postalCode);
}

/**
 * Vérifie si un nom / prénom / ville est valide.
 * Accepte : lettres (avec accents, tréma, cédille), tirets, apostrophes, espaces.
 * Refuse : chiffres, caractères spéciaux non autorisés.
 * @param {string} value - La valeur à valider.
 * @returns {boolean} true si la valeur est valide.
 */
export function isValidName(value) {
    if (!value || value.trim().length === 0) return false;
    // Autorise lettres Unicode (accents inclus), tiret, apostrophe, espace
    return /^[^\d!@#$%^&*()_+=\[\]{};:"\\|,.<>\/?~`]+$/.test(value.trim());
}

/**
 * Vérifie si une adresse email est valide.
 * @param {string} email - L'email à valider.
 * @returns {boolean} true si l'email est valide.
 */
export function isValidEmail(email) {
    if (!email) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/**
 * Valide l'ensemble du formulaire d'inscription.
 * @param {Object} fields - Les champs du formulaire.
 * @param {string} fields.firstName - Le prénom.
 * @param {string} fields.lastName - Le nom.
 * @param {string} fields.email - L'email.
 * @param {string} fields.birthDate - La date de naissance (ISO string).
 * @param {string} fields.city - La ville.
 * @param {string} fields.postalCode - Le code postal.
 * @returns {{ isValid: boolean, errors: Object }} Résultat de validation avec erreurs par champ.
 */
export function validateForm(fields) {
    const errors = {};

    if (!isValidName(fields.firstName)) {
        errors.firstName =
            "Le prénom ne doit pas contenir de chiffres ou de caractères spéciaux.";
    }
    if (!isValidName(fields.lastName)) {
        errors.lastName =
            "Le nom ne doit pas contenir de chiffres ou de caractères spéciaux.";
    }
    if (!isValidEmail(fields.email)) {
        errors.email = "L'adresse email n'est pas valide.";
    }
    if (!fields.birthDate) {
        errors.birthDate = "La date de naissance est requise.";
    } else if (!isAdult(fields.birthDate)) {
        errors.birthDate = "Vous devez avoir au moins 18 ans pour vous inscrire.";
    }
    if (!isValidName(fields.city)) {
        errors.city =
            "La ville ne doit pas contenir de chiffres ou de caractères spéciaux.";
    }
    if (!isValidPostalCode(fields.postalCode)) {
        errors.postalCode = "Le code postal doit contenir exactement 5 chiffres.";
    }

    return { isValid: Object.keys(errors).length === 0, errors };
}