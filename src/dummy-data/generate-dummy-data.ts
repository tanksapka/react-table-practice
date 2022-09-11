interface SecurityMapType {
  id: string;
  resolved_id: string;
}

function generateSecurityMap(rows: number = 100): SecurityMapType[] {
  const results = [];
  for (let idx = 1; idx <= rows; idx++) {
    results.push({
      id: `sec_id_${idx.toString().padStart(rows.toString().length, "0")}`,
      resolved_id: `id_${idx.toString().padStart(rows.toString().length, "0")}`,
    });
  }
  return results;
}

export type { SecurityMapType };
export { generateSecurityMap };
