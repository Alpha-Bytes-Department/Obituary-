import LoginForm from "./LoginForm";

/**
 * Composes the login page content.
 *
 * @returns {JSX.Element} The login container.
 */
export default function LoginContainer() {
  return (
    <section className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
      <div className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
          Welcome back
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-slate-950">
          Sign in to manage memorials and requests.
        </h1>
        <p className="max-w-xl text-base leading-7 text-slate-600">
          Use the mock shell to verify routing, validation, and state handling
          before backend integration.
        </p>
      </div>
      <LoginForm />
    </section>
  );
}
