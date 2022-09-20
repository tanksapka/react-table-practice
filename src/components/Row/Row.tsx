import { z } from "zod";
import { Controller, useFormContext } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { FormControl, Input, Grid, CircularProgress } from "@mui/material";
import { resolveId } from "../../utils/client";

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
  resolved_id: "",
  proxy_id: "",
};

function Row({ index }: { index: number }) {
  const { control, watch, setValue } = useFormContext<{ sec_list: RowSchemaInputType[] }>();
  // const watchSecId = watch("sec_id");
  // const query = useQuery(["sec-map", watchSecId], () => resolveId(watchSecId));

  // console.log(watchSecId);
  // console.log(query.data?.data);

  // setValue("resolved_id", query.data?.data.resolved_id || "");

  return (
    <Grid container>
      <Grid item>
        <FormControl>
          <Controller
            control={control}
            name={`sec_list.${index}.sec_id` as const}
            defaultValue=""
            render={({ field }) => <Input placeholder="sec_id" {...field} />}
          />
        </FormControl>
      </Grid>
      <Grid item>
        <FormControl>
          <Controller
            control={control}
            name={`sec_list.${index}.weight` as const}
            defaultValue=""
            render={({ field }) => <Input placeholder="weight" {...field} />}
          />
        </FormControl>
      </Grid>
      <Grid item>
        <FormControl>
          <Controller
            control={control}
            name={`sec_list.${index}.resolved_id` as const}
            defaultValue=""
            render={({ field }) => <Input placeholder="resolved_id" {...field} />}
          />
        </FormControl>
      </Grid>
      <Grid item>
        <FormControl>
          <Controller
            control={control}
            name={`sec_list.${index}.proxy_id` as const}
            defaultValue=""
            render={({ field }) => <Input placeholder="proxy_id" {...field} />}
          />
        </FormControl>
      </Grid>
      {/* <Grid item>{(query.isFetching || query.isLoading) && <CircularProgress size={20} />}</Grid> */}
    </Grid>
  );
}

export type { RowSchemaInputType, RowSchemaOutputType };
export { Row, RowSchema, RowDefault, resolveId };
