context("Actions", () => {
  beforeEach(() => {
    cy.visit("iframe.html?id=hello-world--default");
  });

  it("should work", () => {
    cy.get("body").toMatchImageSnapshot();
    expect(1).to.eq(1);
  });
});
