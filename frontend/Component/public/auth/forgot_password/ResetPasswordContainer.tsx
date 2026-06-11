import ResetPasswordForm from "./ResetPasswordForm";

interface ResetPasswordContainerProps {
  userId: string;
  token: string;
}

/**
 * Composes the reset password page content.
 *
 * @returns {JSX.Element} The reset password container.
 */
export default function ResetPasswordContainer({ userId, token }: ResetPasswordContainerProps) {
  return (
    <section className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
      <div className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
          Set new password
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-slate-950">
          Create a strong password.
        </h1>
        <p className="max-w-xl text-base leading-7 text-slate-600">
          Please enter your new password below. Make sure it is at least 8 characters long.
        </p>
      </div>
      <ResetPasswordForm userId={userId} token={token} />
    </section>
  );
}
