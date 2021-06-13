import "@testing-library/jest-dom";

import React from "react";
import { render, screen } from "@testing-library/react";
import HelloWorld from "./hello-world";

test("displays debug button", () => {
  render(<HelloWorld />);
  expect(screen.getByText("add()")).toBeInTheDocument();
});
