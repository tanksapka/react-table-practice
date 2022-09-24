import { Autocomplete, Box, CircularProgress, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { generateRowItems, SecItem } from "../../dummy-data/generate-row-items";

const DELAY = 2000;

/**
 * MUI component with loading state and sleep to mimic data fetch from server.
 */
function AutocompleteWithLoadingState() {
  const [secList, setSecList] = useState<readonly SecItem[]>([]);
  const [secOpen, setSecOpen] = useState(false);
  const secLoading = secOpen && secList.length === 0;

  useEffect(() => {
    let active = true;

    if (!secLoading) {
      return undefined;
    }

    (async () => {
      await new Promise((r) => setTimeout(r, DELAY)); // Mimic network "speed".

      if (active) {
        setSecList([...generateRowItems()]);
      }
    })();

    return () => {
      active = false;
    };
  }, [secLoading]);

  useEffect(() => {
    if (!secOpen) {
      setSecList([]);
    }
  }, [secOpen]);

  return (
    <Autocomplete
      open={secOpen}
      onOpen={() => setSecOpen(true)}
      onClose={() => setSecOpen(false)}
      options={secList}
      isOptionEqualToValue={(option, value) => option.sec_id === value.sec_id}
      getOptionLabel={(option) => option.sec_id}
      renderOption={(props, option) => (
        <Box component="li" {...props}>
          {option.sec_id}
        </Box>
      )}
      loading={secLoading}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Choose a security"
          inputProps={{
            ...params.inputProps,
            placeholder: "Enter security id...",
            autoComplete: "new-password", // disable autocomplete and autofill
          }}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {secLoading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
}

export { AutocompleteWithLoadingState };
