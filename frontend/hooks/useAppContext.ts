import { useAppContext as useAppContextClient } from "@/context/AppContext";

/**
 * Returns the global application context.
 *
 * @returns {ReturnType<typeof useAppContextClient>} The app context state and actions.
 */
export default function useAppContext() {
  return useAppContextClient();
}
