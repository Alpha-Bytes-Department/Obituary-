"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import { Button } from "../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { buildDraft } from "./data";
import type { MemorialSubmission, SubmissionDraft } from "./types";

/**
 * Renders the memorial edit dialog.
 *
 * @param {object} props - Component props.
 * @param {MemorialSubmission | null} props.submission - The selected submission.
 * @param {(submission: SubmissionDraft) => void} props.onSave - Persists the updated data.
 * @param {() => void} props.onClose - Closes the dialog.
 * @returns {JSX.Element} The edit modal.
 */
export default function SubmissionEditDialog({
  submission,
  onSave,
  onClose,
}: {
  submission: MemorialSubmission | null;
  onSave: (submission: SubmissionDraft) => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState<SubmissionDraft | null>(null);
  const [activeTab, setActiveTab] = useState<"general" | "content">("general");

  useEffect(() => {
    setDraft(submission ? buildDraft(submission) : null);
  }, [submission]);

  /**
   * Updates a single field within the edit draft.
   *
   * @param {keyof SubmissionDraft} key - The field key.
   * @param {string} value - The field value.
   * @returns {void}
   */
  const updateField = (key: keyof SubmissionDraft, value: string) => {
    setDraft((current) => (current ? { ...current, [key]: value } : current));
  };

  return (
    <Dialog
      open={Boolean(submission)}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent className="w-[calc(100%-1rem)] max-w-4xl p-0 sm:max-w-4xl">
        <div className="max-h-[90vh] overflow-y-auto p-5 sm:p-6">
          <DialogHeader>
            <DialogTitle>Edit Memorial Submission</DialogTitle>
            <DialogDescription>
              Update the submission details below. The form is prefilled from
              the obituary record.
            </DialogDescription>
          </DialogHeader>

          {draft ? (
            <div className="mt-5">
              <div className="flex space-x-4 border-b border-[#ece5dc] mb-5">
                <button 
                  onClick={() => setActiveTab("general")} 
                  className={`pb-2 px-1 text-sm ${activeTab === "general" ? "border-b-2 border-[#233f68] font-semibold text-[#233f68]" : "text-slate-500"}`}>
                  General Info
                </button>
                <button 
                  onClick={() => setActiveTab("content")} 
                  className={`pb-2 px-1 text-sm ${activeTab === "content" ? "border-b-2 border-[#233f68] font-semibold text-[#233f68]" : "text-slate-500"}`}>
                  Memorial Content
                </button>
              </div>

              {activeTab === "general" && (
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Status">
                    <select
                      value={draft.status}
                      onChange={(event) =>
                        updateField(
                          "status",
                          event.target.value as SubmissionDraft["status"],
                        )
                      }
                      className="h-11 w-full rounded-md border border-[#ddd6cd] bg-white px-3 text-sm outline-none transition focus:border-[#233f68]"
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </Field>
                  
                  <Field label="Full Name">
                    <input
                      value={draft.name}
                      onChange={(event) =>
                        updateField("name", event.target.value)
                      }
                      className="h-11 w-full rounded-md border border-[#ddd6cd] bg-white px-3 text-sm outline-none transition focus:border-[#233f68]"
                    />
                  </Field>
                  <Field label="Relation To Deceased">
                    <input
                      value={draft.relationToDeceased}
                      onChange={(event) =>
                        updateField("relationToDeceased", event.target.value)
                      }
                      className="h-11 w-full rounded-md border border-[#ddd6cd] bg-white px-3 text-sm outline-none transition focus:border-[#233f68]"
                    />
                  </Field>
                  
                  <Field label="Location (City)">
                    <input
                      value={draft.location}
                      onChange={(event) =>
                        updateField("location", event.target.value)
                      }
                      className="h-11 w-full rounded-md border border-[#ddd6cd] bg-white px-3 text-sm outline-none transition focus:border-[#233f68]"
                    />
                  </Field>
                  <Field label="Country">
                    <input
                      value={draft.country}
                      onChange={(event) =>
                        updateField("country", event.target.value)
                      }
                      className="h-11 w-full rounded-md border border-[#ddd6cd] bg-white px-3 text-sm outline-none transition focus:border-[#233f68]"
                    />
                  </Field>

                  <Field label="Date of Birth">
                    <input
                      type="date"
                      value={draft.dateOfBirth}
                      onChange={(event) =>
                        updateField("dateOfBirth", event.target.value)
                      }
                      className="h-11 w-full rounded-md border border-[#ddd6cd] bg-white px-3 text-sm outline-none transition focus:border-[#233f68]"
                    />
                  </Field>
                  <Field label="Date of Death">
                    <input
                      type="date"
                      value={draft.dateOfDeath}
                      onChange={(event) =>
                        updateField("dateOfDeath", event.target.value)
                      }
                      className="h-11 w-full rounded-md border border-[#ddd6cd] bg-white px-3 text-sm outline-none transition focus:border-[#233f68]"
                    />
                  </Field>

                  <Field className="md:col-span-2" label="Rejection Notice (Internal)">
                    <textarea
                      value={draft.rejectionReason}
                      onChange={(event) =>
                        updateField("rejectionReason", event.target.value)
                      }
                      className="min-h-24 w-full rounded-md border border-[#ddd6cd] bg-white px-3 py-2 text-sm outline-none transition focus:border-[#233f68]"
                    />
                  </Field>
                </div>
              )}

              {activeTab === "content" && (
                <div className="grid gap-4 md:grid-cols-2">
                  <Field className="md:col-span-2" label="Memorial Details (Obituary Text)">
                    <textarea
                      value={draft.memorialDetails}
                      onChange={(event) =>
                        updateField("memorialDetails", event.target.value)
                      }
                      className="min-h-28 w-full rounded-md border border-[#ddd6cd] bg-white px-3 py-2 text-sm outline-none transition focus:border-[#233f68]"
                    />
                  </Field>
                  <Field className="md:col-span-2" label="Life Story">
                    <textarea
                      value={draft.lifeStory}
                      onChange={(event) =>
                        updateField("lifeStory", event.target.value)
                      }
                      className="min-h-24 w-full rounded-md border border-[#ddd6cd] bg-white px-3 py-2 text-sm outline-none transition focus:border-[#233f68]"
                    />
                  </Field>
                  <Field className="md:col-span-2" label="Family Details">
                    <textarea
                      value={draft.familyDetails}
                      onChange={(event) =>
                        updateField("familyDetails", event.target.value)
                      }
                      className="min-h-20 w-full rounded-md border border-[#ddd6cd] bg-white px-3 py-2 text-sm outline-none transition focus:border-[#233f68]"
                    />
                  </Field>
                  <Field className="md:col-span-2" label="Career Summary">
                    <textarea
                      value={draft.careerSummery}
                      onChange={(event) =>
                        updateField("careerSummery", event.target.value)
                      }
                      className="min-h-20 w-full rounded-md border border-[#ddd6cd] bg-white px-3 py-2 text-sm outline-none transition focus:border-[#233f68]"
                    />
                  </Field>
                  <Field label="Favorite Quote">
                    <input
                      value={draft.favouriteQuote}
                      onChange={(event) =>
                        updateField("favouriteQuote", event.target.value)
                      }
                      className="h-11 w-full rounded-md border border-[#ddd6cd] bg-white px-3 text-sm outline-none transition focus:border-[#233f68]"
                    />
                  </Field>
                  <Field label="Remembered For Ever Quote">
                    <input
                      value={draft.rememberForEverQuote}
                      onChange={(event) =>
                        updateField("rememberForEverQuote", event.target.value)
                      }
                      className="h-11 w-full rounded-md border border-[#ddd6cd] bg-white px-3 text-sm outline-none transition focus:border-[#233f68]"
                    />
                  </Field>
                </div>
              )}
            </div>
          ) : null}

          <DialogFooter className="mt-5 border-t border-[#ece5dc] bg-transparent px-0 py-0">
            <div className="flex w-full flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="button"
                onClick={() => {
                  if (draft) {
                    onSave(draft);
                  }
                }}
              >
                Save Changes
              </Button>
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Wraps a single field block in the edit dialog.
 *
 * @param {object} props - Component props.
 * @param {ReactNode} props.children - Nested control.
 * @param {string} props.label - The field label.
 * @param {string} [props.className] - Optional layout classes.
 * @returns {JSX.Element} The field wrapper.
 */
function Field({
  children,
  label,
  className = "",
}: {
  children: ReactNode;
  label: string;
  className?: string;
}) {
  return (
    <label className={`space-y-2 ${className}`.trim()}>
      <span className="block text-sm font-medium text-[#2b2621]">{label}</span>
      {children}
    </label>
  );
}
