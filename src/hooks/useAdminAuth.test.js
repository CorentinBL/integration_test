import { renderHook, act } from "@testing-library/react";
import { useAdminAuth } from "./useAdminAuth";

describe("Hook useAdminAuth", () => {

    // -------------------------
    it("initialise avec un token null et showLogin à false", () => {
        const { result } = renderHook(() => useAdminAuth());

        expect(result.current.token).toBeNull();
        expect(result.current.showLogin).toBe(false);
    });

    // -------------------------
    it("connecte l’administrateur et masque le formulaire de login", () => {
        const { result } = renderHook(() => useAdminAuth());

        act(() => {
            result.current.login("fake-token");
        });

        expect(result.current.token).toBe("fake-token");
        expect(result.current.showLogin).toBe(false);
    });

    // -------------------------
    it("déconnecte l’administrateur (suppression du token)", () => {
        const { result } = renderHook(() => useAdminAuth());

        act(() => {
            result.current.login("fake-token");
        });

        act(() => {
            result.current.logout();
        });

        expect(result.current.token).toBeNull();
    });

    // -------------------------
    it("alterne l’état du formulaire de login (showLogin)", () => {
        const { result } = renderHook(() => useAdminAuth());

        expect(result.current.showLogin).toBe(false);

        act(() => {
            result.current.toggleLogin();
        });

        expect(result.current.showLogin).toBe(true);

        act(() => {
            result.current.toggleLogin();
        });

        expect(result.current.showLogin).toBe(false);
    });
});