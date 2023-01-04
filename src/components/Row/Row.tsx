import { z } from "zod";
import { Controller, useFormContext } from "react-hook-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FormControl, Input, Grid, CircularProgress, IconButton, Box } from "@mui/material";
import { resolveId, SecMapResponse } from "../../utils/client";
import { AxiosResponse } from "axios";
import { Refresh } from "@mui/icons-material";
import { useEffect, useState } from "react";

const RowSchema = z
  .object({
    sec_id: z.string({ required_error: "Security id is required!" }).trim().min(1, "Security id is required!"),
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
  resolved_id: "",
  proxy_id: "",
};

function Row({ index }: { index: number }) {
  const { control, watch } = useFormContext<{ sec_list: RowSchemaInputType[] }>();
  const proxyWatch = watch(`sec_list.${index}.proxy_id` as const);

  const queryClient = useQueryClient();
  const secQueryKey = ["sec_id", `sec_id_00${index}`];
  const secQuery = queryClient.getQueryData<AxiosResponse<SecMapResponse, any>>(secQueryKey);
  const secIsFetching = queryClient.isFetching(secQueryKey) > 0;

  const proxyQueryKey = ["sec_id", `proxy_id_00${index}`];
  const [proxyState, setProxyState] = useState(false);
  const proxyQuery = useQuery({
    queryKey: proxyQueryKey,
    queryFn: () => resolveId(proxyWatch as string),
    enabled: proxyState,
  });

  const resolvedId = !!proxyWatch ? proxyQuery.data?.data.resolved_id || "" : secQuery?.data.resolved_id || "";

  useEffect(() => {
    if (!proxyWatch) setProxyState(false);
  }, [proxyWatch]);

  return (
    <Grid container columns={{ xs: 4, sm: 8, md: 12 }}>
      <Grid item xs={1} sm={2} md={4}>
        <FormControl fullWidth>
          <Controller
            control={control}
            name={`sec_list.${index}.sec_id` as const}
            defaultValue=""
            render={({ field }) => <Input placeholder="sec_id" readOnly {...field} />}
          />
        </FormControl>
      </Grid>
      <Grid item xs={1} sm={2} md={4}>
        <FormControl fullWidth>
          <Controller
            control={control}
            name={`sec_list.${index}.resolved_id` as const}
            defaultValue=""
            render={({ field }) => <Input placeholder="resolved_id" readOnly {...field} value={resolvedId} />}
          />
        </FormControl>
      </Grid>
      <Grid item xs={1} sm={2} md={3}>
        <FormControl fullWidth>
          <Controller
            control={control}
            name={`sec_list.${index}.proxy_id` as const}
            defaultValue=""
            render={({ field }) => <Input placeholder="proxy_id" {...field} />}
          />
        </FormControl>
      </Grid>
      <Grid item xs={1} sm={2} md={1}>
        {secIsFetching ? (
          <Box p="6px">
            <CircularProgress size={18} />
          </Box>
        ) : (
          <IconButton
            disabled={!proxyWatch}
            onClick={() => {
              setProxyState(true);
              proxyQuery.refetch();
            }}
            size="small"
          >
            <Refresh color={!!proxyWatch ? "primary" : "disabled"} />
          </IconButton>
        )}
      </Grid>
    </Grid>
  );
}

export type { RowSchemaInputType, RowSchemaOutputType };
export { Row, RowSchema, RowDefault, resolveId };
