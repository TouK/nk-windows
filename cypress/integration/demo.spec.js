context("WM", () => {
  const screenshotConfig = { blackout: ["ol[role='tree']"] };

  beforeEach(() => {
    cy.visit("iframe.html?id=demo--default");
  });

  it("should open window", () => {
    cy.contains("with title").click();
    cy.get("[data-testid='window-frame']").should("be.visible").as("window");
    cy.get("@window").toMatchImageSnapshot({ screenshotConfig });
  });

  it("should maximize/restore window", () => {
    cy.contains("with title").click();
    cy.get("[data-testid='window-frame']").should("be.visible").as("window");
    cy.document().toMatchImageSnapshot({ screenshotConfig });
    cy.get("@window").contains("with title").dblclick();
    cy.document().toMatchImageSnapshot({ screenshotConfig });
    cy.get("button[name='zoom']").click();
    cy.document().toMatchImageSnapshot({ screenshotConfig });
  });

  it("should prevent window from going offscreen", () => {
    cy.contains("danger").click();
    cy.get("[data-testid='window-frame']").should("be.visible").as("window");
    cy.document().toMatchImageSnapshot({ screenshotConfig });
    cy.viewport(500, 500);
    cy.wait(200);
    cy.document().toMatchImageSnapshot({ screenshotConfig });
    cy.viewport("macbook-13");
    cy.wait(200);
    cy.document().toMatchImageSnapshot({ screenshotConfig });
  });
});
