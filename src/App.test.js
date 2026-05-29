import { render, screen } from "@testing-library/react";
import App from "./App";


const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] ?? null),
    setItem: jest.fn((key, val) => { store[key] = String(val); }),
    removeItem: jest.fn((key) => { delete store[key]; }),
    clear: jest.fn(() => { store = {}; }),
  };
})();
Object.defineProperty(window, "localStorage", { value: localStorageMock });

beforeEach(() => { localStorageMock.clear(); jest.clearAllMocks(); });

describe("App", () => {
  test("affiche le titre et le sous-titre", () => {
    render(<App />);
    expect(screen.getByText(/portail d'inscription/i)).toBeInTheDocument();
    expect(screen.getByText(/rejoignez notre communauté/i)).toBeInTheDocument();
  });

  test("affiche le formulaire d'inscription", () => {
    render(<App />);
    expect(screen.getByTestId("registration-form")).toBeInTheDocument();
  });

  test("affiche la section liste", () => {
    render(<App />);
    expect(screen.getByTestId("empty-list")).toBeInTheDocument();
  });
});