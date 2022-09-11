import { generateSecurityMap } from "./generate-dummy-data";

describe("Dummy data generation", () => {
  test("security map with length of 2", () => {
    const result = generateSecurityMap(2);

    expect(result).toStrictEqual([
      { id: "sec_id_1", resolved_id: "id_1" },
      { id: "sec_id_2", resolved_id: "id_2" },
    ]);
  });

  test("security map with length of 10", () => {
    const result = generateSecurityMap(10);

    expect(result).toStrictEqual([
      { id: "sec_id_01", resolved_id: "id_01" },
      { id: "sec_id_02", resolved_id: "id_02" },
      { id: "sec_id_03", resolved_id: "id_03" },
      { id: "sec_id_04", resolved_id: "id_04" },
      { id: "sec_id_05", resolved_id: "id_05" },
      { id: "sec_id_06", resolved_id: "id_06" },
      { id: "sec_id_07", resolved_id: "id_07" },
      { id: "sec_id_08", resolved_id: "id_08" },
      { id: "sec_id_09", resolved_id: "id_09" },
      { id: "sec_id_10", resolved_id: "id_10" },
    ]);
  });
});
