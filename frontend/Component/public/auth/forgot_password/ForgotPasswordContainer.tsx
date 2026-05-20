import ForgotPasswordForm from "./ForgotPasswordForm";

/**
 * Composes the forgot password page content.
 *
 * @returns {JSX.Element} The forgot password container.
 */
export default function ForgotPasswordContainer() {
  return (
    <section className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
      <div className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
          Reset access
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-slate-950">
          Request a secure reset link.
        </h1>
        <p className="max-w-xl text-base leading-7 text-slate-600">
          This mock flow keeps the route ready for the backend password reset
          workflow later in the plan.
        </p>
      </div>
      <ForgotPasswordForm />
    </section>
  );
}
