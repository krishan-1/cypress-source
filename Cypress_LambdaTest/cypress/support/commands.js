import "cypress-file-upload";
import "cypress-real-events";
Cypress.Commands.addAll({
  login(email, password) {
    cy.visit("https://admin-staging.sourcesync.io/#/login?redirect=%2F");
    cy.contains("Login").click();
    cy.get("#username").type(email);
    cy.get("#password").type(password);
    cy.get("#kc-login").click();
  },

  logout() {
    cy.contains("Source Digital").click();
    cy.get(".q-menu > .q-list >  :nth-child(3)").click();
  },

  changeOrg(orgName) {
    cy.get(".q-header > .q-toolbar > .items-center > button").eq(2).click();
    cy.contains("Organization").click();
    cy.contains(orgName).click();
    cy.wait(2000);
  },
});

afterEach(function () {
  if (this.currentTest.state === "failed") {
    Cypress.runner.stop();
  }
});
