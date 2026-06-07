"use client";

import { useEffect, useState } from "react";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { useAxios } from "../../../context/AxiosProvider";
import { useAppContext } from "../../../context/AppContext";
import { Button } from "../../../components/ui/button";

/**
 * Renders the coupon application button and the post-submission eligibility card.
 *
 * @returns {JSX.Element} The coupon status card.
 */
export default function CouponStatusCard() {
  const { user, setSession, accessToken, refreshToken } = useAppContext();
  const api = useAxios();
  const [couponRippleKey, setCouponRippleKey] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const tokenApplied = user?.tokenApplied;
  const tokenApproved = user?.tokenApproveStatus;
  const couponCode = user?.token || "";

  const handleCouponRequest = async () => {
    setCouponRippleKey((value) => value + 1);
    setIsSubmitting(true);
    try {
      const res = await api.post("/profile/apply-token");
      if (user && accessToken && refreshToken) {
        setSession({ ...user, tokenApplied: true }, accessToken, refreshToken);
      }
      toast.success("Your application for free coupon is submitted.");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to apply for coupon");
    } finally {
      setIsSubmitting(false);
    }
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

        {!tokenApplied ? (
          <Button
            type="button"
            onClick={handleCouponRequest}
            disabled={isSubmitting}
            className={`relative h-11 overflow-hidden rounded-md bg-[#233f68] px-5 text-[0.95rem] font-medium text-white shadow-[0_8px_18px_rgba(35,63,104,0.2)] transition-all duration-500 ease-out hover:-translate-y-0.5 hover:bg-[#1b3254] active:scale-[0.98] disabled:opacity-50`}
          >
            <span
              key={couponRippleKey}
              aria-hidden="true"
              className="absolute inset-0 rounded-[inherit] bg-white/20 animate-waterdrop"
            />
            <span className="relative">{isSubmitting ? "Applying..." : "Apply for free Coupon"}</span>
          </Button>
        ) : null}
      </div>

      {tokenApplied && !tokenApproved ? (
        <div className="rounded-md border border-[#e8d68f] bg-[#fff9dd] p-4 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="text-[0.85rem] font-semibold uppercase tracking-[0.18em] text-[#9a6a15]">
                Coupon status: Pending
              </p>
              <h3 className="text-[1.15rem] font-semibold text-[#5f4608]">
                Your application is pending admin approval.
              </h3>
            </div>
          </div>
        </div>
      ) : null}

      {tokenApproved ? (
        <div className="rounded-md border border-[#9edb8f] bg-[#f0ffed] p-4 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="text-[0.85rem] font-semibold uppercase tracking-[0.18em] text-[#1c6a15]">
                Coupon status updated
              </p>
              <h3 className="text-[1.15rem] font-semibold text-[#185f08]">
                You are eligible for a free submission.
              </h3>
              <p className="text-[0.95rem] text-[#1a6f12]">
                Your token is{" "}
                <span className="font-semibold">{couponCode}</span>.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-md border border-[#8cd86d] bg-white px-4 py-2 text-sm font-semibold tracking-[0.18em] text-[#188f10]">
                {couponCode}
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={copyCouponCode}
                className="border-[#8cd86d] bg-white text-[#188a15] hover:bg-[#e0ffcf]"
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
