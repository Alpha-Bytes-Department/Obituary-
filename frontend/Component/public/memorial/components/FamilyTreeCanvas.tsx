"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import Label from "./Label";
import TextInput from "./TextInput";

export type BranchSide = "left" | "right";

export type FamilyMember = {
  id: string;
  name: string;
  relation: string;
  side: BranchSide;
};

export default function FamilyTreeCanvas({
  familyTree,
  onAddMember,
  onRemoveMember,
}: {
  familyTree: FamilyMember[];
  onAddMember: (member: Omit<FamilyMember, "id">) => void;
  onRemoveMember: (id: string) => void;
}) {
  const [name, setName] = useState("");
  const [relation, setRelation] = useState("");
  const [side, setSide] = useState<BranchSide>("left");

  const leftBranch = familyTree.filter((member) => member.side === "left");
  const rightBranch = familyTree.filter((member) => member.side === "right");

  const handleAdd = () => {
    if (!name.trim() || !relation.trim()) return;
    onAddMember({ name: name.trim(), relation: relation.trim(), side });
    setName("");
    setRelation("");
    setSide("left");
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-3 md:grid-cols-[1.1fr_0.9fr_0.8fr]">
        <div>
          <Label>Name</Label>
          <TextInput value={name} onChange={setName} placeholder="Enter name" />
        </div>
        <div>
          <Label>Relation</Label>
          <TextInput
            value={relation}
            onChange={setRelation}
            placeholder="Enter relation"
          />
        </div>
        <div>
          <Label>Branch</Label>
          <select
            value={side}
            onChange={(event) => setSide(event.target.value as BranchSide)}
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#274877]"
          >
            <option value="left">Left branch</option>
            <option value="right">Right branch</option>
          </select>
        </div>
      </div>

      <button
        type="button"
        onClick={handleAdd}
        className="inline-flex items-center gap-2 rounded-lg bg-[#274877] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1f3a60]"
      >
        <Plus className="h-4 w-4" />
        Add Family Member
      </button>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 p-4 sm:p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="flex justify-center">
            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-4 text-center shadow-sm">
              <p className="text-sm font-medium text-slate-950">
                Root Memorial
              </p>
              <p className="text-xs text-slate-500">
                The life being remembered
              </p>
            </div>
          </div>

          <div className="mx-auto h-8 w-px bg-[#274877]" />

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-[#274877] shadow-sm">
                Left branch
              </div>
              <div className="space-y-3">
                {leftBranch.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
                  >
                    <div>
                      <p className="font-medium text-slate-950">
                        {member.name}
                      </p>
                      <p className="text-sm text-slate-500">
                        {member.relation}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemoveMember(member.id)}
                      className="text-xs uppercase tracking-[0.18em] text-slate-400 transition hover:text-slate-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-[#274877] shadow-sm">
                Right branch
              </div>
              <div className="space-y-3">
                {rightBranch.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
                  >
                    <div>
                      <p className="font-medium text-slate-950">
                        {member.name}
                      </p>
                      <p className="text-sm text-slate-500">
                        {member.relation}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemoveMember(member.id)}
                      className="text-xs uppercase tracking-[0.18em] text-slate-400 transition hover:text-slate-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
