import axios from "axios";

const BASE_URL = process.env.REACT_APP_SERVER_URL || "http://localhost:8000";

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});


/**
 * Récupère tous les utilisateurs
 */
export async function getAllUsers() {
    const res = await api.get("/users");
    return res.data.utilisateurs;
}

/**
 * Compte le nombre d'utilisateurs
 */
export async function countUsers() {
    const res = await api.get("/users");
    return res.data.utilisateurs.length;
}

/**
 * Crée un utilisateur
 */
export async function createUser(fields) {
    const res = await api.post("/users", {
        prenom: fields.firstName,
        nom: fields.lastName,
        email: fields.email,
        date_naissance: fields.birthDate,
        ville: fields.city,
        code_postal: fields.postalCode,
    });

    return res.data;
}

/**
 * Login admin
 */
export async function loginAdmin(email, password) {
    const res = await api.post("/admin/login", {
        email,
        password,
    });

    return res.data;
}

/**
 * Supprimer un utilisateur (admin only)
 */
export async function deleteUser(userId, token) {
    const res = await api.delete(`/users/${userId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return res.data;
}

/**
 * Récupérer les détails d'un utilisateur (admin only)
 */
export async function getUserDetails(userId, token) {
    const res = await api.get(`/users/${userId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return res.data;
}