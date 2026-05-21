import { useAxios as useAxiosClient } from "../context/AxiosProvider";

/**
 * Returns the shared Axios instance for API calls.
 *
 * @returns {import('axios').AxiosInstance} The configured Axios client.
 */
export default function useAxios() {
  return useAxiosClient();
}
