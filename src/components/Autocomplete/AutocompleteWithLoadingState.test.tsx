import { act, fireEvent, screen } from "@testing-library/react";
import { renderWithReactHookForm } from "../../utils/renderWithReactHookForm";
import { AutocompleteWithLoadingState } from "./AutocompleteWithLoadingState";

describe("AutocompleteWithLoadingState component", () => {
  test("renders component", () => {
    renderWithReactHookForm(<AutocompleteWithLoadingState />);
    const input = screen.getByPlaceholderText("Enter security id...");

    expect(input).toBeInTheDocument();
    act(() => input.focus());
    fireEvent.change(input, { target: { value: "sec_id_000" } });

    expect(input).toHaveValue("sec_id_000");
  });
});
