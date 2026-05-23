"use client";

import { useEffect, useState } from "react";
import { Copy } from "lucide-react";
import { toast } from "sonner";

import { Button } from "../../../components/ui/button";

/**
 * Renders the coupon application button and the post-submission eligibility card.
 *
 * @returns {JSX.Element} The coupon status card.
 */
export default function CouponStatusCard() {
  const [couponRippleKey, setCouponRippleKey] = useState(0);
  const [couponSubmitted, setCouponSubmitted] = useState(false);
  const [showCouponButton, setShowCouponButton] = useState(true);
  const couponCode = "XYZ-2046";

  useEffect(() => {
    if (!couponSubmitted) {
      setShowCouponButton(true);
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setShowCouponButton(false);
    }, 320);

    return () => window.clearTimeout(timer);
  }, [couponSubmitted]);

  /**
   * Submits the coupon request and reveals the eligibility card.
   *
   * @returns {void}
   */
  const handleCouponRequest = () => {
    setCouponRippleKey((value) => value + 1);
    setCouponSubmitted(true);
    toast.success("Your application for free coupon is submitted.");
  };

  /**
   * Copies the coupon code to the clipboard.
   *
   * @returns {Promise<void>} Resolves once the code is copied.
   */
  const copyCouponCode = async () => {
    try {
      await navigator.clipboard.writeText(couponCode);
      toast.success("Coupon code copied to clipboard.");
    } catch {
      toast.error("Unable to copy coupon code right now.");
    }
  };

  return (
    <div className="space-y-4  ">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-heading text-[1.7rem] tracking-[-0.03em] text-[#2b2621]">
            My Dashboard
          </h2>
          <p className="mt-1 text-[0.95rem] text-[#7c746b]">
            Manage your memorial submissions
          </p>
        </div>

        {showCouponButton ? (
          <Button
            type="button"
            onClick={handleCouponRequest}
            className={`relative h-11 overflow-hidden rounded-md bg-[#233f68] px-5 text-[0.95rem] font-medium text-white shadow-[0_8px_18px_rgba(35,63,104,0.2)] transition-all duration-500 ease-out hover:-translate-y-0.5 hover:bg-[#1b3254] active:scale-[0.98] ${
              couponSubmitted
                ? "pointer-events-none translate-y-2 scale-95 opacity-0"
                : "opacity-100"
            }`}
          >
            <span
              key={couponRippleKey}
              aria-hidden="true"
              className="absolute inset-0 rounded-[inherit] bg-white/20 animate-waterdrop"
            />
            <span className="relative">Apply for free Coupon</span>
          </Button>
        ) : null}
      </div>

      {couponSubmitted ? (
        <div className="rounded-md border border-[#e8d68f] bg-[#fff9dd] p-4 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="text-[0.85rem] font-semibold uppercase tracking-[0.18em] text-[#9a6a15]">
                Coupon status updated
              </p>
              <h3 className="text-[1.15rem] font-semibold text-[#5f4608]">
                You are eligible for a free coupon.
              </h3>
              <p className="text-[0.95rem] text-[#6f5612]">
                Your coupon is{" "}
                <span className="font-semibold">{couponCode}</span>.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-md border border-[#d8c56d] bg-white px-4 py-2 text-sm font-semibold tracking-[0.18em] text-[#8f6410]">
                {couponCode}
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={copyCouponCode}
                className="border-[#d8c56d] bg-white text-[#8a6215] hover:bg-[#fff6cf]"
              >
                <Copy className="h-4 w-4" />
                Copy
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
