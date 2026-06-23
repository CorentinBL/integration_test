describe("Cas limites réseau", () => {

    it("affiche une erreur si le serveur est indisponible au chargement", () => {
        cy.intercept("GET", "/users", { forceNetworkError: true }).as("getUsers");

        cy.visit("/");

        cy.contains("Impossible de charger la liste");
    });
});