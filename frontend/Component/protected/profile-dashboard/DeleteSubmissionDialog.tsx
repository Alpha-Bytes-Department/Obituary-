"use client";

import { Button } from "../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import type { MemorialSubmission } from "./types";

/**
 * Renders the delete permission dialog.
 *
 * @param {object} props - Component props.
 * @param {MemorialSubmission | null} props.submission - The selected submission.
 * @param {() => void} props.onCancel - Closes the dialog without deleting.
 * @param {() => void} props.onConfirm - Deletes the selected submission.
 * @returns {JSX.Element} The deletion confirmation dialog.
 */
export default function DeleteSubmissionDialog({
  submission,
  onCancel,
  onConfirm,
}: {
  submission: MemorialSubmission | null;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog
      open={Boolean(submission)}
      onOpenChange={(open) => {
        if (!open) {
          onCancel();
        }
      }}
    >
      <DialogContent className="w-[calc(100%-1rem)] max-w-lg p-0 sm:max-w-lg">
        <div className="p-5 sm:p-6">
          <DialogHeader>
            <DialogTitle>Delete memorial submission?</DialogTitle>
            <DialogDescription>
              This action needs your permission and will permanently remove the
              submission from the dashboard.
            </DialogDescription>
          </DialogHeader>

          <p className="mt-4 rounded-md border border-[#f0c5c5] bg-[#fff6f6] px-4 py-3 text-sm text-[#b32424]">
            {submission
              ? `Delete ${submission.deceasedFirstName} ${submission.deceasedLastName}?`
              : "Delete this submission?"}
          </p>

          <DialogFooter className="mt-5 border-t border-[#ece5dc] bg-transparent px-0 py-0">
            <div className="flex w-full flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="button" variant="destructive" onClick={onConfirm}>
                Delete
              </Button>
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
