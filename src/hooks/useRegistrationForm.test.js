import { renderHook, act } from "@testing-library/react";
import { useRegistrationForm } from "./useRegistrationForm";
import {createUser} from "../utils/api";


jest.mock("../utils/api", () => ({
    createUser: jest.fn(),
}));

// Helper : date adulte valide
function adultDate() {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 25);
    return d.toISOString().split("T")[0];
}

// Helper : remplir tous les champs avec des valeurs valides
function fillAllFields(result, overrides = {}) {
    const values = {
        firstName: "Jean",
        lastName: "Dupont",
        email: "jean@exemple.fr",
        birthDate: adultDate(),
        city: "Paris",
        postalCode: "75001",
        ...overrides,
    };
    Object.entries(values).forEach(([name, value]) => {
        act(() => result.current.handleChange(name, value));
    });
    return values;
}

// ─────────────────────────────────────────────────────────────────────────────
// État initial
// ─────────────────────────────────────────────────────────────────────────────
describe("useRegistrationForm - état initial", () => {
    test("tous les champs sont vides au départ", () => {
        const { result } = renderHook(() => useRegistrationForm());
        Object.values(result.current.fields).forEach((v) => expect(v).toBe(""));
    });

    test("pas d'erreurs au départ", () => {
        const { result } = renderHook(() => useRegistrationForm());
        expect(result.current.errors).toEqual({});
    });

    test("aucun champ touché au départ", () => {
        const { result } = renderHook(() => useRegistrationForm());
        expect(result.current.touched).toEqual({});
    });

    test("le toast est invisible au départ", () => {
        const { result } = renderHook(() => useRegistrationForm());
        expect(result.current.toastVisible).toBe(false);
    });

    test("isFormFilled est false au départ", () => {
        const { result } = renderHook(() => useRegistrationForm());
        expect(result.current.isFormFilled).toBe(false);
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// isFormFilled
// ─────────────────────────────────────────────────────────────────────────────
describe("useRegistrationForm - isFormFilled", () => {
    test("reste false si seulement certains champs sont remplis", () => {
        const { result } = renderHook(() => useRegistrationForm());
        act(() => result.current.handleChange("firstName", "Jean"));
        expect(result.current.isFormFilled).toBe(false);
    });

    test("devient true quand tous les champs sont remplis", () => {
        const { result } = renderHook(() => useRegistrationForm());
        fillAllFields(result);
        expect(result.current.isFormFilled).toBe(true);
    });

    test("repasse à false si un champ est vidé", () => {
        const { result } = renderHook(() => useRegistrationForm());
        fillAllFields(result);
        act(() => result.current.handleChange("firstName", ""));
        expect(result.current.isFormFilled).toBe(false);
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// handleChange
// ─────────────────────────────────────────────────────────────────────────────
describe("useRegistrationForm - handleChange", () => {
    test("met à jour la valeur du champ", () => {
        const { result } = renderHook(() => useRegistrationForm());
        act(() => result.current.handleChange("firstName", "Jean"));
        expect(result.current.fields.firstName).toBe("Jean");
    });

    test("ne valide pas si le champ n'est pas encore touché", () => {
        const { result } = renderHook(() => useRegistrationForm());
        act(() => result.current.handleChange("email", "invalid"));
        expect(result.current.errors.email).toBeUndefined();
    });

    test("revalide si le champ est déjà touché", () => {
        const { result } = renderHook(() => useRegistrationForm());
        // Toucher le champ d'abord
        act(() => result.current.handleBlur("email"));
        // Puis modifier avec une valeur invalide
        act(() => result.current.handleChange("email", "invalid"));
        expect(result.current.errors.email).toBeDefined();
    });

    test("efface l'erreur si le champ touché devient valide", () => {
        const { result } = renderHook(() => useRegistrationForm());
        act(() => result.current.handleBlur("email"));
        act(() => result.current.handleChange("email", "invalid"));
        expect(result.current.errors.email).toBeDefined();
        act(() => result.current.handleChange("email", "valide@exemple.fr"));
        expect(result.current.errors.email).toBeUndefined();
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// handleBlur
// ─────────────────────────────────────────────────────────────────────────────
describe("useRegistrationForm - handleBlur", () => {
    test("marque le champ comme touché", () => {
        const { result } = renderHook(() => useRegistrationForm());
        act(() => result.current.handleBlur("firstName"));
        expect(result.current.touched.firstName).toBe(true);
    });

    test("déclenche la validation et ajoute une erreur si invalide", () => {
        const { result } = renderHook(() => useRegistrationForm());
        act(() => result.current.handleChange("email", "bad"));
        act(() => result.current.handleBlur("email"));
        expect(result.current.errors.email).toBeDefined();
    });

    test("ne génère pas d'erreur si le champ est valide", () => {
        const { result } = renderHook(() => useRegistrationForm());
        act(() => result.current.handleChange("email", "bon@exemple.fr"));
        act(() => result.current.handleBlur("email"));
        expect(result.current.errors.email).toBeUndefined();
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// handleSubmit - cas invalide
// ─────────────────────────────────────────────────────────────────────────────
describe("useRegistrationForm - handleSubmit invalide", () => {
    const fakeEvent = { preventDefault: jest.fn() };

    test("appelle preventDefault", async() => {
        const { result } = renderHook(() => useRegistrationForm());
        await act(async() => await result.current.handleSubmit(fakeEvent));
        expect(fakeEvent.preventDefault).toHaveBeenCalled();
    });

    test("marque tous les champs comme touchés", async () => {
        const { result } = renderHook(() => useRegistrationForm());
        await act(async() => await result.current.handleSubmit(fakeEvent));
        const touchedKeys = Object.keys(result.current.touched);
        expect(touchedKeys).toEqual(
            expect.arrayContaining(["firstName", "lastName", "email", "birthDate", "city", "postalCode"])
        );
    });

    test("remplit les erreurs si le formulaire est invalide", async() => {
        const { result } = renderHook(() => useRegistrationForm());
        await act(async() => result.current.handleSubmit(fakeEvent));
        expect(Object.keys(result.current.errors).length).toBeGreaterThan(0);
    });

    test("ne sauvegarde pas si invalide", async() => {
        const { result } = renderHook(() => useRegistrationForm());
        await act(async() => result.current.handleSubmit(fakeEvent));
        expect(createUser).not.toHaveBeenCalled();
    });

    test("n'affiche pas le toast si invalide", async() => {
        const { result } = renderHook(() => useRegistrationForm());
        await act(async() => result.current.handleSubmit(fakeEvent));
        expect(result.current.toastVisible).toBe(false);
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// handleSubmit - cas valide
// ─────────────────────────────────────────────────────────────────────────────
describe("useRegistrationForm - handleSubmit valide", () => {
    const fakeEvent = { preventDefault: jest.fn() };
    beforeEach(() => {
        jest.useFakeTimers("modern");
        createUser.mockResolvedValue({});
    });

    afterEach(() => {
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
        jest.clearAllMocks();
    });

    test("appelle createUser avec les champs", async() => {
        const { result } = renderHook(() => useRegistrationForm());
        fillAllFields(result);
        await act(async() => await result.current.handleSubmit(fakeEvent));
        expect(createUser).toHaveBeenCalledWith(
            expect.objectContaining({ firstName: "Jean", lastName: "Dupont" })
        );
    });

    test("remet tous les champs à vide", async() => {
        const { result } = renderHook(() => useRegistrationForm());
        fillAllFields(result);
        await act(async() => await result.current.handleSubmit(fakeEvent));
        Object.values(result.current.fields).forEach((v) => expect(v).toBe(""));
    });

    test("efface les erreurs", async() => {
        const { result } = renderHook(() => useRegistrationForm());
        fillAllFields(result);
       await act(async() => await result.current.handleSubmit(fakeEvent));
        expect(result.current.errors).toEqual({});
    });

    test("efface les champs touchés", async() => {
        const { result } = renderHook(() => useRegistrationForm());
        fillAllFields(result);
        await act(async() => await result.current.handleSubmit(fakeEvent));
        expect(result.current.touched).toEqual({});
    });

    test("affiche le toast", async() => {
        const { result } = renderHook(() => useRegistrationForm());
        fillAllFields(result);
       await act(async() => await result.current.handleSubmit(fakeEvent));
        expect(result.current.toastVisible).toBe(true);
    });

    test("cache le toast après 3 secondes", async() => {
        const { result } = renderHook(() => useRegistrationForm());
        fillAllFields(result);
        await act(async() => await result.current.handleSubmit(fakeEvent));
        expect(result.current.toastVisible).toBe(true);
        await act(async () => await jest.advanceTimersByTime(3000));
        expect(result.current.toastVisible).toBe(false);
    });
});