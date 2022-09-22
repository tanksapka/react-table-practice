function generateRowItmes(rowCount: number = 10) {
  return Array(rowCount)
    .fill("")
    .map((_, idx) => ({
      sec_id: `sec_id_00${idx}`,
      weight: `${100 / rowCount}`,
      resolved_id: "",
      proxy_id: "",
    }));
}

export { generateRowItmes };
