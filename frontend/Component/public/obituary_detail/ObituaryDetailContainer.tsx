import { mockObituaries } from "../../../lib/mockData";

import ImageSlider from "./ImageSlider";
import CondolenceSection from "./CondolenceSection";
import FamilyTreeVisualizer from "./FamilyTreeVisualizer";

interface ObituaryDetailContainerProps {
  id: string;
}

/**
 * Renders the obituary detail page.
 *
 * @param {ObituaryDetailContainerProps} props - Component props.
 * @returns {JSX.Element} The obituary detail view.
 */
export default function ObituaryDetailContainer({
  id,
}: ObituaryDetailContainerProps) {
  const item = mockObituaries.find((entry) => entry.id === id);

  if (!item) {
    return (
      <div className="rounded-2xl border border-black/5 bg-white p-6 text-slate-600">
        Not found
      </div>
    );
  }

  return (
    <main className="space-y-10">
      <section className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
          Memorial detail
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-slate-950">
          {item.deceasedFirstName} {item.deceasedLastName}
        </h1>
        <p className="max-w-3xl text-base leading-7 text-slate-600">
          {item.excerpt}
        </p>
      </section>

      <ImageSlider images={item.images} />

      <section className="grid gap-8 lg:grid-cols-[1.4fr_0.9fr]">
        <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
          <h2 className="text-xl font-semibold tracking-tight text-slate-950">
            Biography
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            {item.excerpt}
          </p>
        </div>

        <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
          <h2 className="text-xl font-semibold tracking-tight text-slate-950">
            Family tree
          </h2>
          <FamilyTreeVisualizer relations={item.familyTree ?? []} />
        </div>
      </section>

      <CondolenceSection obituaryId={id} />
    </main>
  );
}
