import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders some content link", () => {
  render(<App />);
  const linkElement = screen.getByText(/some content/i);
  expect(linkElement).toBeInTheDocument();
});
