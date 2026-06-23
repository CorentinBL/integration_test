import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AdminLogin from "./AdminLogin";
import { loginAdmin } from "../utils/api";

// mock API module
jest.mock("../utils/api", () => ({
    loginAdmin: jest.fn(),
}));

describe("AdminLogin", () => {
    const mockOnLogin = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders form correctly", () => {
        render(<AdminLogin onLogin={mockOnLogin} />);

        expect(screen.getByText("Connexion administrateur")).toBeInTheDocument();
        expect(screen.getByTestId("admin-login-form")).toBeInTheDocument();
        expect(screen.getByTestId("admin-submit")).toBeDisabled();
    });

    it("enables submit when fields are filled", () => {
        render(<AdminLogin onLogin={mockOnLogin} />);

        const email = screen.getByPlaceholderText("admin@exemple.fr");
        const password = screen.getByPlaceholderText("••••••••");

        fireEvent.change(email, {
            target: { value: "admin@test.com" },
        });

        fireEvent.change(password, {
            target: { value: "password123" },
        });

        expect(screen.getByTestId("admin-submit")).not.toBeDisabled();
    });

    it("calls loginAdmin and triggers onLogin on success", async () => {
        loginAdmin.mockResolvedValue({ token: "fake-token" });

        render(<AdminLogin onLogin={mockOnLogin} />);

        fireEvent.change(screen.getByPlaceholderText("admin@exemple.fr"), {
            target: { value: "admin@test.com" },
        });

        fireEvent.change(screen.getByPlaceholderText("••••••••"), {
            target: { value: "password123" },
        });

        fireEvent.click(screen.getByTestId("admin-submit"));

        await waitFor(() => {
            expect(loginAdmin).toHaveBeenCalledWith(
                "admin@test.com",
                "password123"
            );
            expect(mockOnLogin).toHaveBeenCalledWith("fake-token");
        });
    });

    it("shows error message on login failure", async () => {
        loginAdmin.mockRejectedValue(new Error("Invalid credentials"));

        render(<AdminLogin onLogin={mockOnLogin} />);

        fireEvent.change(screen.getByPlaceholderText("admin@exemple.fr"), {
            target: { value: "admin@test.com" },
        });

        fireEvent.change(screen.getByPlaceholderText("••••••••"), {
            target: { value: "wrongpass" },
        });

        fireEvent.click(screen.getByTestId("admin-submit"));

        const error = await screen.findByTestId("admin-error");

        expect(error).toHaveTextContent("Identifiants invalides");
        expect(mockOnLogin).not.toHaveBeenCalled();
    });

    it("shows loading state during submission", async () => {
        let resolvePromise;
        loginAdmin.mockReturnValue(
            new Promise((resolve) => {
                resolvePromise = resolve;
            })
        );

        render(<AdminLogin onLogin={mockOnLogin} />);

        fireEvent.change(screen.getByPlaceholderText("admin@exemple.fr"), {
            target: { value: "admin@test.com" },
        });

        fireEvent.change(screen.getByPlaceholderText("••••••••"), {
            target: { value: "password123" },
        });

        fireEvent.click(screen.getByTestId("admin-submit"));

        expect(screen.getByText("Connexion…")).toBeInTheDocument();

        resolvePromise({ token: "fake-token" });

        await waitFor(() => {
            expect(mockOnLogin).toHaveBeenCalledWith("fake-token");
        });
    });
});