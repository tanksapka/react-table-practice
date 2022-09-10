import { z } from "zod";
import { render, screen } from "@testing-library/react";
import { Row, RowDefault, RowSchema, RowSchemaOutputType } from "./Row";

describe("Row validation schema", () => {
  test("sec_id: missing input", () => {
    const result = RowSchema.safeParse({
      weight: "100.0",
      resolved_id: null,
      proxy_id: "1",
    }) as z.SafeParseError<RowSchemaOutputType>;

    expect(result.success).toBe(false);
    expect(result.error.errors.length).toBe(1);
    expect(result.error.errors[0].message).toBe("Security id is required!");
  });

  test("sec_id: empty string", () => {
    const result = RowSchema.safeParse({
      sec_id: "",
      weight: "100.0",
      resolved_id: null,
      proxy_id: "1",
    }) as z.SafeParseError<RowSchemaOutputType>;

    expect(result.success).toBe(false);
    expect(result.error.errors.length).toBe(1);
    expect(result.error.errors[0].message).toBe("Security id is required!");
  });

  test("weight: missing input", () => {
    const result = RowSchema.safeParse({
      sec_id: "id_01",
      resolved_id: null,
      proxy_id: "1",
    }) as z.SafeParseError<RowSchemaOutputType>;

    expect(result.success).toBe(false);
    expect(result.error.errors.length).toBe(1);
    expect(result.error.errors[0].message).toBe("Weight is required!");
  });

  test("weight: wrong data type", () => {
    const result = RowSchema.safeParse({
      sec_id: "id_01",
      weight: "asdf",
      resolved_id: null,
      proxy_id: "1",
    }) as z.SafeParseError<RowSchemaOutputType>;

    expect(result.success).toBe(false);
    expect(result.error.errors.length).toBe(1);
    expect(result.error.errors[0].message).toBe("Invalid value for weight!");
  });

  test("weight: zero value", () => {
    const result = RowSchema.safeParse({
      sec_id: "id_01",
      weight: "0",
      resolved_id: null,
      proxy_id: "1",
    }) as z.SafeParseError<RowSchemaOutputType>;

    expect(result.success).toBe(false);
    expect(result.error.errors.length).toBe(1);
    expect(result.error.errors[0].message).toBe("Weight has to be non-zero!");
  });

  test("resolved_id & proxy_id: both missing", () => {
    const result = RowSchema.safeParse({
      sec_id: "id_01",
      weight: "100.0",
      resolved_id: null,
      proxy_id: null,
    }) as z.SafeParseError<RowSchemaOutputType>;

    expect(result.success).toBe(false);
    expect(result.error.errors.length).toBe(1);
    expect(result.error.errors[0].message).toBe("Either Resolved id or Proxy id has to be provided!");
  });

  test("resolved_id & proxy_id: both empty string", () => {
    const result = RowSchema.safeParse({
      sec_id: "id_01",
      weight: "100.0",
      resolved_id: "",
      proxy_id: "",
    }) as z.SafeParseError<RowSchemaOutputType>;

    expect(result.success).toBe(false);
    expect(result.error.errors.length).toBe(1);
    expect(result.error.errors[0].message).toBe("Either Resolved id or Proxy id has to be provided!");
  });

  test("valid form inputs", () => {
    const result = RowSchema.safeParse({
      sec_id: "id_01",
      weight: "100.0",
      resolved_id: "id_01",
      proxy_id: null,
    }) as z.SafeParseSuccess<RowSchemaOutputType>;

    expect(result.success).toBe(true);
    expect(result.data).toStrictEqual({ sec_id: "id_01", weight: 100.0, resolved_id: "id_01", proxy_id: null });
  });

  test("default values", () => {
    expect(RowDefault).toStrictEqual({ sec_id: "", weight: "", resolved_id: null, proxy_id: null });
  });
});

describe("Row component", () => {
  test("renders component with fields", () => {
    render(<Row />);
    expect(screen.getByPlaceholderText("sec_id")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("weight")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("resolved_id")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("proxy_id")).toBeInTheDocument();
  });
});
