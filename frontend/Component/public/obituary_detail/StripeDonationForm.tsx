"use client";

import { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Lock, Loader2, ShieldCheck } from "lucide-react";

interface StripeDonationFormProps {
  amount: number;
  donorName: string;
  donorEmail: string;
  message: string;
  memorialId: string;
  paymentIntentId: string;
  onSuccess: (amount: number) => void;
  onError: (msg: string) => void;
}

export default function StripeDonationForm({
  amount,
  donorName,
  donorEmail,
  message,
  memorialId,
  paymentIntentId,
  onSuccess,
  onError,
}: StripeDonationFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setErrorMsg("");

    try {
      // Ensure all element data is submitted
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setErrorMsg(submitError.message || "Validation failed.");
        setIsProcessing(false);
        return;
      }

      // Confirm the card payment
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.href,
          payment_method_data: {
            billing_details: {
              name: donorName,
              email: donorEmail,
            },
          },
        },
        redirect: "if_required",
      });

      if (error) {
        const msg = error.message || "Payment failed. Please try again.";
        setErrorMsg(msg);
        onError(msg);
        setIsProcessing(false);
        return;
      }

      if (paymentIntent && paymentIntent.status === "succeeded") {
        // Notify backend to record the donation
        try {
          const apiUrl =
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
          await fetch(`${apiUrl}/donations/${memorialId}/confirm`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              paymentIntentId: paymentIntent.id,
              donorName,
              donorEmail,
              amount,
              message,
            }),
          });
        } catch {
          // Payment already succeeded on Stripe, safe to show success
        }
        onSuccess(amount);
      } else if (
        paymentIntent &&
        paymentIntent.status === "requires_action"
      ) {
        // 3D-Secure or similar — Stripe JS handles this automatically
        // but if we end up here, something went wrong
        setErrorMsg(
          "Additional authentication is needed. Please try a different card."
        );
        onError("requires_action");
      } else {
        setErrorMsg("Payment was not completed. Please try again.");
        onError("incomplete");
      }
    } catch (err: any) {
      const msg = err?.message || "An unexpected error occurred.";
      setErrorMsg(msg);
      onError(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Stripe Payment Element */}
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <PaymentElement
          options={{
            layout: {
              type: "accordion",
              defaultCollapsed: false,
              radios: "always",
              spacedAccordionItems: true,
            },
            fields: {
              billingDetails: {
                name: "never",
                email: "never",
              },
            },
          }}
        />
      </div>

      {/* Error */}
      {errorMsg && (
        <div className="flex items-start gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          <span className="mt-0.5 shrink-0">⚠️</span>
          <p>{errorMsg}</p>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isProcessing || !stripe}
        className="flex h-13 w-full items-center justify-center gap-2.5 rounded-xl bg-[#274877] text-base font-semibold text-white shadow-md transition hover:bg-[#1f3a60] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Processing payment...
          </>
        ) : (
          <>
            <Lock className="h-4 w-4" />
            Pay ${amount.toFixed(2)} Securely
          </>
        )}
      </button>

      {/* Trust badge */}
      <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
        <ShieldCheck className="h-3.5 w-3.5" />
        <span>Payments processed securely by Stripe. Card details never touch our servers.</span>
      </div>
    </form>
  );
}
