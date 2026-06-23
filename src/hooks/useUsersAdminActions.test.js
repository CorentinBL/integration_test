import { renderHook, act } from "@testing-library/react";
import { useUsersAdminActions } from "./useUsersAdminActions";

// -------------------- MOCK API --------------------
import { deleteUser, getUserDetails } from "../utils/api";

jest.mock("../utils/api", () => ({
    deleteUser: jest.fn(),
    getUserDetails: jest.fn(),
}));

describe("Hook useUsersAdminActions", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // -------------------------
    it("initialise avec des états par défaut", () => {
        const { result } = renderHook(() => useUsersAdminActions());

        expect(result.current.actionLoading).toBe(false);
        expect(result.current.actionError).toBeNull();
    });

    // -------------------------
    it("supprime un utilisateur avec succès", async () => {
        deleteUser.mockResolvedValueOnce({});

        const { result } = renderHook(() => useUsersAdminActions());

        await act(async () => {
            await result.current.handleDelete(1, "fake-token");
        });

        expect(deleteUser).toHaveBeenCalledWith(1, "fake-token");
        expect(result.current.actionError).toBeNull();
    });

    // -------------------------
    it("gère une erreur lors de la suppression", async () => {
        deleteUser.mockRejectedValueOnce(new Error("Erreur suppression"));

        const { result } = renderHook(() => useUsersAdminActions());

        await act(async () => {
            try {
                await result.current.handleDelete(1, "fake-token");
            } catch (e) {
                // attendu
            }
        });

        expect(result.current.actionError).toBe("Erreur suppression");
    });

    // -------------------------
    it("récupère les détails d’un utilisateur", async () => {
        const mockUser = {
            id: 1,
            prenom: "Jean",
        };

        getUserDetails.mockResolvedValueOnce(mockUser);

        const { result } = renderHook(() => useUsersAdminActions());

        let data;

        await act(async () => {
            data = await result.current.handleGetDetails(1, "fake-token");
        });

        expect(getUserDetails).toHaveBeenCalledWith(1, "fake-token");
        expect(data).toEqual(mockUser);
    });

    // -------------------------
    it("gère une erreur lors de la récupération des détails", async () => {
        getUserDetails.mockRejectedValueOnce(new Error("Erreur details"));

        const { result } = renderHook(() => useUsersAdminActions());

        await act(async () => {
            try {
                await result.current.handleGetDetails(1, "fake-token");
            } catch (e) {
                // attendu
            }
        });

        expect(result.current.actionError).toBe("Erreur details");
    });

    // -------------------------
    it("active et désactive le loading pendant les actions", async () => {
        deleteUser.mockImplementation(
            () => new Promise((resolve) => setTimeout(resolve, 50))
        );

        const { result } = renderHook(() => useUsersAdminActions());

        let promise;

        act(() => {
            promise = result.current.handleDelete(1, "token");
        });

        expect(result.current.actionLoading).toBe(true);

        await act(async () => {
            await promise;
        });

        expect(result.current.actionLoading).toBe(false);
    });
});