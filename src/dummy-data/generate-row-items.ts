function generateRowItmes(rowCount: number = 10) {
  return Array(rowCount)
    .fill("")
    .map((_, idx) => ({
      sec_id: `sec_id_${idx}`,
      weight: `${100 / rowCount}`,
      resolved_id: "",
      proxy_id: "",
    }));
}

export { generateRowItmes };
