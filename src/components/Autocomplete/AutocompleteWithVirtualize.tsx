import { VariableSizeList, ListChildComponentProps } from "react-window";
import {
  Autocomplete,
  autocompleteClasses,
  ListSubheader,
  Popper,
  styled,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { createContext, forwardRef, HTMLAttributes, ReactNode, Ref, useContext, useEffect, useRef } from "react";
import { generateRowItems, SecItem } from "../../dummy-data/generate-row-items";

const LISTBOX_PADDING = 8; // px

function renderSecRow(props: ListChildComponentProps) {
  const { data, index, style } = props;
  const dataSet = data[index];
  const inlineStyle = {
    ...style,
    top: (style.top as number) + LISTBOX_PADDING,
  };

  if (dataSet.hasOwnProperty("group")) {
    return (
      <ListSubheader key={dataSet.key} component="div" style={inlineStyle}>
        {dataSet.group}
      </ListSubheader>
    );
  }

  return (
    <Typography component="li" {...dataSet[0]} noWrap style={inlineStyle}>
      {dataSet[1].sec_id}
    </Typography>
  );
}

const OuterElementContext = createContext({});

const OuterElementType = forwardRef<HTMLDivElement>((props, ref) => {
  const outerProps = useContext(OuterElementContext);
  return <div ref={ref} {...props} {...outerProps} />;
});

function useResetCache(data: any) {
  const ref = useRef<VariableSizeList>(null);
  useEffect(() => {
    if (ref.current != null) {
      ref.current.resetAfterIndex(0, true);
    }
  }, [data]);
  return ref;
}

interface SecGroup {
  key: Number;
  group: string;
  children: [ReactNode, SecItem][];
}

// Adapter for react-window
const ListboxComponent = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLElement> & { renderRow: (params: ListChildComponentProps) => JSX.Element }
>(function ListboxComponent({ renderRow, ...props }, ref) {
  const { children, ...other } = props;
  const itemData: (SecGroup | [ReactNode, SecItem])[] = [];
  (children as SecGroup[]).forEach((item) => {
    itemData.push(item);
    itemData.push(...(item.children || []));
  });

  const theme = useTheme();
  const smUp = useMediaQuery(theme.breakpoints.up("sm"), {
    noSsr: true,
  });
  const itemCount = itemData.length;
  const itemSize = smUp ? 36 : 48;

  const getChildSize = (child: SecGroup | [ReactNode, SecItem]) => {
    if (child.hasOwnProperty("group")) {
      return 48;
    }

    return itemSize;
  };

  const getHeight = () => {
    if (itemCount > 8) {
      return 8 * itemSize;
    }
    return itemData.map(getChildSize).reduce((a, b) => a + b, 0);
  };

  const gridRef = useResetCache(itemCount);

  return (
    <div ref={ref}>
      <OuterElementContext.Provider value={other}>
        <VariableSizeList
          itemData={itemData}
          height={getHeight() + 2 * LISTBOX_PADDING}
          width="100%"
          ref={gridRef}
          outerElementType={OuterElementType}
          innerElementType="ul"
          itemSize={(index) => getChildSize(itemData[index])}
          overscanCount={5}
          itemCount={itemCount}
        >
          {renderRow}
        </VariableSizeList>
      </OuterElementContext.Provider>
    </div>
  );
});

const StyledPopper = styled(Popper)({
  [`& .${autocompleteClasses.listbox}`]: {
    boxSizing: "border-box",
    "& ul": {
      padding: 0,
      margin: 0,
    },
  },
});

function AutocompleteWithVirtualize() {
  const secList: readonly SecItem[] = [...generateRowItems(10000)];

  return (
    <Autocomplete
      id="virtualize-demo"
      disableListWrap
      PopperComponent={StyledPopper}
      ListboxComponent={forwardRef(
        (listboxProps: HTMLAttributes<HTMLElement>, ref: Ref<HTMLDivElement> | undefined) => (
          <ListboxComponent {...listboxProps} ref={ref} renderRow={renderSecRow} />
        )
      )}
      options={secList}
      isOptionEqualToValue={(option, value) => option.sec_id === value.sec_id}
      getOptionLabel={(option) => option.sec_id}
      groupBy={(option) => option.sec_id[0].toUpperCase()}
      renderInput={(params) => <TextField {...params} placeholder="Enter security id..." label="10,000 options" />}
      renderOption={(props, option) => [props, option] as React.ReactNode}
      // TODO: Post React 18 update - validate this conversion, look like a hidden bug
      renderGroup={(params) => params as unknown as React.ReactNode}
    />
  );
}

export { AutocompleteWithVirtualize };
