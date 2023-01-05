import { FormProvider, useFieldArray, useForm, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Row, RowSchema } from "./components/Row/Row";
import { Box, Button, Container, Grid, Typography } from "@mui/material";
import { QueryClient, QueryClientProvider, useQueries, useQueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { resolveId } from "./utils/client";
import { z } from "zod";
import { generateRowItems } from "./dummy-data/generate-row-items";
import CountrySelect from "./components/CountrySelect/CountrySelect";
import { AutocompleteWithLoadingState } from "./components/Autocomplete/AutocompleteWithLoadingState";
import { AutocompleteWithVirtualize } from "./components/Autocomplete/AutocompleteWithVirtualize";

const queryClient = new QueryClient();

const tableSchema = z.object({
  sec_list: z.array(RowSchema),
});

function App() {
  const methods = useForm<z.input<typeof tableSchema>>({
    defaultValues: { sec_list: [...generateRowItems()] },
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
  const queryClient = useQueryClient();
  useQueries({
    queries: rowList.fields.map((sec) => ({
      queryKey: ["sec_id", sec.sec_id],
      queryFn: () => resolveId(sec.sec_id),
    })),
  });

  return (
    <Container maxWidth="md">
      <form onSubmit={handleSubmit((data) => console.log(data))}>
        <Grid container rowGap="2rem">
          <Grid item width="100%">
            <Typography variant="h5" my={2}>
              Autocomplete with loading state
            </Typography>
            <AutocompleteWithLoadingState />
          </Grid>
          <Grid item width="100%">
            <Typography variant="h5" my={2}>
              Autocomplete with virtualization
            </Typography>
            <AutocompleteWithVirtualize />
          </Grid>
          <Grid item width="100%">
            <Typography variant="h5" my={2}>
              Autocomplete simple version
            </Typography>
            <CountrySelect />
          </Grid>
          <Grid item width="100%">
            {rowList.fields.map((_, index) => (
              <Row key={index} index={index} />
            ))}
          </Grid>
        </Grid>
        <Box mt={5} display="flex" justifyContent="space-between">
          <Button variant="contained" color="secondary" onClick={() => queryClient.refetchQueries()}>
            Resolve ids
          </Button>
          <Button type="submit" variant="contained">
            Submit
          </Button>
        </Box>
      </form>
    </Container>
  );
}

export default App;
