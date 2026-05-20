"use client";

import { useMemo, useState } from "react";
import type { FormEvent } from "react";

import { mockCondolences } from "@/lib/mockData";

interface CondolenceSectionProps {
  obituaryId: string;
}

/**
 * Renders the condolence composer and list.
 *
 * @param {CondolenceSectionProps} props - Component props.
 * @returns {JSX.Element} The condolences area.
 */
export default function CondolenceSection({
  obituaryId,
}: CondolenceSectionProps) {
  const [list, setList] = useState(() =>
    mockCondolences.filter(
      (condolence) => condolence.obituaryId === obituaryId,
    ),
  );
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [mode, setMode] = useState<"message" | "candle">("message");

  const heading = useMemo(
    () => (mode === "message" ? "Leave a condolence" : "Light a candle"),
    [mode],
  );

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setList((current) => [
      {
        id: Date.now().toString(),
        obituaryId,
        name,
        message:
          mode === "candle"
            ? "A candle has been lit in their memory."
            : message,
      },
      ...current,
    ]);

    setName("");
    setMessage("");
  };

  return (
    <section className="rounded-3xl border border-black/5 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
            Condolences
          </p>
          <h3 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">
            {heading}
          </h3>
        </div>
        <div className="inline-flex rounded-full bg-slate-100 p-1 text-sm">
          <button
            type="button"
            onClick={() => setMode("message")}
            className={`rounded-full px-4 py-2 font-medium transition ${mode === "message" ? "bg-slate-950 text-white" : "text-slate-600"}`}
          >
            Normal Message
          </button>
          <button
            type="button"
            onClick={() => setMode("candle")}
            className={`rounded-full px-4 py-2 font-medium transition ${mode === "candle" ? "bg-slate-950 text-white" : "text-slate-600"}`}
          >
            Light a Candle
          </button>
        </div>
      </div>

      <form onSubmit={onSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
        <div>
          <label
            className="mb-2 block text-sm font-medium text-slate-700"
            htmlFor="name"
          >
            Name
          </label>
          <input
            id="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Your name"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-400"
            required
          />
        </div>
        {mode === "message" ? (
          <div className="md:col-span-2">
            <label
              className="mb-2 block text-sm font-medium text-slate-700"
              htmlFor="message"
            >
              Message
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Write a respectful message"
              className="min-h-32 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-400"
              required
            />
          </div>
        ) : (
          <div className="md:col-span-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            A candle will be added as a quiet tribute.
          </div>
        )}
        <div className="md:col-span-2">
          <button
            type="submit"
            className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Submit tribute
          </button>
        </div>
      </form>

      <div className="mt-8 space-y-3">
        {list.map((condolence) => (
          <article
            key={condolence.id}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
          >
            <p className="font-medium text-slate-950">{condolence.name}</p>
            <p className="text-sm text-slate-600">{condolence.message}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
