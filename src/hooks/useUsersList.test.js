import { renderHook, waitFor } from "@testing-library/react";
import { useUsersList } from "./useUsersList";
import { getAllUsers } from "../utils/api";

jest.mock("../utils/api", () => ({
    getAllUsers: jest.fn(),
}));

describe("Hook useUsersList", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // -------------------------
    it("initialise avec un état de chargement", async () => {
        getAllUsers.mockResolvedValueOnce([]);

        const { result } = renderHook(() => useUsersList(false));

        expect(result.current.loading).toBe(true);
    });

    // -------------------------
    it("charge correctement les utilisateurs", async () => {
        const mockUsers = [
            { id: 1, prenom: "Jean", nom: "Dupont" }
        ];

        getAllUsers.mockResolvedValueOnce(mockUsers);

        const { result } = renderHook(() => useUsersList(false));

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        await waitFor(() => {
            expect(result.current.users).toEqual(mockUsers);
        });

        expect(result.current.error).toBeNull();
    });

    // -------------------------
    it("gère une erreur lors du chargement", async () => {
        getAllUsers.mockRejectedValueOnce(new Error("Erreur API"));

        const { result } = renderHook(() => useUsersList(false));

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.error).toBe("Erreur API");
    });

    // -------------------------
    it("rafraîchit la liste lorsque la prop refresh change", async () => {
        const firstCall = [{ id: 1, prenom: "Jean", nom: "Dupont" }];
        const secondCall = [{ id: 2, prenom: "Marie", nom: "Martin" }];

        getAllUsers
            .mockResolvedValueOnce(firstCall)
            .mockResolvedValueOnce(secondCall);

        const { result, rerender } = renderHook(
            ({ refresh }) => useUsersList(refresh),
            { initialProps: { refresh: false } }
        );

        await waitFor(() => {
            expect(result.current.users).toEqual(firstCall);
        });

        rerender({ refresh: true });

        await waitFor(() => {
            expect(result.current.users).toEqual(secondCall);
        });
    });
});