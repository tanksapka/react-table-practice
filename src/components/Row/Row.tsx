import { z } from "zod";
import { Controller, useFormContext } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { FormControl, Input, Grid, CircularProgress } from "@mui/material";
import { resolveId, SecMapResponse } from "../../utils/client";
import { AxiosResponse } from "axios";

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
  const { control, setValue } = useFormContext<{ sec_list: RowSchemaInputType[] }>();
  const queryClient = useQueryClient();
  const queryKey = ["sec_id", `sec_id_00${index}`];
  const query = queryClient.getQueryData<AxiosResponse<SecMapResponse, any>>(queryKey);
  const isFetching = queryClient.isFetching(queryKey) > 0;

  !isFetching && setValue(`sec_list.${index}.resolved_id`, query?.data.resolved_id || "");

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
      <Grid item>{isFetching && <CircularProgress size={20} />}</Grid>
    </Grid>
  );
}

export type { RowSchemaInputType, RowSchemaOutputType };
export { Row, RowSchema, RowDefault, resolveId };
