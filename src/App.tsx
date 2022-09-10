import { FormProvider, useForm } from "react-hook-form";
import { Row, RowDefault, RowSchemaInputType } from "./components/Row/Row";
import { Container, Typography } from "@mui/material";

function App() {
  const methods = useForm<RowSchemaInputType>({ defaultValues: RowDefault });
  return (
    <FormProvider {...methods}>
      <Container>
        <Typography variant="h1">React Table App</Typography>
        <form onSubmit={methods.handleSubmit((data) => console.log(data))}>
          <Row />
        </form>
      </Container>
    </FormProvider>
  );
}

export default App;
