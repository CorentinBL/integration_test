import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RegisteredList from "./RegisteredList";

// ---- MOCK HOOKS ----
jest.mock("../hooks/useUsersList", () => ({
    useUsersList: jest.fn(),
}));

jest.mock("../hooks/useUsersAdminActions", () => ({
    useUsersAdminActions: jest.fn(),
}));

// ---- MOCK MODAL ----
jest.mock("./UsersDetailsModal", () => ({ user, onClose }) => (
    <div data-testid="modal">
        <p>{user.prenom}</p>
        <button onClick={onClose}>close</button>
    </div>
));

import { useUsersList } from "../hooks/useUsersList";
import { useUsersAdminActions } from "../hooks/useUsersAdminActions";

describe("RegisteredList", () => {
    const mockDelete = jest.fn();
    const mockDetails = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        useUsersAdminActions.mockReturnValue({
            handleDelete: mockDelete,
            handleGetDetails: mockDetails,
        });
    });

    // -------------------------
    test("shows loading state", () => {
        useUsersList.mockReturnValue({
            users: [],
            loading: true,
            error: null,
        });

        render(<RegisteredList />);

        expect(screen.getByText(/Chargement/i)).toBeInTheDocument();
    });

    // -------------------------
    test("renders users list", () => {
        useUsersList.mockReturnValue({
            users: [
                { id: 1, prenom: "John", nom: "Doe" },
                { id: 2, prenom: "Jane", nom: "Smith" },
            ],
            loading: false,
            error: null,
        });

        render(<RegisteredList />);

        expect(screen.getByText("John Doe")).toBeInTheDocument();
        expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    });

    // -------------------------
    test("shows empty state", () => {
        useUsersList.mockReturnValue({
            users: [],
            loading: false,
            error: null,
        });

        render(<RegisteredList />);

        expect(
            screen.getByText(/Aucun inscrit/i)
        ).toBeInTheDocument();
    });

    // -------------------------
    test("shows admin buttons when logged in", () => {
        useUsersList.mockReturnValue({
            users: [{ id: 1, prenom: "John", nom: "Doe" }],
            loading: false,
            error: null,
        });

        render(<RegisteredList adminToken="fake-token" />);

        expect(screen.getByText("Détails")).toBeInTheDocument();
        expect(screen.getByText("Supprimer")).toBeInTheDocument();
    });

    // -------------------------
    test("calls delete function", async () => {
        useUsersList.mockReturnValue({
            users: [{ id: 1, prenom: "John", nom: "Doe" }],
            loading: false,
            error: null,
        });

        render(<RegisteredList adminToken="token" />);

        fireEvent.click(screen.getByText("Supprimer"));

        await waitFor(() => {
            expect(mockDelete).toHaveBeenCalledWith(1, "token");
        });
    });

    // -------------------------
    test("opens modal on details click", async () => {
        useUsersList.mockReturnValue({
            users: [{ id: 1, prenom: "John", nom: "Doe" }],
            loading: false,
            error: null,
        });

        mockDetails.mockResolvedValue({
            id: 1,
            prenom: "John",
        });

        render(<RegisteredList adminToken="token" />);

        fireEvent.click(screen.getByText("Détails"));

        await waitFor(() => {
            expect(mockDetails).toHaveBeenCalledWith(1, "token");
            expect(screen.getByTestId("modal")).toBeInTheDocument();
        });
    });
});