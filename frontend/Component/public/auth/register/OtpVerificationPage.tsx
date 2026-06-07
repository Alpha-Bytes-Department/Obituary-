"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  clearPendingSignup,
  getPendingSignup,
} from "../../../../lib/registerFlow";
import useAuth from "../../../../hooks/useAuth";
import { useAxios } from "../../../../context/AxiosProvider";
import { toast } from "sonner";

const OTP_LENGTH = 6;

/**
 * Renders the verification step for the signup flow.
 *
 * @returns {JSX.Element} The OTP verification page.
 */
export default function OtpVerificationPage() {
  const router = useRouter();
  const { setSession } = useAuth();
  const api = useAxios();
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [otp, setOtp] = useState(Array.from({ length: OTP_LENGTH }, () => ""));
  const [resendCount, setResendCount] = useState(0);
  const pendingSignup = useMemo(() => getPendingSignup(), []);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const code = otp.join("");
  const isComplete = code.length === OTP_LENGTH && otp.every(Boolean);

  const focusInput = (index: number) => {
    inputRefs.current[index]?.focus();
  };

  const handleDigitChange = (index: number, value: string) => {
    const nextValue = value.replace(/\D/g, "").slice(-1);

    setOtp((current) => {
      const nextOtp = [...current];
      nextOtp[index] = nextValue;
      return nextOtp;
    });

    if (nextValue && index < OTP_LENGTH - 1) {
      focusInput(index + 1);
    }
  };

  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      focusInput(index - 1);
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();

    const pastedDigits = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);

    if (!pastedDigits) {
      return;
    }

    const nextOtp = Array.from(
      { length: OTP_LENGTH },
      (_, index) => pastedDigits[index] ?? "",
    );
    setOtp(nextOtp);
    focusInput(Math.min(pastedDigits.length, OTP_LENGTH - 1));
  };

  const handleContinue = async () => {
    if (!isComplete) {
      return;
    }

    if (!pendingSignup?.email) {
      toast.error("No pending registration found. Please register again.");
      return;
    }

    try {
      setIsVerifying(true);
      const response = await api.post("/auth/verify-registration", {
        email: pendingSignup.email,
        otp: code,
      });

      const { user, accessToken, refreshToken } = response.data;

      setSession(
        {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          userImage: user.profilePhotoUrl || "/Source/person.jpg",
          role: user.role,
          tokenApplied: user.tokenApplied,
          tokenApproveStatus: user.tokenApproveStatus,
          token: user.token,
          funeralHome: user.funeralHome,
        },
        accessToken,
        refreshToken,
      );

      clearPendingSignup();
      toast.success("Registration successful!");
      router.replace("/");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Verification failed");
      setOtp(Array.from({ length: OTP_LENGTH }, () => ""));
      focusInput(0);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <section className="flex min-h-[calc(100vh-8rem)] items-start justify-center px-4 py-12 sm:py-16">
      <div className="w-full max-w-130 rounded-[18px] border border-[#ece6dd] bg-white px-5 py-7 shadow-[0_4px_18px_rgba(15,23,42,0.08)] sm:px-8 sm:py-8">
        <h1 className="text-[2rem] font-semibold tracking-[-0.03em] text-[#222]">
          Verification
        </h1>
        <p className="mt-3 max-w-lg text-[1rem] leading-7 text-[#6d7480]">
          Enter the OTP sent to your email to verify your identity. Once
          verified, you can proceed to sign up.
        </p>

        <div className="mt-8 flex justify-center gap-3 sm:gap-4">
          {otp.map((digit, index) => (
            <input
              key={`otp-${index}`}
              ref={(element) => {
                inputRefs.current[index] = element;
              }}
              value={digit}
              onChange={(event) => handleDigitChange(index, event.target.value)}
              onKeyDown={(event) => handleKeyDown(index, event)}
              onPaste={handlePaste}
              inputMode="numeric"
              autoComplete="one-time-code"
              aria-label={`OTP digit ${index + 1}`}
              className="h-12 w-12 rounded-[10px] border border-[#c9823d] bg-white text-center text-[1.05rem] font-medium text-[#222] outline-none transition focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/15 sm:h-[3.1rem] sm:w-[3.1rem]"
            />
          ))}
        </div>

        <p className="mt-8 text-center text-[0.98rem] text-[#4e5561]">
          Haven’t received the code?{" "}
          <button
            type="button"
            onClick={() => {
              setResendCount((value) => value + 1);
              setOtp(Array.from({ length: OTP_LENGTH }, () => ""));
              focusInput(0);
            }}
            className="font-semibold text-[#24467c] transition hover:text-[#17365f]"
          >
            Resend
          </button>
        </p>

        <button
          type="button"
          onClick={handleContinue}
          disabled={!isComplete || isVerifying}
          className="mt-8 h-12 w-full rounded-[10px] bg-[#233f68] text-[1rem] font-semibold text-white transition hover:bg-[#17365f] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isVerifying ? "Verifying..." : "Continue"}
        </button>

        <p className="mt-4 text-center text-xs text-[#8b8f96]">
          Verification attempts refreshed {resendCount} time
          {resendCount === 1 ? "" : "s"}.
        </p>
      </div>
    </section>
  );
}
