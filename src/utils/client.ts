import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://127.0.0.1:8000",
  headers: {
    "Content-type": "application/json",
  },
  validateStatus: (status: number) => (status >= 200 && status < 300) || status === 404,
});

interface SecMapResponse {
  id: string;
  resolved_id: string;
}

async function resolveId(sec_id: string) {
  return await apiClient.get<SecMapResponse>(`sec-map/${sec_id}`);
}

export { apiClient, resolveId };
export type { SecMapResponse };
