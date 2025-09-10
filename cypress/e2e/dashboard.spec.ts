describe("Dashboard - Borrower Pipeline, Details & Broker Overview", () => {
  beforeEach(() => {
    // Mock Borrower Pipeline
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

    // Mock Borrower Details
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

    // Mock Onboarding Workflow
    cy.intercept("GET", "/api/onboarding/workflow", {
      steps: [
        "Deal Intake",
        "IDV & Credit Check",
        "Document Upload",
        "AI Validation",
        "Credit Committee",
        "Approval & Docs",
        "Funder Syndication",
      ],
    }).as("getWorkflow");

    // Mock Broker Overview
    cy.intercept("GET", "/api/broker/1", {
      name: "Robert Turner",
      deals: 16,
      approval_rate: "75%",
      pending: 7660,
    }).as("getBroker");

    cy.visit("/");
    cy.wait("@getPipeline");
  });

  // --------------------------
  // Borrower Pipeline Tests
  // --------------------------
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

    cy.intercept("POST", "/api/borrowers/1/escalate", {
      message: "Escalated to Credit Committee",
    }).as("escalateLoan");
    cy.get("[data-cy=btn-escalate]").click();
    cy.wait("@escalateLoan");
  });

  // --------------------------
  // Onboarding Workflow Tests
  // --------------------------
  it("displays onboarding workflow steps", () => {
    cy.wait("@getWorkflow");
    cy.get("[data-cy=onboarding-workflow]").within(() => {
      cy.get("li").should("have.length", 7);
      cy.get("li").first().should("contain.text", "Deal Intake");
      cy.get("li").last().should("contain.text", "Funder Syndication");
    });
  });

  // --------------------------
  // Broker Overview Tests
  // --------------------------
  it("displays broker info", () => {
    cy.wait("@getBroker");
    cy.get("[data-cy=broker-overview]").within(() => {
      cy.contains("Robert Turner");
      cy.contains("16"); // Deals
      cy.contains("75%"); // Approval Rate
      cy.contains("$7,660"); // Pending
    });
  });

  // --------------------------
  // AI Assistant Toggle Test
  // --------------------------
  it("toggles AI assistant", () => {
    cy.get("[data-cy=ai-assistant-toggle]").click();
    cy.get("[data-cy=ai-assistant-toggle]").should(
      "have.attr",
      "aria-checked",
      "true"
    );

    cy.get("[data-cy=ai-assistant-toggle]").click();
    cy.get("[data-cy=ai-assistant-toggle]").should(
      "have.attr",
      "aria-checked",
      "false"
    );
  });
});
