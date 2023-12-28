context("WM", () => {
  const screenshotConfig = { blackout: ["ol[role='tree']"] };

  beforeEach(() => {
    cy.visit("iframe.html?args=&id=demo--defult&viewMode=story");
  });

  it("should open window", () => {
    cy.contains("with title").click();
    cy.get("[data-testid='window-frame']").should("be.visible").as("window");
    cy.get("@window").matchImage({ screenshotConfig });
  });

  it("should maximize/restore window", () => {
    cy.contains("with title").click();
    cy.get("[data-testid='window-frame']").should("be.visible").as("window");
    cy.get("@window").contains("scroll to bottom").should("be.enabled");
    cy.document().matchImage({ screenshotConfig });
    cy.get("@window").contains("with title").dblclick();
    cy.document().matchImage({ screenshotConfig });
    cy.get("button[name='zoom']").click();
    cy.document().matchImage({ screenshotConfig });
  });

  it("should prevent window from going offscreen", () => {
    cy.contains("danger").click();
    cy.get("[data-testid='window-frame']").should("be.visible").as("window");
    cy.contains("to bottom").should("be.enabled");
    cy.document().matchImage({ screenshotConfig });
    cy.viewport(500, 500);
    cy.wait(300);
    cy.document().matchImage({ screenshotConfig });
    cy.contains("to bottom").should("be.enabled");
    cy.viewport("macbook-13");
    cy.wait(300);
    cy.contains("to bottom").should("be.disabled");
    cy.contains("add line").should("be.visible").click().click().click();
    cy.contains("to bottom").should("be.enabled");
    cy.document().matchImage({ screenshotConfig });
  });

  it("should prevent window from going offscreen (minimal size)", () => {
    cy.contains("minimal size").click();
    cy.get("[data-testid='window-frame']").should("be.visible").as("window");
    cy.contains("to bottom").should("be.enabled");
    cy.document().matchImage({ screenshotConfig });
    cy.viewport(500, 500);
    cy.wait(300);
    cy.document().matchImage({ screenshotConfig });
    cy.contains("to bottom").should("be.enabled");
    cy.viewport("macbook-13");
    cy.wait(300);
    cy.contains("to bottom").should("be.disabled");
    cy.contains("add line").should("be.visible").click().click().click();
    cy.contains("to bottom").should("be.enabled");
    cy.document().matchImage({ screenshotConfig });
  });

  it("should round translation coords", () => {
    cy.contains("not modal").click();
    cy.get("[data-testid='window-frame']")
      .should("be.visible")
      .should(($el) => {
        const { top, left } = $el[0].getBoundingClientRect();
        expect(top).to.eq(Math.round(top));
        expect(left).to.eq(Math.round(left));
      });
  });
});
