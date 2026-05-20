"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const registerSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters."),
    lastName: z.string().min(2, "Last name must be at least 2 characters."),
    email: z.string().email("Enter a valid email address."),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string().min(8, "Confirm your password."),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

/**
 * Renders the register form with client-side validation.
 *
 * @returns {JSX.Element} The register form.
 */
export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = handleSubmit(async () => {
    window.alert("Registered (mock)");
  });

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 rounded-3xl border border-black/5 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)]"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            className="mb-2 block text-sm font-medium text-slate-700"
            htmlFor="firstName"
          >
            First name
          </label>
          <input
            id="firstName"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-400"
            {...register("firstName")}
          />
          {errors.firstName ? (
            <p className="mt-2 text-sm text-red-600">
              {errors.firstName.message}
            </p>
          ) : null}
        </div>
        <div>
          <label
            className="mb-2 block text-sm font-medium text-slate-700"
            htmlFor="lastName"
          >
            Last name
          </label>
          <input
            id="lastName"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-400"
            {...register("lastName")}
          />
          {errors.lastName ? (
            <p className="mt-2 text-sm text-red-600">
              {errors.lastName.message}
            </p>
          ) : null}
        </div>
      </div>

      <div>
        <label
          className="mb-2 block text-sm font-medium text-slate-700"
          htmlFor="email"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-400"
          {...register("email")}
        />
        {errors.email ? (
          <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            className="mb-2 block text-sm font-medium text-slate-700"
            htmlFor="password"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-400"
            {...register("password")}
          />
          {errors.password ? (
            <p className="mt-2 text-sm text-red-600">
              {errors.password.message}
            </p>
          ) : null}
        </div>
        <div>
          <label
            className="mb-2 block text-sm font-medium text-slate-700"
            htmlFor="confirmPassword"
          >
            Confirm password
          </label>
          <input
            id="confirmPassword"
            type="password"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-400"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword ? (
            <p className="mt-2 text-sm text-red-600">
              {errors.confirmPassword.message}
            </p>
          ) : null}
        </div>
      </div>

      <button
        disabled={isSubmitting}
        className="w-full rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        type="submit"
      >
        Create account
      </button>
    </form>
  );
}
