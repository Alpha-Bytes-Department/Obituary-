import type { FamilyRelation } from "@/lib/mockData";

interface FamilyTreeVisualizerProps {
  relations: FamilyRelation[];
}

/**
 * Renders a compact family tree visualizer.
 *
 * @param {FamilyTreeVisualizerProps} props - Component props.
 * @returns {JSX.Element} The family tree visualization.
 */
export default function FamilyTreeVisualizer({
  relations,
}: FamilyTreeVisualizerProps) {
  if (relations.length === 0) {
    return (
      <p className="mt-4 text-sm text-slate-500">
        No family tree data available.
      </p>
    );
  }

  return (
    <div className="mt-4 space-y-3">
      {relations.map((relation) => (
        <div
          key={`${relation.name}-${relation.relation}`}
          className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
        >
          <div>
            <p className="font-medium text-slate-950">{relation.name}</p>
            <p className="text-sm text-slate-500">{relation.relation}</p>
          </div>
          <span className="text-xs uppercase tracking-[0.24em] text-slate-400">
            Family
          </span>
        </div>
      ))}
    </div>
  );
}
