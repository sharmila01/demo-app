describe("Borrower Pipeline & Details", () => {
  beforeEach(() => {
    cy.intercept("GET", "/api/borrowers/pipeline", {
      new: [
        {
          id: "1",
          name: "Alice",
          loan_type: "Home Loan",
          amount: 100000,
          status: "New",
          email: "alice@test.com",
          phone: "1234567890",
        },
      ],
      in_review: [],
      approved: [],
    }).as("getPipeline");

    cy.intercept("GET", "/api/borrowers/1", {
      id: "1",
      name: "Alice",
      loan_amount: 100000,
      status: "New",
      email: "alice@test.com",
      phone: "1234567890",
      ai_flags: ["Low credit score"],
      employment: "Engineer",
      existing_loan: 50000,
      credit_score: 600,
      source_of_funds: "Salary",
      risk_signal: "High risk",
    }).as("getDetails");

    cy.visit("/");
    cy.wait("@getPipeline");
  });

  it("displays borrower pipeline", () => {
    cy.get("li[data-cy^='borrower-item-']").should(
      "have.length.greaterThan",
      0
    );
  });

  it("selects a borrower and loads details", () => {
    cy.get("li[data-cy^='borrower-item-']").first().click();
    cy.wait("@getDetails");

    cy.get("[data-cy=borrower-details]").should("be.visible");
    cy.get("[data-cy=borrower-name]").should("contain.text", "Alice");
  });

  it("expands and collapses AI Explainability", () => {
    cy.get("li[data-cy^='borrower-item-']").first().click();
    cy.wait("@getDetails");

    cy.get("[data-cy=ai-accordion]").click();
    cy.get("[data-cy=ai-flag]").should("contain.text", "Low credit score");
  });

  it("clicks action buttons with intercepted API calls", () => {
    cy.get("li[data-cy^='borrower-item-']").first().click();
    cy.wait("@getDetails");

    cy.intercept("POST", "/api/borrowers/1/request-documents", {
      message: "Documents requested",
    }).as("requestDocs");
    cy.get("[data-cy=btn-request-documents]").click();
    cy.wait("@requestDocs");

    cy.intercept("POST", "/api/borrowers/1/approve", {
      message: "Loan approved",
    }).as("approveLoan");
    cy.get("[data-cy=btn-approve]").click();
    cy.wait("@approveLoan");
  });
});
