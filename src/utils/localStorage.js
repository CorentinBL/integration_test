const STORAGE_KEY = "registrations";

/**
 * Récupère la liste des inscrits depuis le localStorage.
 * @returns {Array<Object>}
 */
export function getRegistrations() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
}

/**
 * Sauvegarde un nouvel inscrit dans le localStorage.
 * @param {Object} user - L'utilisateur à sauvegarder.
 * @returns {Array<Object>} La liste mise à jour des inscrits.
 */
export function saveRegistration(user) {
    const registrations = getRegistrations();
    const updated = [...registrations, { ...user, id: Date.now() }];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
}

/**
 * Vide la liste des inscrits dans le localStorage.
 */
export function clearRegistrations() {
    localStorage.removeItem(STORAGE_KEY);
}