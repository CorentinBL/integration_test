import {
    getRegistrations,
    saveRegistration,
    clearRegistrations,
} from "./localStorage";

// Mock localStorage
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: jest.fn((key) => store[key] ?? null),
        setItem: jest.fn((key, value) => { store[key] = String(value); }),
        removeItem: jest.fn((key) => { delete store[key]; }),
        clear: jest.fn(() => { store = {}; }),
    };
})();

Object.defineProperty(window, "localStorage", { value: localStorageMock });

beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
});

describe("getRegistrations", () => {
    test("retourne un tableau vide si rien n'est stocké", () => {
        expect(getRegistrations()).toEqual([]);
    });

    test("retourne la liste parsée depuis le localStorage", () => {
        const data = [{ id: 1, firstName: "Jean" }];
        localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(data));
        expect(getRegistrations()).toEqual(data);
    });

    test("retourne un tableau vide si le JSON est corrompu", () => {
        localStorageMock.getItem.mockReturnValueOnce("corrupted{json");
        expect(getRegistrations()).toEqual([]);
    });
});

describe("saveRegistration", () => {
    test("sauvegarde un utilisateur et retourne la liste mise à jour", () => {
        const user = { firstName: "Jean", lastName: "Dupont", email: "j@d.fr" };
        const result = saveRegistration(user);
        expect(result).toHaveLength(1);
        expect(result[0].firstName).toBe("Jean");
        expect(result[0].id).toBeDefined();
    });

    test("ajoute à une liste existante", () => {
        const existing = [{ id: 1, firstName: "Marie" }];
        localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(existing));
        const result = saveRegistration({ firstName: "Jean" });
        expect(result).toHaveLength(2);
    });

    test("persiste dans le localStorage", () => {
        saveRegistration({ firstName: "Jean" });
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
            "registrations",
            expect.any(String)
        );
    });
});

describe("clearRegistrations", () => {
    test("supprime la clé du localStorage", () => {
        clearRegistrations();
        expect(localStorageMock.removeItem).toHaveBeenCalledWith("registrations");
    });
});