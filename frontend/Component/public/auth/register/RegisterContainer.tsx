import RegisterForm from "./RegisterForm";

/**
 * Composes the register page content.
 *
 * @returns {JSX.Element} The register container.
 */
export default function RegisterContainer() {
  return (
    <section className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
      <div className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
          Create account
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-slate-950">
          Register to publish, save, and support memorial pages.
        </h1>
        <p className="max-w-xl text-base leading-7 text-slate-600">
          The form uses zod validation so the UI stays responsive and avoids
          unnecessary requests.
        </p>
      </div>
      <RegisterForm />
    </section>
  );
}
