import { generateRowItems } from "./generate-row-items";

describe("Dummy row item generation", () => {
  test("security list with 2 items", () => {
    const result = generateRowItems(2);

    expect(result).toStrictEqual([
      { sec_id: "sec_id_000", resolved_id: "", proxy_id: "" },
      { sec_id: "sec_id_001", resolved_id: "", proxy_id: "" },
    ]);
  });
  test("security list with 10 items", () => {
    const result = generateRowItems(10);

    expect(result).toStrictEqual([
      { sec_id: "sec_id_000", resolved_id: "", proxy_id: "" },
      { sec_id: "sec_id_001", resolved_id: "", proxy_id: "" },
      { sec_id: "sec_id_002", resolved_id: "", proxy_id: "" },
      { sec_id: "sec_id_003", resolved_id: "", proxy_id: "" },
      { sec_id: "sec_id_004", resolved_id: "", proxy_id: "" },
      { sec_id: "sec_id_005", resolved_id: "", proxy_id: "" },
      { sec_id: "sec_id_006", resolved_id: "", proxy_id: "" },
      { sec_id: "sec_id_007", resolved_id: "", proxy_id: "" },
      { sec_id: "sec_id_008", resolved_id: "", proxy_id: "" },
      { sec_id: "sec_id_009", resolved_id: "", proxy_id: "" },
    ]);
  });
});
