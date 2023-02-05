import { CheckCircleOutline, ErrorOutline, Refresh } from "@mui/icons-material";
import { Box, CircularProgress, FormControl, Grid, IconButton, Input, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { createColumnHelper, useReactTable, getCoreRowModel, flexRender, CellContext } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { resolveId, RowSchemaInputType } from "../Row/Row";

function ResolvedId({ info }: { info: CellContext<RowSchemaInputType, string | null> }) {
  const { control, getValues, setValue } = useFormContext<{ sec_list: RowSchemaInputType[] }>();
  const [secState, setSecState] = useState(true);
  const secQuery = useQuery({
    queryKey: ["sec_id", `sec_id_00${info.row.index}`],
    queryFn: () => resolveId(getValues().sec_list[info.row.index].sec_id as string),
    enabled: secState,
  });

  useEffect(() => {
    if (!!secQuery.data?.data.resolved_id) {
      setSecState(true);
      setValue(`sec_list.${info.row.index}.resolved_id` as const, secQuery.data?.data.resolved_id);
    } else {
      setSecState(false);
    }
  }, [setValue, info.row.index, secQuery.data?.data.resolved_id]);

  return (
    <FormControl fullWidth sx={{ py: "1px" }}>
      <Controller
        control={control}
        name={`sec_list.${info.row.index}.resolved_id` as const}
        defaultValue=""
        render={({ field }) => (
          <Input
            placeholder="resolved_id"
            readOnly
            {...field}
            endAdornment={!!field.value ? <CheckCircleOutline color="success" /> : <ErrorOutline color="error" />}
            error={!field.value}
            sx={{ pr: "0.5rem" }}
          />
        )}
      />
    </FormControl>
  );
}

function ProxyId({ info }: { info: CellContext<RowSchemaInputType, string | null> }) {
  const { control, getValues, setValue } = useFormContext<{ sec_list: RowSchemaInputType[] }>();
  const [proxyState, setProxyState] = useState(false);
  const proxyQuery = useQuery({
    queryKey: ["sec_id", `proxy_id_00${info.row.index}`],
    queryFn: () => resolveId(getValues().sec_list[info.row.index].proxy_id as string),
    enabled: proxyState,
  });

  useEffect(() => {
    if (!!proxyQuery.data?.data.resolved_id)
      setValue(`sec_list.${info.row.index}.resolved_id` as const, proxyQuery.data?.data.resolved_id);
  }, [setValue, info.row.index, proxyQuery.data?.data.resolved_id]);

  return (
    <FormControl fullWidth sx={{ py: "1px" }}>
      <Controller
        control={control}
        name={`sec_list.${info.row.index}.proxy_id` as const}
        defaultValue=""
        render={({ field }) => (
          <Input
            placeholder="proxy_id"
            autoComplete="off"
            {...field}
            endAdornment={
              proxyQuery.isFetching ? (
                <Box p="4px">
                  <CircularProgress size={18} />
                </Box>
              ) : (
                <IconButton
                  disabled={!field.value}
                  onClick={() => {
                    if (!field.value) {
                      setProxyState(false);
                    } else {
                      setProxyState(true);
                      proxyQuery.refetch();
                    }
                  }}
                  size="small"
                  title="Resolve id"
                  sx={{ p: "4px" }}
                >
                  <Refresh color={!!field.value ? "secondary" : "disabled"} />
                </IconButton>
              )
            }
          />
        )}
      />
    </FormControl>
  );
}

function Table() {
  const { control, getValues } = useFormContext<{ sec_list: RowSchemaInputType[] }>();
  const columnHelper = createColumnHelper<RowSchemaInputType>();
  const columns = [
    columnHelper.accessor("sec_id", {
      header: () => <Typography textAlign="center">Security Id</Typography>,
      cell: (info) => (
        <FormControl fullWidth sx={{ py: "1px" }}>
          <Controller
            control={control}
            name={`sec_list.${info.row.index}.sec_id` as const}
            defaultValue=""
            render={({ field }) => <Input placeholder="sec_id" readOnly {...field} />}
          />
        </FormControl>
      ),
    }),
    columnHelper.accessor("resolved_id", {
      header: () => <Typography textAlign="center">Resolved Id</Typography>,
      cell: (info) => <ResolvedId info={info} />,
    }),
    columnHelper.accessor("proxy_id", {
      header: () => <Typography textAlign="center">Proxy Id</Typography>,
      cell: (info) => <ProxyId info={info} />,
    }),
  ];
  const table = useReactTable({ data: getValues().sec_list, columns, getCoreRowModel: getCoreRowModel() });

  return (
    <Grid container columns={{ xs: 3, sm: 6, md: 12 }}>
      {table.getHeaderGroups().map((headerGroup) =>
        headerGroup.headers.map((header) => (
          <Grid item xs={1} sm={2} md={4} key={header.id} sx={{ borderBottom: "1px solid rgba(0, 0, 0, 0.42)}" }}>
            {flexRender(header.column.columnDef.header, header.getContext())}
          </Grid>
        ))
      )}
      {table.getRowModel().rows.map((row) =>
        row.getVisibleCells().map((cell) => (
          <Grid item xs={1} sm={2} md={4} key={cell.id}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </Grid>
        ))
      )}
    </Grid>
  );
}

export { Table };
