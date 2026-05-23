"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";

import CouponStatusCard from "./profile-dashboard/CouponStatusCard";
import DashboardStatsGrid from "./profile-dashboard/DashboardStatsGrid";
import DeleteSubmissionDialog from "./profile-dashboard/DeleteSubmissionDialog";
import MemorialSubmissionsTable from "./profile-dashboard/MemorialSubmissionsTable";
import ProfileHeaderCard from "./profile-dashboard/ProfileHeaderCard";
import SubmissionEditDialog from "./profile-dashboard/SubmissionEditDialog";
import { fallbackUser, initialSubmissions } from "./profile-dashboard/data";
import type {
  MemorialSubmission,
  SubmissionDraft,
} from "./profile-dashboard/types";
import useAuth from "../../hooks/useAuth";

/**
 * Renders the protected profile dashboard.
 *
 * @returns {JSX.Element} The dashboard composition.
 */
export default function ProfileContainer() {
  const { user } = useAuth();
  const displayUser = user ?? fallbackUser;
  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [selectedSubmission, setSelectedSubmission] =
    useState<MemorialSubmission | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MemorialSubmission | null>(
    null,
  );

  const stats = useMemo(
    () => ({
      total: submissions.length,
      approved: submissions.filter(
        (submission) => submission.status === "approved",
      ).length,
      pending: submissions.filter(
        (submission) => submission.status === "pending",
      ).length,
      rejected: submissions.filter(
        (submission) => submission.status === "rejected",
      ).length,
    }),
    [submissions],
  );

  /**
   * Opens the memorial editor.
   *
   * @param {MemorialSubmission} submission - The submission to edit.
   * @returns {void}
   */
  const openEditor = (submission: MemorialSubmission) => {
    setSelectedSubmission(submission);
  };

  /**
   * Closes the memorial editor.
   *
   * @returns {void}
   */
  const closeEditor = () => {
    setSelectedSubmission(null);
  };

  /**
   * Saves an edited submission back into the dashboard list.
   *
   * @param {SubmissionDraft} draft - The updated form data.
   * @returns {void}
   */
  const saveDraft = (draft: SubmissionDraft) => {
    if (!selectedSubmission) {
      return;
    }

    setSubmissions((current) =>
      current.map((submission) =>
        submission.id === selectedSubmission.id
          ? {
              ...submission,
              memorialImage: draft.memorialImage,
              deceasedFirstName: draft.deceasedFirstName,
              deceasedLastName: draft.deceasedLastName,
              rejectionReason: draft.rejectionReason,
              dateOfBirth: draft.dateOfBirth,
              dateOfDeath: draft.dateOfDeath,
              biography: draft.biography,
              status: draft.status,
              paymentMethod: draft.paymentMethod,
              updatedAt: new Date().toISOString(),
            }
          : submission,
      ),
    );

    toast.success("Memorial submission updated successfully.");
    closeEditor();
  };

  /**
   * Opens the delete confirmation dialog.
   *
   * @param {MemorialSubmission} submission - The submission to delete.
   * @returns {void}
   */
  const requestDeleteSubmission = (submission: MemorialSubmission) => {
    setDeleteTarget(submission);
  };

  /**
   * Deletes the selected submission after user confirmation.
   *
   * @returns {void}
   */
  const confirmDeleteSubmission = () => {
    if (!deleteTarget) {
      return;
    }

    setSubmissions((current) =>
      current.filter((submission) => submission.id !== deleteTarget.id),
    );
    setDeleteTarget(null);
    toast.message("Memorial submission deleted.");
  };

  return (
    <main
      className="mx-auto flex w-full flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8"
      style={{ maxWidth: "min(1600px, 96vw)" }}
    >
      <ProfileHeaderCard user={displayUser} />
      <CouponStatusCard />
      <DashboardStatsGrid
        total={stats.total}
        approved={stats.approved}
        pending={stats.pending}
        rejected={stats.rejected}
      />
      <MemorialSubmissionsTable
        submissions={submissions}
        onEdit={openEditor}
        onRequestDelete={requestDeleteSubmission}
      />
      <SubmissionEditDialog
        submission={selectedSubmission}
        onSave={saveDraft}
        onClose={closeEditor}
      />
      <DeleteSubmissionDialog
        submission={deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDeleteSubmission}
      />
    </main>
  );
}
