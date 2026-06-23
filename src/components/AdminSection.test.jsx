import { render, screen, fireEvent } from "@testing-library/react";
import AdminSection from "./AdminSection";

jest.mock("./AdminLogin", () => () => (
    <div data-testid="admin-login-mock">AdminLogin</div>
));

describe("AdminSection", () => {
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

    it("renders login button when admin is not logged in", () => {
        render(<AdminSection admin={mockAdmin} />);

        expect(screen.getByTestId("admin-login-btn")).toBeInTheDocument();
        expect(screen.getByText("Espace admin")).toBeInTheDocument();
    });

    it("calls toggleLogin when login button is clicked", () => {
        render(<AdminSection admin={mockAdmin} />);

        fireEvent.click(screen.getByTestId("admin-login-btn"));

        expect(mockAdmin.toggleLogin).toHaveBeenCalled();
    });

    it("shows AdminLogin when showLogin is true", () => {
        render(
            <AdminSection
                admin={{ ...mockAdmin, showLogin: true }}
            />
        );

        expect(screen.getByTestId("admin-login-mock")).toBeInTheDocument();
    });

    it("shows admin panel when token exists", () => {
        render(
            <AdminSection
                admin={{ ...mockAdmin, token: "fake-token" }}
            />
        );

        expect(screen.getByTestId("admin-panel")).toBeInTheDocument();
        expect(screen.getByText("Admin connecté")).toBeInTheDocument();
    });

    it("calls logout when logout button is clicked", () => {
        render(
            <AdminSection
                admin={{ ...mockAdmin, token: "fake-token" }}
            />
        );

        fireEvent.click(screen.getByTestId("admin-logout-btn"));

        expect(mockAdmin.logout).toHaveBeenCalled();
    });

    it("shows correct button text depending on showLogin state", () => {
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