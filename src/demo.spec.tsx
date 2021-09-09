import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

import React from "react";
import Demo from "./demo";

test("displays debug button", () => {
  render(<Demo />);
  expect(screen.getByText("add()")).toBeInTheDocument();
});
