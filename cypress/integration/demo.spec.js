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
});
