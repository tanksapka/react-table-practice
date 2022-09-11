import { screen } from "@testing-library/react";
import App from "./App";
import { renderWithReactHookForm } from "./utils/renderWithReactHookForm";

test("renders react table app text", () => {
  renderWithReactHookForm(<App />);
  const linkElement = screen.getByText(/react table app/i);
  expect(linkElement).toBeInTheDocument();
});
