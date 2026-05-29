import {
    calculateAge,
    isAdult,
    isValidPostalCode,
    isValidName,
    isValidEmail,
    validateForm,
} from "validators";

// ────────────────────────────────────────────────────────────────────────────
// calculateAge
// ────────────────────────────────────────────────────────────────────────────
describe("calculateAge", () => {
    test("calcule l'âge exact quand l'anniversaire est passé cette année", () => {
        const today = new Date();
        const birthYear = today.getFullYear() - 25;
        const birthDate = new Date(birthYear, today.getMonth() - 1, 1)
            .toISOString()
            .split("T")[0];
        expect(calculateAge(birthDate)).toBe(25);
    });

    test("calcule l'âge quand l'anniversaire n'est pas encore passé cette année", () => {
        const today = new Date();
        const birthYear = today.getFullYear() - 25;
        // Mois suivant => pas encore eu l'anniversaire
        const futureMonth = (today.getMonth() + 1) % 12;
        const birthDate = new Date(birthYear, futureMonth, 15)
            .toISOString()
            .split("T")[0];
        expect(calculateAge(birthDate)).toBe(24);
    });

    test("retourne 0 pour une naissance aujourd'hui", () => {
        const today = new Date().toISOString().split("T")[0];
        expect(calculateAge(today)).toBe(0);
    });

    test("gère une personne de 18 ans exactement aujourd'hui", () => {
        const today = new Date();
        const birth = new Date(
            today.getFullYear() - 18,
            today.getMonth(),
            today.getDate()
        )
            .toISOString()
            .split("T")[0];
        expect(calculateAge(birth)).toBe(18);
    });

    test("calcule correctement pour un âge de 100 ans", () => {
        const today = new Date();
        const birth = new Date(
            today.getFullYear() - 100,
            today.getMonth() - 1,
            1
        )
            .toISOString()
            .split("T")[0];
        expect(calculateAge(birth)).toBe(100);
    });
});

// ────────────────────────────────────────────────────────────────────────────
// isAdult
// ────────────────────────────────────────────────────────────────────────────
describe("isAdult", () => {
    const dateYearsAgo = (years, offsetDays = -1) => {
        const d = new Date();
        d.setFullYear(d.getFullYear() - years);
        d.setDate(d.getDate() + offsetDays);
        return d.toISOString().split("T")[0];
    };

    test("retourne true pour une personne de 18 ans exactement", () => {
        const today = new Date();
        const birth = new Date(
            today.getFullYear() - 18,
            today.getMonth(),
            today.getDate()
        )
            .toISOString()
            .split("T")[0];
        expect(isAdult(birth)).toBe(true);
    });

    test("retourne true pour une personne de 30 ans", () => {
        expect(isAdult(dateYearsAgo(30))).toBe(true);
    });

    test("retourne false pour une personne de 17 ans", () => {
        const today = new Date();
        const birth = new Date(
            today.getFullYear() - 17,
            today.getMonth() - 1,
            today.getDate()
        )
            .toISOString()
            .split("T")[0];
        expect(isAdult(birth)).toBe(false);
    });

    test("retourne false pour un mineur de 10 ans", () => {
        expect(isAdult(dateYearsAgo(10))).toBe(false);
    });

    test("retourne false pour une valeur vide", () => {
        expect(isAdult("")).toBe(false);
    });

    test("retourne false pour null", () => {
        expect(isAdult(null)).toBe(false);
    });

    test("retourne false pour undefined", () => {
        expect(isAdult(undefined)).toBe(false);
    });
});

// ────────────────────────────────────────────────────────────────────────────
// isValidPostalCode
// ────────────────────────────────────────────────────────────────────────────
describe("isValidPostalCode", () => {
    test("accepte un code postal français valide (75001)", () => {
        expect(isValidPostalCode("75001")).toBe(true);
    });

    test("accepte 00000", () => {
        expect(isValidPostalCode("00000")).toBe(true);
    });

    test("accepte 99999", () => {
        expect(isValidPostalCode("99999")).toBe(true);
    });

    test("refuse un code à 4 chiffres", () => {
        expect(isValidPostalCode("7500")).toBe(false);
    });

    test("refuse un code à 6 chiffres", () => {
        expect(isValidPostalCode("750011")).toBe(false);
    });

    test("refuse un code avec lettres", () => {
        expect(isValidPostalCode("7500A")).toBe(false);
    });

    test("refuse une chaîne vide", () => {
        expect(isValidPostalCode("")).toBe(false);
    });

    test("refuse un code avec espaces", () => {
        expect(isValidPostalCode("750 01")).toBe(false);
    });

    test("refuse un code avec tiret", () => {
        expect(isValidPostalCode("750-1")).toBe(false);
    });
});

// ────────────────────────────────────────────────────────────────────────────
// isValidName
// ────────────────────────────────────────────────────────────────────────────
describe("isValidName", () => {
    // Cas valides
    test("accepte un nom simple", () => {
        expect(isValidName("Dupont")).toBe(true);
    });

    test("accepte un prénom avec accent", () => {
        expect(isValidName("Élodie")).toBe(true);
    });

    test("accepte un prénom avec tréma", () => {
        expect(isValidName("Noël")).toBe(true);
    });

    test("accepte un prénom avec cédille", () => {
        expect(isValidName("François")).toBe(true);
    });

    test("accepte un nom composé avec tiret", () => {
        expect(isValidName("Martin-Dupont")).toBe(true);
    });

    test("accepte un nom composé avec espace", () => {
        expect(isValidName("Le Blanc")).toBe(true);
    });

    test("accepte un nom avec apostrophe", () => {
        expect(isValidName("O'Brien")).toBe(true);
    });

    test("accepte une ville avec accent grave", () => {
        expect(isValidName("Issy-les-Moulineaux")).toBe(true);
    });

    test("accepte des lettres arabes / autres Unicode", () => {
        // Un prénom courant en France d'origine arabe
        expect(isValidName("Aïcha")).toBe(true);
    });

    // Cas invalides
    test("refuse un nom avec chiffre", () => {
        expect(isValidName("Dupont2")).toBe(false);
    });

    test("refuse un nom avec @", () => {
        expect(isValidName("Dupont@")).toBe(false);
    });

    test("refuse une chaîne vide", () => {
        expect(isValidName("")).toBe(false);
    });

    test("refuse une chaîne d'espaces uniquement", () => {
        expect(isValidName("   ")).toBe(false);
    });

    test("refuse null", () => {
        expect(isValidName(null)).toBe(false);
    });

    test("refuse undefined", () => {
        expect(isValidName(undefined)).toBe(false);
    });

    test("refuse un nom avec point d'exclamation", () => {
        expect(isValidName("Dupont!")).toBe(false);
    });

    test("refuse un nom avec parenthèse", () => {
        expect(isValidName("Dupont(Jr)")).toBe(false);
    });
});

// ────────────────────────────────────────────────────────────────────────────
// isValidEmail
// ────────────────────────────────────────────────────────────────────────────
describe("isValidEmail", () => {
    test("accepte un email simple", () => {
        expect(isValidEmail("test@example.com")).toBe(true);
    });

    test("accepte un email avec sous-domaine", () => {
        expect(isValidEmail("user@mail.example.co.uk")).toBe(true);
    });

    test("accepte un email avec chiffres", () => {
        expect(isValidEmail("user123@domain.fr")).toBe(true);
    });

    test("accepte un email avec point dans le nom", () => {
        expect(isValidEmail("jean.dupont@example.fr")).toBe(true);
    });

    test("refuse un email sans @", () => {
        expect(isValidEmail("invalide.example.com")).toBe(false);
    });

    test("refuse un email sans domaine", () => {
        expect(isValidEmail("test@")).toBe(false);
    });

    test("refuse un email sans TLD", () => {
        expect(isValidEmail("test@domain")).toBe(false);
    });

    test("refuse une chaîne vide", () => {
        expect(isValidEmail("")).toBe(false);
    });

    test("refuse null", () => {
        expect(isValidEmail(null)).toBe(false);
    });

    test("refuse un email avec espace", () => {
        expect(isValidEmail("test @example.com")).toBe(false);
    });
});

// ────────────────────────────────────────────────────────────────────────────
// validateForm
// ────────────────────────────────────────────────────────────────────────────
describe("validateForm", () => {
    const validAdultDate = () => {
        const d = new Date();
        d.setFullYear(d.getFullYear() - 25);
        return d.toISOString().split("T")[0];
    };

    const validFields = () => ({
        firstName: "Jean",
        lastName: "Dupont",
        email: "jean@example.fr",
        birthDate: validAdultDate(),
        city: "Paris",
        postalCode: "75001",
    });

    test("retourne isValid=true pour des champs tous valides", () => {
        const { isValid, errors } = validateForm(validFields());
        expect(isValid).toBe(true);
        expect(Object.keys(errors)).toHaveLength(0);
    });

    test("retourne une erreur sur firstName si invalide", () => {
        const { isValid, errors } = validateForm({ ...validFields(), firstName: "Jean2" });
        expect(isValid).toBe(false);
        expect(errors.firstName).toBeDefined();
    });

    test("retourne une erreur sur lastName si invalide", () => {
        const { isValid, errors } = validateForm({ ...validFields(), lastName: "" });
        expect(isValid).toBe(false);
        expect(errors.lastName).toBeDefined();
    });

    test("retourne une erreur sur email si invalide", () => {
        const { isValid, errors } = validateForm({ ...validFields(), email: "notanemail" });
        expect(isValid).toBe(false);
        expect(errors.email).toBeDefined();
    });

    test("retourne une erreur si la date de naissance est absente", () => {
        const { isValid, errors } = validateForm({ ...validFields(), birthDate: "" });
        expect(isValid).toBe(false);
        expect(errors.birthDate).toBeDefined();
    });

    test("retourne une erreur si l'utilisateur est mineur", () => {
        const minorDate = new Date();
        minorDate.setFullYear(minorDate.getFullYear() - 16);
        const { isValid, errors } = validateForm({
            ...validFields(),
            birthDate: minorDate.toISOString().split("T")[0],
        });
        expect(isValid).toBe(false);
        expect(errors.birthDate).toMatch(/18/);
    });

    test("retourne une erreur sur city si invalide", () => {
        const { isValid, errors } = validateForm({ ...validFields(), city: "Paris9" });
        expect(isValid).toBe(false);
        expect(errors.city).toBeDefined();
    });

    test("retourne une erreur sur postalCode si invalide", () => {
        const { isValid, errors } = validateForm({ ...validFields(), postalCode: "1234" });
        expect(isValid).toBe(false);
        expect(errors.postalCode).toBeDefined();
    });

    test("Gere plusieurs erreurs en même temps", () => {
        const { isValid, errors } = validateForm({
            firstName: "",
            lastName: "",
            email: "bad",
            birthDate: "",
            city: "",
            postalCode: "abc",
        });
        expect(isValid).toBe(false);
        expect(Object.keys(errors).length).toBeGreaterThan(3);
    });
});