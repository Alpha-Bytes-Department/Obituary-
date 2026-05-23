"use client";

/**
 * Renders the dashboard summary cards.
 *
 * @param {object} props - Component props.
 * @param {number} props.total - Total memorials count.
 * @param {number} props.approved - Approved memorials count.
 * @param {number} props.pending - Pending memorials count.
 * @param {number} props.rejected - Rejected memorials count.
 * @returns {JSX.Element} The summary card grid.
 */
export default function DashboardStatsGrid({
  total,
  approved,
  pending,
  rejected,
}: {
  total: number;
  approved: number;
  pending: number;
  rejected: number;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <DashboardStatCard label="Total Memorials" value={total} tone="default" />
      <DashboardStatCard label="Approved" value={approved} tone="success" />
      <DashboardStatCard label="Pending" value={pending} tone="warning" />
      <DashboardStatCard label="Rejected" value={rejected} tone="danger" />
    </div>
  );
}

/**
 * Renders a dashboard summary card.
 *
 * @param {object} props - Component props.
 * @param {string} props.label - The card label.
 * @param {number} props.value - The card value.
 * @param {"default" | "success" | "warning" | "muted" | "danger"} props.tone - Visual tone.
 * @returns {JSX.Element} The stat card.
 */
function DashboardStatCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "default" | "success" | "warning" | "muted" | "danger";
}) {
  const toneClassName =
    tone === "success"
      ? "text-[#2d6b35]"
      : tone === "warning"
        ? "text-[#9a6a15]"
        : tone === "danger"
          ? "text-[#b32424]"
          : tone === "muted"
            ? "text-[#5c6470]"
            : "text-[#233a60]";

  return (
    <div className="rounded-md border border-[#e5dfd7] bg-white p-4 shadow-[0_4px_14px_rgba(15,23,42,0.04)]">
      <p className={`text-2xl font-semibold ${toneClassName}`}>{value}</p>
      <p className="mt-1 text-sm text-[#7a736c]">{label}</p>
    </div>
  );
}
