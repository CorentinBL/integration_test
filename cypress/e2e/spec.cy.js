describe('template spec', () => {
    beforeEach(function () {
        cy.fixture('employees').as('employeesJSON')
    })
    it('deployed react app to localhost', function(){
        let users = this.employeesJSON;
        //debugger
        cy.intercept('GET', '/users', {
            statusCode: 200,
            body: {...users},
        });

        cy.visit('http://localhost:3000')
        cy.contains('3 user(s) already registered')
    })

})