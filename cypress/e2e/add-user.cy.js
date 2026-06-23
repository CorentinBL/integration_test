describe('Ajout utilisateur', () => {

    it('ajoute un utilisateur', () => {

        cy.visit('/');

        cy.get('[data-cy=firstName]').type('Jean');
        cy.get('[data-cy=lastName]').type('Dupont');
        cy.get('[data-cy=email]').type('jean@test.fr');
        cy.get('[data-cy=birthDate]').type('1990-01-01');
        cy.get('[data-cy=city]').type('Paris');
        cy.get('[data-cy=postalCode]').type('75001');

        cy.get('[data-testid=submit-button]').should('not.be.disabled').click();

        cy.get('[ data-testid="registered-item"]')
            .contains('Jean');

    });

});