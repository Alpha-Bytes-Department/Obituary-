import useAppContext from "./useAppContext";

/**
 * Returns auth-related state and actions.
 *
 * @returns {ReturnType<typeof useAppContext>} The auth session state.
 */
export default function useAuth() {
  return useAppContext();
}
