jest.mock("axios", () => {
    const mockGet = jest.fn();
    const mockPost = jest.fn();
    const mockDelete = jest.fn();

    return {
        create: jest.fn(() => ({
            get: mockGet,
            post: mockPost,
            delete: mockDelete,
        })),
    };
});

import axios from "axios";
import {
    getAllUsers,
    countUsers,
    createUser,
    loginAdmin,
    deleteUser,
    getUserDetails,
} from "./api";

const mockInstance = axios.create();

beforeEach(() => {
    jest.clearAllMocks();
});

describe("getAllUsers", () => {
    it("retourne la liste des utilisateurs", async () => {
        const utilisateurs = [
            { id: 1, prenom: "Alice", nom: "Martin" },
            { id: 2, prenom: "Bob", nom: "Dupont" },
        ];
        mockInstance.get.mockResolvedValueOnce({ data: { utilisateurs } });

        const result = await getAllUsers();

        expect(mockInstance.get).toHaveBeenCalledWith("/users");
        expect(result).toEqual(utilisateurs);
    });

    it("retourne un tableau vide si aucun utilisateur", async () => {
        mockInstance.get.mockResolvedValueOnce({ data: { utilisateurs: [] } });

        const result = await getAllUsers();

        expect(result).toEqual([]);
    });

    it("propage l'erreur si la requête échoue", async () => {
        mockInstance.get.mockRejectedValueOnce(new Error("Network Error"));

        await expect(getAllUsers()).rejects.toThrow("Network Error");
    });
});


describe("countUsers", () => {
    it("retourne le nombre d'utilisateurs", async () => {
        mockInstance.get.mockResolvedValueOnce({
            data: {
                utilisateurs: [
                    { id: 1, prenom: "Alice", nom: "Martin" },
                    { id: 2, prenom: "Bob", nom: "Dupont" },
                ],
            },
        });

        const result = await countUsers();

        expect(result).toBe(2);
    });

    it("retourne 0 si aucun utilisateur", async () => {
        mockInstance.get.mockResolvedValueOnce({ data: { utilisateurs: [] } });

        const result = await countUsers();

        expect(result).toBe(0);
    });

    it("propage l'erreur si la requête échoue", async () => {
        mockInstance.get.mockRejectedValueOnce(new Error("Network Error"));

        await expect(countUsers()).rejects.toThrow("Network Error");
    });
});


describe("createUser", () => {
    const fields = {
        firstName: "Jean",
        lastName: "Dupont",
        email: "jean@test.fr",
        birthDate: "1990-01-01",
        city: "Paris",
        postalCode: "75001",
    };

    it("envoie les bons champs et retourne la réponse", async () => {
        const responseData = { message: "User created successfully", status: "201 Created" };
        mockInstance.post.mockResolvedValueOnce({ data: responseData });

        const result = await createUser(fields);

        expect(mockInstance.post).toHaveBeenCalledWith("/users", {
            prenom: "Jean",
            nom: "Dupont",
            email: "jean@test.fr",
            date_naissance: "1990-01-01",
            ville: "Paris",
            code_postal: "75001",
        });
        expect(result).toEqual(responseData);
    });

    it("propage l'erreur si la requête échoue", async () => {
        mockInstance.post.mockRejectedValueOnce(new Error("Database error"));

        await expect(createUser(fields)).rejects.toThrow("Database error");
    });
});


describe("loginAdmin", () => {
    it("retourne le token en cas de succès", async () => {
        mockInstance.post.mockResolvedValueOnce({ data: { token: "fake-token" } });

        const result = await loginAdmin("admin@test.com", "password");

        expect(mockInstance.post).toHaveBeenCalledWith("/admin/login", {
            email: "admin@test.com",
            password: "password",
        });
        expect(result).toEqual({ token: "fake-token" });
    });

    it("propage l'erreur si les identifiants sont invalides", async () => {
        mockInstance.post.mockRejectedValueOnce(new Error("Request failed with status code 401"));

        await expect(loginAdmin("bad@test.com", "wrong")).rejects.toThrow("401");
    });
});


describe("deleteUser", () => {
    it("envoie la requête DELETE avec le bon token", async () => {
        mockInstance.delete.mockResolvedValueOnce({ data: { message: "User 1 deleted" } });

        const result = await deleteUser(1, "fake-token");

        expect(mockInstance.delete).toHaveBeenCalledWith("/users/1", {
            headers: { Authorization: "Bearer fake-token" },
        });
        expect(result).toEqual({ message: "User 1 deleted" });
    });

    it("propage l'erreur si le token est invalide (401)", async () => {
        mockInstance.delete.mockRejectedValueOnce(new Error("Request failed with status code 401"));

        await expect(deleteUser(1, "invalid-token")).rejects.toThrow("401");
    });

    it("propage l'erreur si l'utilisateur n'existe pas (404)", async () => {
        mockInstance.delete.mockRejectedValueOnce(new Error("Request failed with status code 404"));

        await expect(deleteUser(999, "fake-token")).rejects.toThrow("404");
    });
});

describe("getUserDetails", () => {
    it("retourne les détails d'un utilisateur", async () => {
        const user = {
            id: 1,
            prenom: "Alice",
            nom: "Martin",
            email: "alice@test.fr",
            date_naissance: "1990-05-15",
            ville: "Paris",
            code_postal: "75001",
        };
        mockInstance.get.mockResolvedValueOnce({ data: user });

        const result = await getUserDetails(1, "fake-token");

        expect(mockInstance.get).toHaveBeenCalledWith("/users/1", {
            headers: { Authorization: "Bearer fake-token" },
        });
        expect(result).toEqual(user);
    });

    it("propage l'erreur si le token est invalide (401)", async () => {
        mockInstance.get.mockRejectedValueOnce(new Error("Request failed with status code 401"));

        await expect(getUserDetails(1, "invalid-token")).rejects.toThrow("401");
    });

    it("propage l'erreur si l'utilisateur n'existe pas (404)", async () => {
        mockInstance.get.mockRejectedValueOnce(new Error("Request failed with status code 404"));

        await expect(getUserDetails(999, "fake-token")).rejects.toThrow("404");
    });
});