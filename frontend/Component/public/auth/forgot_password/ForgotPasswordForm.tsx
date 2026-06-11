"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useAxios } from "../../../../context/AxiosProvider";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email address."),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

/**
 * Renders the forgot password form with client-side validation.
 *
 * @returns {JSX.Element} The forgot password form.
 */
export default function ForgotPasswordForm() {
  const api = useAxios();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await api.post("/auth/forgot-password", {
        email: data.email,
      });
      toast.success(response.data.message || "Reset link sent to your email!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send reset link");
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
          htmlFor="email"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-400"
          placeholder="you@example.com"
          {...register("email")}
        />
        {errors.email ? (
          <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
        ) : null}
      </div>

      <button
        disabled={isSubmitting}
        className="w-full rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        type="submit"
      >
        Send reset link
      </button>
    </form>
  );
}
