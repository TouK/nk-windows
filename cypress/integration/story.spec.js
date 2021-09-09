context("Actions", () => {
  const screenshotConfig = { blackout: ["ol[role='tree']"] };

  beforeEach(() => {
    cy.visit("iframe.html?id=hello-world-2--default");
  });

  it("should open window", () => {
    cy.contains("with title").click();
    cy.get("[data-testid='window-frame']").should("be.visible").as("window");
    cy.get("@window").toMatchImageSnapshot({ screenshotConfig });
  });

  it("should maximize/restore window", () => {
    cy.contains("with title").click();
    cy.get("[data-testid='window-frame']").should("be.visible").as("window");
    cy.get("body").toMatchImageSnapshot({ screenshotConfig });
    cy.get("@window").contains("with title").dblclick();
    cy.get("body").toMatchImageSnapshot({ screenshotConfig });
    cy.get("button[name='zoom']").click();
    cy.get("body").toMatchImageSnapshot({ screenshotConfig });
  });
});
