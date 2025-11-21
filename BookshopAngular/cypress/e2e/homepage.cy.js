describe('Home page Tests', () => {
    Cypress.on('uncaught:exception', (err, runnable) => { return false; })
    let baseUrl;
    
    beforeEach(() => {
        baseUrl = Cypress.env('baseUrl');
    
        if (!baseUrl) {
            baseUrl = 'http://localhost:4200';
        }

        cy.visit(`${baseUrl}/mates`);
        cy.wait(500);
    });

    it('should show all listings', () => {
        cy.get('.bookPosts-container').should('have.length.greaterThan', 0);
    });

});