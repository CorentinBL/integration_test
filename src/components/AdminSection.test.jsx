import { render, screen, fireEvent } from "@testing-library/react";
import AdminSection from "./AdminSection";

jest.mock("./AdminLogin", () => () => (
    <div data-testid="admin-login-mock">AdminLogin</div>
));

describe("Composant AdminSection", () => {
    const mockAdmin = {
        token: null,
        showLogin: false,
        login: jest.fn(),
        logout: jest.fn(),
        toggleLogin: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // -------------------------
    it("affiche le bouton de connexion lorsque l’administrateur n’est pas connecté", () => {
        render(<AdminSection admin={mockAdmin} />);

        expect(screen.getByTestId("admin-login-btn")).toBeInTheDocument();
        expect(screen.getByText("Espace admin")).toBeInTheDocument();
    });

    // -------------------------
    it("appelle toggleLogin lors du clic sur le bouton de connexion", () => {
        render(<AdminSection admin={mockAdmin} />);

        fireEvent.click(screen.getByTestId("admin-login-btn"));

        expect(mockAdmin.toggleLogin).toHaveBeenCalled();
    });

    // -------------------------
    it("affiche le formulaire AdminLogin lorsque showLogin est activé", () => {
        render(
            <AdminSection admin={{ ...mockAdmin, showLogin: true }} />
        );

        expect(screen.getByTestId("admin-login-mock")).toBeInTheDocument();
    });

    // -------------------------
    it("affiche le panneau admin lorsque le token est présent", () => {
        render(
            <AdminSection admin={{ ...mockAdmin, token: "fake-token" }} />
        );

        expect(screen.getByTestId("admin-panel")).toBeInTheDocument();
        expect(screen.getByText("Admin connecté")).toBeInTheDocument();
    });

    // -------------------------
    it("appelle logout lors du clic sur le bouton de déconnexion", () => {
        render(
            <AdminSection admin={{ ...mockAdmin, token: "fake-token" }} />
        );

        fireEvent.click(screen.getByTestId("admin-logout-btn"));

        expect(mockAdmin.logout).toHaveBeenCalled();
    });

    // -------------------------
    it("affiche le bon texte du bouton selon l’état showLogin", () => {
        const { rerender } = render(
            <AdminSection admin={{ ...mockAdmin, showLogin: false }} />
        );

        expect(screen.getByText("Espace admin")).toBeInTheDocument();

        rerender(
            <AdminSection admin={{ ...mockAdmin, showLogin: true }} />
        );

        expect(screen.getByText("Retour")).toBeInTheDocument();
    });
});