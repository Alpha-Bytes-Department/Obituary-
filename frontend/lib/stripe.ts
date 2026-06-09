import { loadStripe } from "@stripe/stripe-js";

// Next.js ONLY exposes env vars to the browser when prefixed with NEXT_PUBLIC_
// The key in .env.example was NEXT_STRIPE_PUBLC_KEY but that never reaches the browser.
// Use NEXT_PUBLIC_STRIPE_KEY in your .env.local instead.
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_KEY ?? "";


if (!stripePublishableKey) {
  console.warn(
    "[Stripe] Publishable key is empty. " +
    "Add NEXT_PUBLIC_STRIPE_KEY=pk_live_... (or pk_test_...) to your frontend .env.local " +
    "and restart the dev server."
  );
}

// loadStripe is memoized — safe to call at module level.
// Pass null when the key is missing so Stripe doesn't throw during SSR/build.
export const stripePromise = stripePublishableKey
  ? loadStripe(stripePublishableKey)
  : null;
