export interface PendingSignupData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const PENDING_SIGNUP_KEY = "obituary.pendingSignup";

/**
 * Stores the pending signup payload for the verification step.
 *
 * @param {PendingSignupData} data - The signup payload to persist.
 * @returns {void}
 */
export function savePendingSignup(data: PendingSignupData) {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(PENDING_SIGNUP_KEY, JSON.stringify(data));
}

/**
 * Reads the pending signup payload from session storage.
 *
 * @returns {PendingSignupData | null} The stored signup payload.
 */
export function getPendingSignup() {
  if (typeof window === "undefined") {
    return null;
  }

  const rawValue = window.sessionStorage.getItem(PENDING_SIGNUP_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as PendingSignupData;
  } catch {
    return null;
  }
}

/**
 * Clears the pending signup payload.
 *
 * @returns {void}
 */
export function clearPendingSignup() {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.removeItem(PENDING_SIGNUP_KEY);
}
