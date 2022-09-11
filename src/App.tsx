import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Row, RowDefault, RowSchema, RowSchemaInputType } from "./components/Row/Row";
import { Box, Button, Container, Typography } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { resolveId } from "./utils/client";

const queryClient = new QueryClient();

function App() {
  const methods = useForm<RowSchemaInputType>({ defaultValues: RowDefault, resolver: zodResolver(RowSchema) });
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
  const { handleSubmit, getValues } = useFormContext<RowSchemaInputType>();

  return (
    <>
      <form onSubmit={handleSubmit((data) => console.log(data))}>
        <Row />
      </form>
      <Box mt={5}>
        <Button variant="contained" onClick={() => resolveId(getValues("sec_id"))}>
          Resolve ids
        </Button>
      </Box>
    </>
  );
}

export default App;
