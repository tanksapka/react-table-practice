import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders react table app text", () => {
  render(<App />);
  const linkElement = screen.getByText(/react table app/i);
  expect(linkElement).toBeInTheDocument();
});
