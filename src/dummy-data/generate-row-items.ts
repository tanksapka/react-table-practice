interface SecItem {
  sec_id: string;
  resolved_id: string;
  proxy_id: string;
}

function generateRowItems(rowCount: number = 10, numberLen: number = 3): readonly SecItem[] {
  return Array(rowCount)
    .fill("")
    .map((_, idx) => ({
      sec_id: `sec_id_${idx.toString().padStart(numberLen, "0")}`,
      resolved_id: "",
      proxy_id: "",
    }));
}

export { generateRowItems };
export type { SecItem };
