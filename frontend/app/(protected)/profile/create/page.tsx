/**
 * Wrapper for the obituary creation route.
 *
 * @returns {JSX.Element} A placeholder creation page.
 */
export default function CreateObituaryPage() {
  return (
    <section className="rounded-3xl border border-black/5 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
        Create obituary
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
        Creation flow arrives in Phase 2.
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
        This route is wired now so the app shell can be validated before the
        multi-step form is added.
      </p>
    </section>
  );
}
