context("WM", () => {
  const screenshotConfig = { blackout: ["ol[role='tree']"] };
  const defaultWait = 800;

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
    cy.document().matchImage({ screenshotConfig });
    cy.get("@window").contains("with title").dblclick();
    cy.document().matchImage({ screenshotConfig });
    cy.get("button[name='zoom']").click();
    cy.document().matchImage({ screenshotConfig });
    cy.get("@window").contains("close all").click();
  });

  it("should prevent window from going offscreen", () => {
    cy.contains("danger").click();
    cy.get("[data-testid='window-frame']").should("be.visible").as("window");
    cy.contains("to bottom").should("be.disabled");
    cy.document().matchImage({ screenshotConfig });
    cy.viewport(500, 500);
    cy.wait(defaultWait);
    cy.get("[data-testid='window-frame']").matchImage({ screenshotConfig });
    cy.contains("to bottom").should("be.enabled");
    cy.viewport(1280, 720);
    cy.wait(defaultWait);
    cy.contains("to bottom").should("be.disabled");
    cy.contains("add line").should("be.visible").click().click().click();
    cy.contains("to bottom").should("be.enabled");
    cy.document().matchImage({ screenshotConfig });
  });

  it("should prevent window from going offscreen (minimal size)", () => {
    cy.contains("minimal size").click();
    cy.get("[data-testid='window-frame']").should("be.visible").as("window");
    cy.contains("to bottom").should("be.disabled");
    cy.document().matchImage({ screenshotConfig });
    cy.viewport(500, 500);
    cy.wait(defaultWait);
    cy.get("[data-testid='window-frame']").matchImage({ screenshotConfig });
    cy.contains("to bottom").should("be.enabled");
    cy.viewport(1280, 720);
    cy.wait(defaultWait);
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

  it("should respect layoutData position", () => {
    cy.viewport(1000, 1000);
    cy.contains("left").click();
    cy.get("[data-testid='window-frame']")
      .should("be.visible")
      .should(($el) => {
        const { top, left, right, bottom } = $el[0].getBoundingClientRect();
        expect(top).to.eq(50);
        expect(left).to.eq(200);
        expect(right).to.eq(950);
        expect(bottom).to.eq(800);
      });
  });

  it("should allow global windows", () => {
    cy.contains("global").click();
    cy.contains("[data-testid='window-frame']", /global/)
      .should("be.visible")
      .as("window1");
    cy.wait(1000);
    cy.contains("initial size").click();
    cy.contains("[data-testid='window-frame']", /initial size/)
      .should("be.visible")
      .as("window2");
    cy.get("@window1").should("be.visible");
    cy.get("@window2").should("be.visible");
  });
});
