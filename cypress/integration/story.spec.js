context("Actions", () => {
  beforeEach(() => {
    cy.visit("iframe.html?id=hello-world-2--default");
  });

  it("should work", () => {
    cy.get("body").toMatchImageSnapshot();
    expect(1).to.eq(1);
  });
});
