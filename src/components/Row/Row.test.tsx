import { z } from "zod";
import { screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Row, RowDefault, RowSchema, RowSchemaOutputType } from "./Row";
import { renderWithReactHookForm } from "../../utils/renderWithReactHookForm";

describe("Row validation schema", () => {
  test("sec_id: missing input", () => {
    const result = RowSchema.safeParse({
      resolved_id: null,
      proxy_id: "1",
    }) as z.SafeParseError<RowSchemaOutputType>;

    expect(result.success).toBe(false);
    expect(result.error.errors.length).toBe(2);
    expect(result.error.errors[0].message).toBe("Security id is required!");
  });

  test("sec_id: empty string", () => {
    const result = RowSchema.safeParse({
      sec_id: "",
      resolved_id: null,
      proxy_id: "1",
    }) as z.SafeParseError<RowSchemaOutputType>;

    expect(result.success).toBe(false);
    expect(result.error.errors.length).toBe(2);
    expect(result.error.errors[0].message).toBe("Security id is required!");
  });

  test("resolved_id: empty string", () => {
    const result = RowSchema.safeParse({
      sec_id: "id_01",
      resolved_id: "",
      proxy_id: null,
    }) as z.SafeParseError<RowSchemaOutputType>;

    expect(result.success).toBe(false);
    expect(result.error.errors.length).toBe(1);
    expect(result.error.errors[0].message).toBe("Resolved is has to be provided!");
  });

  test("valid form inputs", () => {
    const result = RowSchema.safeParse({
      sec_id: "id_01",
      resolved_id: "id_01",
      proxy_id: null,
    }) as z.SafeParseSuccess<RowSchemaOutputType>;

    expect(result.success).toBe(true);
    expect(result.data).toStrictEqual({ sec_id: "id_01", resolved_id: "id_01", proxy_id: null });
  });

  test("default values", () => {
    expect(RowDefault).toStrictEqual({ sec_id: "", resolved_id: "", proxy_id: "" });
  });
});

describe("Row component", () => {
  test("renders component with fields", () => {
    const queryClient = new QueryClient();
    renderWithReactHookForm(
      <QueryClientProvider client={queryClient}>
        <Row index={0} />
      </QueryClientProvider>
    );
    expect(screen.getByPlaceholderText("sec_id")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("resolved_id")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("proxy_id")).toBeInTheDocument();
  });
});
