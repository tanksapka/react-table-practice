import { z } from "zod";
import { useFormContext } from "react-hook-form";
import { FormControl, Input, Grid } from "@mui/material";

const RowSchema = z
  .object({
    sec_id: z.string({ required_error: "Security id is required!" }).trim().min(1, "Security id is required!"),
    weight: z
      .string({ required_error: "Weight is required!" })
      .trim()
      .regex(/[+-]?([0-9]*[.])?[0-9]+/, "Invalid value for weight!")
      .transform((val) => parseFloat(val))
      .refine((val) => val !== 0.0, "Weight has to be non-zero!"),
    resolved_id: z
      .string()
      .trim()
      .transform((val) => (val === "" ? null : val))
      .nullable(),
    proxy_id: z
      .string()
      .trim()
      .transform((val) => (val === "" ? null : val))
      .nullable(),
  })
  .refine((row) => row.resolved_id !== null || row.proxy_id !== null, {
    message: "Either Resolved id or Proxy id has to be provided!",
    path: ["resolved_id"],
  });

type RowSchemaInputType = z.input<typeof RowSchema>;
type RowSchemaOutputType = z.output<typeof RowSchema>;

const RowDefault = {
  sec_id: "",
  weight: "",
  resolved_id: null,
  proxy_id: null,
};

function Row() {
  // const { control } = useFormContext<RowSchemaInputType>();
  return (
    <Grid container>
      <Grid item>
        <FormControl>
          <Input placeholder="sec_id" />
        </FormControl>
      </Grid>
      <Grid item>
        <FormControl>
          <Input placeholder="weight" />
        </FormControl>
      </Grid>
      <Grid item>
        <FormControl>
          <Input placeholder="resolved_id" />
        </FormControl>
      </Grid>
      <Grid item>
        <FormControl>
          <Input placeholder="proxy_id" />
        </FormControl>
      </Grid>
    </Grid>
  );
}

export type { RowSchemaInputType, RowSchemaOutputType };
export { Row, RowSchema, RowDefault };
