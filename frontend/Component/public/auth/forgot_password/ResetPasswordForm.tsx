"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { useAxios } from "../../../../context/AxiosProvider";

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string().min(8, "Confirm password must be at least 8 characters."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

interface ResetPasswordFormProps {
  userId: string;
  token: string;
}

export default function ResetPasswordForm({ userId, token }: ResetPasswordFormProps) {
  const router = useRouter();
  const api = useAxios();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await api.post(`/auth/reset-password/${userId}/${token}`, {
        password: data.password,
        confirmPassword: data.confirmPassword,
      });

      toast.success(response.data.message || "Password reset successfully!");
      router.replace("/login");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    }
  });

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 rounded-3xl border border-black/5 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)]"
    >
      <div>
        <label
          className="mb-2 block text-sm font-medium text-slate-700"
          htmlFor="password"
        >
          New Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 pr-12 outline-none transition focus:border-slate-400"
            placeholder="Enter new password"
            {...register("password")}
          />
          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((value) => !value)}
            className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-slate-400 transition hover:text-slate-600"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
        {errors.password ? (
          <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
        ) : null}
      </div>

      <div>
        <label
          className="mb-2 block text-sm font-medium text-slate-700"
          htmlFor="confirmPassword"
        >
          Confirm Password
        </label>
        <div className="relative">
          <input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 pr-12 outline-none transition focus:border-slate-400"
            placeholder="Confirm new password"
            {...register("confirmPassword")}
          />
          <button
            type="button"
            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            onClick={() => setShowConfirmPassword((value) => !value)}
            className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-slate-400 transition hover:text-slate-600"
          >
            {showConfirmPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
        {errors.confirmPassword ? (
          <p className="mt-2 text-sm text-red-600">{errors.confirmPassword.message}</p>
        ) : null}
      </div>

      <button
        disabled={isSubmitting}
        className="mt-6 w-full rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        type="submit"
      >
        Reset Password
      </button>
    </form>
  );
}
