"use client";

import { useEffect, useState } from "react";
import { useAxios } from "../../../context/AxiosProvider";
import { toast } from "sonner";
import { Trash2, Heart, DollarSign, Users, TrendingUp } from "lucide-react";

interface Donation {
  _id: string;
  memorialId: string;
  memorialName: string;
  donorName: string;
  donorEmail: string;
  amount: number;
  currency: string;
  message?: string;
  status: string;
  createdAt: string;
}

interface Stats {
  count: number;
  total: number;
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export default function DonationsManagement() {
  const api = useAxios();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [stats, setStats] = useState<Stats>({ count: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchDonations = async () => {
    try {
      const res = await api.get("/admin/donations");
      setDonations(res.data.donations || []);
      setStats(res.data.stats || { count: 0, total: 0 });
    } catch (err) {
      toast.error("Failed to load donations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDonations(); }, [api]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this donation record?")) return;
    try {
      await api.delete(`/admin/donations/${id}`);
      setDonations((prev) => prev.filter((d) => d._id !== id));
      toast.success("Donation record deleted");
    } catch {
      toast.error("Failed to delete donation");
    }
  };

  const filtered = donations.filter((d) => {
    const q = search.toLowerCase();
    return (
      d.donorName.toLowerCase().includes(q) ||
      d.donorEmail.toLowerCase().includes(q) ||
      (d.memorialName || "").toLowerCase().includes(q)
    );
  });

  if (loading) return <div className="p-8 text-center text-slate-500">Loading donations...</div>;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-semibold text-[#1e3a5f]">Donation History</h1>
        <p className="mt-1 text-sm text-slate-500">All donations submitted through memorial pages.</p>
      </div>

      {/* STATS */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-4 rounded-xl border border-[#ece6dd] bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pink-100">
            <Heart className="h-6 w-6 text-pink-500" />
          </div>
          <div>
            <p className="text-sm text-slate-500">Total Donations</p>
            <p className="text-2xl font-bold text-[#1e3a5f]">{stats.count}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-xl border border-[#ece6dd] bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <DollarSign className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-slate-500">Total Raised</p>
            <p className="text-2xl font-bold text-[#1e3a5f]">${stats.total.toFixed(2)}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-xl border border-[#ece6dd] bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <TrendingUp className="h-6 w-6 text-blue-500" />
          </div>
          <div>
            <p className="text-sm text-slate-500">Average Donation</p>
            <p className="text-2xl font-bold text-[#1e3a5f]">
              ${stats.count ? (stats.total / stats.count).toFixed(2) : "0.00"}
            </p>
          </div>
        </div>
      </div>

      {/* SEARCH */}
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by donor name, email, or memorial..."
          className="w-full max-w-md rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-[#1e3a5f]"
        />
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-xl border border-[#ece6dd] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#f8f3ec] text-[#7b6a58]">
              <tr>
                <th className="px-5 py-4 font-medium">Donor</th>
                <th className="px-5 py-4 font-medium">Email</th>
                <th className="px-5 py-4 font-medium">Memorial</th>
                <th className="px-5 py-4 font-medium">Amount</th>
                <th className="px-5 py-4 font-medium">Message</th>
                <th className="px-5 py-4 font-medium">Date</th>
                <th className="px-5 py-4 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ece6dd]">
              {filtered.map((donation) => (
                <tr key={donation._id} className="transition hover:bg-slate-50">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1e3a5f] text-xs font-bold text-white">
                        {donation.donorName.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-[#1e3a5f]">{donation.donorName}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-[#626262] text-xs">{donation.donorEmail}</td>
                  <td className="px-5 py-4 text-[#626262] text-xs">
                    {donation.memorialName || (
                      <span className="italic text-slate-400">Unknown</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-bold text-green-800">
                      ${donation.amount.toFixed(2)} {donation.currency}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-[#626262] text-xs max-w-[200px]">
                    <p className="line-clamp-2">{donation.message || <span className="italic text-slate-400">—</span>}</p>
                  </td>
                  <td className="px-5 py-4 text-[#626262] text-xs whitespace-nowrap">
                    {formatDate(donation.createdAt)}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => handleDelete(donation._id)}
                      className="rounded-md border border-red-200 bg-red-50 p-1.5 text-red-600 transition hover:bg-red-100"
                      title="Delete record">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-slate-400">
                    <Heart className="mx-auto mb-3 h-8 w-8 opacity-30" />
                    <p>{search ? "No donations match your search." : "No donations yet."}</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
