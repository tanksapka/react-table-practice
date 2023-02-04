import { FormControl, Grid, Input, Typography } from "@mui/material";
import { createColumnHelper, useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import { useMemo } from "react";
import { generateRowItems } from "../../dummy-data/generate-row-items";
import { RowSchemaInputType } from "../Row/Row";

function Table() {
  const data = useMemo(() => [...generateRowItems()], []);
  const columnHelper = createColumnHelper<RowSchemaInputType>();
  const columns = [
    columnHelper.accessor("sec_id", {
      header: () => <Typography textAlign="center">Security Id</Typography>,
      cell: (info) => (
        <FormControl fullWidth sx={{ py: "1px" }}>
          <Input placeholder="sec_id" readOnly value={info.getValue()} />
        </FormControl>
      ),
    }),
    columnHelper.accessor("resolved_id", {
      header: () => <Typography textAlign="center">Resolved Id</Typography>,
      cell: (info) => (
        <FormControl fullWidth sx={{ py: "1px" }}>
          <Input placeholder="resolved_id" readOnly value={info.getValue()} sx={{ pr: "0.5rem" }} />
        </FormControl>
      ),
    }),
    columnHelper.accessor("proxy_id", {
      header: () => <Typography textAlign="center">Proxy Id</Typography>,
      cell: (info) => (
        <FormControl fullWidth sx={{ py: "1px" }}>
          <Input placeholder="proxy_id" autoComplete="off" value={info.getValue()} sx={{ pr: "0.5rem" }} />
        </FormControl>
      ),
    }),
  ];
  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() });

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
