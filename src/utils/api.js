import axios from 'axios';

const BASE_URL = process.env.REACT_APP_SERVER_URL || "http://localhost:8000";


/**
 * Récupère la liste complète des utilisateurs (infos réduites : id, prénom, nom).
 * @returns {Promise<Array<{id: number, prenom: string, nom: string}>>}
 */
export async function getAllUsers() {
    try {
        const response = await axios.get(`${BASE_URL}/users`);
        return response.data.utilisateurs;
    } catch (error) {
        //console.error(error);
        throw error;
    }
}

/**
 * Enregistre un nouvel utilisateur en base.
 * @param {Object} fields - Les champs du formulaire (camelCase côté React).
 * @param {string} fields.firstName
 * @param {string} fields.lastName
 * @param {string} fields.email
 * @param {string} fields.birthDate   - format YYYY-MM-DD
 * @param {string} fields.city
 * @param {string} fields.postalCode
 * @param {string} fields.country
 * @returns {Promise<Object>} L'utilisateur créé.
 */

export async function countUsers() {
    try {
        const response = await axios.get(`${BASE_URL}/users`);
        return response.data.utilisateurs.length;
    }catch(error) {
        console.error(error);
        throw error;
    }
}
export async function createUser(fields) {
    try {
        const res = await axios.post(`${BASE_URL}/users`, {
                prenom: fields.firstName,
                nom: fields.lastName,
                email: fields.email,
                date_naissance: fields.birthDate,
                ville: fields.city,
                code_postal: fields.postalCode,
            },
            {
                headers: {"Content-Type": "application/json"},
            }
        );
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Admin
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Authentifie un administrateur.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{token: string}>} Token de session (stocké côté React en mémoire ou sessionStorage).
 */
export async function loginAdmin(email, password) {
    const res = await fetch(`${BASE_URL}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error("Identifiants invalides");
    return res.json(); // { token: "..." }
}

/**
 * Supprime un utilisateur (requiert le token admin dans l'en-tête Authorization).
 * @param {number} userId
 * @param {string} token
 * @returns {Promise<void>}
 */
export async function deleteUser(userId, token) {
    const res = await fetch(`${BASE_URL}/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Erreur lors de la suppression");
}

/**
 * Récupère les infos complètes (privées) d'un utilisateur (requiert token admin).
 * @param {number} userId
 * @param {string} token
 * @returns {Promise<Object>}
 */
export async function getUserDetails(userId, token) {
    const res = await fetch(`${BASE_URL}/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Accès refusé ou utilisateur introuvable");
    return res.json();
}