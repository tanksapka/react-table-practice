import { generateRowItems } from "./generate-row-items";

describe("Dummy row item generation", () => {
  test("security list with 2 items", () => {
    const result = generateRowItems(2);

    expect(result).toStrictEqual([
      { sec_id: "sec_id_000", weight: "50", resolved_id: "", proxy_id: "" },
      { sec_id: "sec_id_001", weight: "50", resolved_id: "", proxy_id: "" },
    ]);
  });
  test("security list with 10 items", () => {
    const result = generateRowItems(10);

    expect(result).toStrictEqual([
      { sec_id: "sec_id_000", weight: "10", resolved_id: "", proxy_id: "" },
      { sec_id: "sec_id_001", weight: "10", resolved_id: "", proxy_id: "" },
      { sec_id: "sec_id_002", weight: "10", resolved_id: "", proxy_id: "" },
      { sec_id: "sec_id_003", weight: "10", resolved_id: "", proxy_id: "" },
      { sec_id: "sec_id_004", weight: "10", resolved_id: "", proxy_id: "" },
      { sec_id: "sec_id_005", weight: "10", resolved_id: "", proxy_id: "" },
      { sec_id: "sec_id_006", weight: "10", resolved_id: "", proxy_id: "" },
      { sec_id: "sec_id_007", weight: "10", resolved_id: "", proxy_id: "" },
      { sec_id: "sec_id_008", weight: "10", resolved_id: "", proxy_id: "" },
      { sec_id: "sec_id_009", weight: "10", resolved_id: "", proxy_id: "" },
    ]);
  });
});
