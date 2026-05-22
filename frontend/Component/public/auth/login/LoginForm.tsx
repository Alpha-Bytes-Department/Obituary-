"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

/**
 * Renders the login form with client-side validation.
 *
 * @returns {JSX.Element} The login form.
 */
export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: true },
  });

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = handleSubmit(async (data) => {
    console.log(data);
  });

  return (
    <form
      onSubmit={onSubmit}
      className="mt-8 w-full rounded-[18px] border border-[#e8e2db] bg-white px-6 py-7 text-left shadow-[0_1px_3px_rgba(15,23,42,0.03),0_10px_30px_rgba(15,23,42,0.05)] sm:px-7"
      style={{ maxWidth: 470 }}
    >
      <div className="space-y-2">
        <label
          className="block text-[0.95rem] font-semibold text-[#2f2c29]"
          htmlFor="email"
        >
          Email Address
        </label>
        <input
          id="email"
          type="email"
          className="h-12 w-full rounded-[10px] border border-[#e6e1da] bg-white px-4 text-[0.98rem] text-[#2f2c29] outline-none transition placeholder:text-[#b2ada7] focus:border-[#b4aba1]"
          placeholder="your@email.com"
          {...register("email")}
        />
        {errors.email ? (
          <p className="text-sm text-red-600">{errors.email.message}</p>
        ) : null}
      </div>

      <div className="mt-5 space-y-2">
        <label
          className="block text-[0.95rem] font-semibold text-[#2f2c29]"
          htmlFor="password"
        >
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            className="h-12 w-full rounded-[10px] border border-[#e6e1da] bg-white px-4 pr-12 text-[0.98rem] text-[#2f2c29] outline-none transition placeholder:text-[#b2ada7] focus:border-[#b4aba1]"
            placeholder="Enter your password"
            {...register("password")}
          />
          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((value) => !value)}
            className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-[#b9b0a6] transition hover:text-[#7c746c]"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
        {errors.password ? (
          <p className="text-sm text-red-600">{errors.password.message}</p>
        ) : null}
      </div>

      <div className="mt-5 flex items-center justify-between gap-4">
        <label className="flex items-center gap-2 text-[0.92rem] text-[#4a4743]">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-[#9b9187] accent-[#1e3a5f]"
            {...register("rememberMe")}
          />
          Remember me
        </label>

        <Link href="/forgot-password" className="text-[0.92rem] text-[#1e3a5f]">
          Forgot password?
        </Link>
      </div>

      <button
        disabled={isSubmitting}
        className="mt-6 h-12 w-full rounded-[8px] bg-[#1e3a5f] text-[0.98rem] font-medium text-white transition hover:bg-[#17304f] disabled:cursor-not-allowed disabled:opacity-60"
        type="submit"
      >
        Sign In
      </button>

      <p className="mt-5 text-center text-[0.95rem] text-[#7c7c7c]">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-medium text-[#1e3a5f]">
          Create one
        </Link>
      </p>
    </form>
  );
}
