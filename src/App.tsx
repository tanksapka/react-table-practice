import { FormProvider, useFieldArray, useForm, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Row, RowSchema } from "./components/Row/Row";
import { Box, Button, Container, Typography } from "@mui/material";
import { QueryClient, QueryClientProvider, useQueries } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { resolveId } from "./utils/client";
import { z } from "zod";
import { generateRowItmes } from "./dummy-data/generate-row-items";

const queryClient = new QueryClient();

const tableSchema = z.object({
  sec_list: z.array(RowSchema),
});

function App() {
  const methods = useForm<z.input<typeof tableSchema>>({
    defaultValues: { sec_list: [...generateRowItmes()] },
    resolver: zodResolver(tableSchema),
  });

  return (
    <QueryClientProvider client={queryClient}>
      <FormProvider {...methods}>
        <Container>
          <Typography variant="h2" mb={5}>
            React Table App
          </Typography>
          <TableWrapper />
        </Container>
      </FormProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

function TableWrapper() {
  const { control, handleSubmit } = useFormContext<z.input<typeof tableSchema>>();
  const rowList = useFieldArray({ control, name: "sec_list" });
  const secQueries = useQueries({
    queries: rowList.fields.map((sec) => ({ queryKey: ["sec_id", sec.sec_id], queryFn: () => resolveId(sec.sec_id) })),
  });

  return (
    <>
      <form onSubmit={handleSubmit((data) => console.log(data))}>
        {rowList.fields.map((_, index) => (
          <Row key={index} index={index} />
        ))}
      </form>
      {/* <Box mt={5}>
        <Button variant="contained" onClick={() => resolveId(getValues("sec_id"))}>
          Resolve ids
        </Button>
      </Box> */}
    </>
  );
}

export default App;
