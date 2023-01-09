import { z } from "zod";
import { Controller, useFormContext } from "react-hook-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FormControl, Input, Grid, CircularProgress, IconButton, Box, Typography } from "@mui/material";
import { resolveId } from "../../utils/client";
import { CheckCircleOutline, ErrorOutline, Refresh } from "@mui/icons-material";
import { useEffect, useState } from "react";

const RowSchema = z.object({
  sec_id: z.string({ required_error: "Security id is required!" }).trim().min(1, "Security id is required!"),
  resolved_id: z
    .string({ required_error: "Resolved is has to be provided!" })
    .trim()
    .min(1, "Resolved is has to be provided!"),
  proxy_id: z
    .string()
    .trim()
    .transform((val) => (val === "" ? null : val))
    .nullable(),
});

type RowSchemaInputType = z.input<typeof RowSchema>;
type RowSchemaOutputType = z.output<typeof RowSchema>;

const RowDefault = {
  sec_id: "",
  resolved_id: "",
  proxy_id: "",
};

function Row({ index }: { index: number }) {
  const { control, getValues, setValue, watch } = useFormContext<{ sec_list: RowSchemaInputType[] }>();
  const resolvedIdWatch = watch(`sec_list.${index}.resolved_id` as const);
  const proxyWatch = watch(`sec_list.${index}.proxy_id` as const);

  const queryClient = useQueryClient();
  const secQueryKey = ["sec_id", `sec_id_00${index}`];
  const [secState, setSecState] = useState(true);
  const secQuery = useQuery({
    queryKey: secQueryKey,
    queryFn: () => resolveId(getValues().sec_list[index].sec_id as string),
    enabled: secState,
  });
  const secIsFetching = queryClient.isFetching(secQueryKey) > 0;

  const proxyQueryKey = ["sec_id", `proxy_id_00${index}`];
  const [proxyState, setProxyState] = useState(false);
  const proxyQuery = useQuery({
    queryKey: proxyQueryKey,
    queryFn: () => resolveId(getValues().sec_list[index].proxy_id as string),
    enabled: proxyState,
  });

  useEffect(
    () =>
      setValue(
        `sec_list.${index}.resolved_id` as const,
        !!proxyWatch ? proxyQuery.data?.data.resolved_id || "" : secQuery.data?.data.resolved_id || ""
      ),
    [setValue, index, proxyWatch, proxyQuery.data?.data.resolved_id, secQuery.data?.data.resolved_id]
  );

  return (
    <>
      {index === 0 && (
        <Grid container columns={{ xs: 4, sm: 8, md: 12 }} sx={{ borderBottom: "1px solid rgba(0, 0, 0, 0.42)}" }}>
          <Grid item xs={1} sm={2} md={4}>
            <Typography textAlign="center">Security Id</Typography>
          </Grid>
          <Grid item xs={1} sm={2} md={3}>
            <Typography textAlign="center">Resolved Id</Typography>
          </Grid>
          <Grid item xs={1} sm={2} md={3}>
            <Typography textAlign="center">Proxy Id</Typography>
          </Grid>
          <Grid item xs={1} sm={1} md={1}>
            <Typography textAlign="center">Status</Typography>
          </Grid>
          <Grid item xs={1} sm={1} md={1}>
            <Typography textAlign="center">Refresh</Typography>
          </Grid>
        </Grid>
      )}
      <Grid container columns={{ xs: 4, sm: 8, md: 12 }}>
        <Grid item xs={1} sm={2} md={4}>
          <FormControl fullWidth sx={{ py: "1px" }}>
            <Controller
              control={control}
              name={`sec_list.${index}.sec_id` as const}
              defaultValue=""
              render={({ field }) => <Input placeholder="sec_id" readOnly {...field} />}
            />
          </FormControl>
        </Grid>
        <Grid item xs={1} sm={2} md={3}>
          <FormControl fullWidth sx={{ py: "1px" }}>
            <Controller
              control={control}
              name={`sec_list.${index}.resolved_id` as const}
              defaultValue=""
              render={({ field }) => <Input placeholder="resolved_id" readOnly {...field} />}
            />
          </FormControl>
        </Grid>
        <Grid item xs={1} sm={2} md={3}>
          <FormControl fullWidth sx={{ py: "1px" }}>
            <Controller
              control={control}
              name={`sec_list.${index}.proxy_id` as const}
              defaultValue=""
              render={({ field }) => <Input placeholder="proxy_id" {...field} autoComplete="off" />}
            />
          </FormControl>
        </Grid>
        <Grid item xs={1} sm={1} md={1}>
          <Box display="flex" p="4px" justifyContent="center" borderBottom="1px solid rgba(0, 0, 0, 0.42)}">
            {!!resolvedIdWatch ? <CheckCircleOutline color="success" /> : <ErrorOutline color="error" />}
          </Box>
        </Grid>
        <Grid item xs={1} sm={1} md={1}>
          <Box display="flex" justifyContent="center" borderBottom="1px solid rgba(0, 0, 0, 0.42)}">
            {secIsFetching ? (
              <Box p="5px">
                <CircularProgress size={18} />
              </Box>
            ) : (
              <IconButton
                disabled={!proxyWatch}
                onClick={() => {
                  if (!proxyWatch) {
                    setProxyState(false);
                    setSecState(true);
                  } else {
                    setProxyState(true);
                    setSecState(false);
                    proxyQuery.refetch();
                  }
                }}
                size="small"
                title="Resolve id"
                sx={{ p: "4px" }}
              >
                <Refresh color={!!proxyWatch ? "secondary" : "disabled"} />
              </IconButton>
            )}
          </Box>
        </Grid>
      </Grid>
    </>
  );
}

export type { RowSchemaInputType, RowSchemaOutputType };
export { Row, RowSchema, RowDefault, resolveId };
