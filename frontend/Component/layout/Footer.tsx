/**
 * Renders the application footer.
 *
 * @returns {JSX.Element} The footer.
 */
export default function Footer() {
  return (
    <footer className="border-t border-black/5 bg-white/80">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-6 text-sm text-slate-500 sm:px-6 lg:px-8 sm:flex-row sm:items-center sm:justify-between">
        <p>Memorials & Obituaries Platform</p>
        <p>
          Built for fast discovery, respectful remembrance, and low-friction
          browsing.
        </p>
      </div>
    </footer>
  );
}
