import { apiClient } from "../utils/client";
import { generateSecurityMap } from "./generate-dummy-data";

function run() {
  const res = generateSecurityMap(100);
  res.map((item) => apiClient.post("sec-map", item));
}

run();
