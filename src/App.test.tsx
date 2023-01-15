import { screen } from "@testing-library/react";
import App from "./App";
import { renderWithReactHookForm } from "./utils/renderWithReactHookForm";
const axios = require("axios");

jest.mock("axios");

describe("App", () => {
  test("renders react table app text", () => {
    axios.get.mockResolvedValue({
      id: "sec_id_001",
      resolved_id: "id_001",
    });

    renderWithReactHookForm(<App />);
    const linkElement = screen.getByText(/react table app/i);
    expect(linkElement).toBeInTheDocument();
  });
});
