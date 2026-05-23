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
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <Field label="Memorial Image URL">
                <input
                  value={draft.memorialImage}
                  onChange={(event) =>
                    updateField("memorialImage", event.target.value)
                  }
                  className="h-11 w-full rounded-md border border-[#ddd6cd] bg-white px-3 text-sm outline-none transition focus:border-[#233f68]"
                />
              </Field>
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
              <Field label="First Name">
                <input
                  value={draft.deceasedFirstName}
                  onChange={(event) =>
                    updateField("deceasedFirstName", event.target.value)
                  }
                  className="h-11 w-full rounded-md border border-[#ddd6cd] bg-white px-3 text-sm outline-none transition focus:border-[#233f68]"
                />
              </Field>
              <Field label="Last Name">
                <input
                  value={draft.deceasedLastName}
                  onChange={(event) =>
                    updateField("deceasedLastName", event.target.value)
                  }
                  className="h-11 w-full rounded-md border border-[#ddd6cd] bg-white px-3 text-sm outline-none transition focus:border-[#233f68]"
                />
              </Field>
              <Field className="md:col-span-2" label="Rejection Notice">
                <textarea
                  value={draft.rejectionReason}
                  onChange={(event) =>
                    updateField("rejectionReason", event.target.value)
                  }
                  className="min-h-24 w-full rounded-md border border-[#ddd6cd] bg-white px-3 py-2 text-sm outline-none transition focus:border-[#233f68]"
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
              <Field label="Payment Method">
                <select
                  value={draft.paymentMethod}
                  onChange={(event) =>
                    updateField(
                      "paymentMethod",
                      event.target.value as SubmissionDraft["paymentMethod"],
                    )
                  }
                  className="h-11 w-full rounded-md border border-[#ddd6cd] bg-white px-3 text-sm outline-none transition focus:border-[#233f68]"
                >
                  <option value="stripe">Stripe</option>
                  <option value="token">Token</option>
                  <option value="admin_override">Admin Override</option>
                </select>
              </Field>
              <Field className="md:col-span-2" label="Biography">
                <textarea
                  value={draft.biography}
                  onChange={(event) =>
                    updateField("biography", event.target.value)
                  }
                  className="min-h-28 w-full rounded-md border border-[#ddd6cd] bg-white px-3 py-2 text-sm outline-none transition focus:border-[#233f68]"
                />
              </Field>
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
