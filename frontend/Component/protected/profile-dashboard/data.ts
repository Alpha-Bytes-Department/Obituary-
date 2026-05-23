import { createElement } from "react";

import { AlertCircle, CheckCircle2, Clock3 } from "lucide-react";

import type {
  MemorialSubmission,
  ObituaryStatus,
  SubmissionDraft,
} from "./types";

export const fallbackUser = {
  id: "15416546565651",
  firstName: "Akash",
  lastName: "Saha",
  email: "asksaha9@gmail.com",
  userImage: "/Source/person.jpg",
};

export const initialSubmissions: MemorialSubmission[] = [
  {
    id: "mem-001",
    obituaryId: "obit-001",
    memorialImage:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80",
    deceasedFirstName: "Margaret",
    deceasedLastName: "Thompson",
    rejectionReason: "",
    dateOfBirth: "1948-03-16",
    dateOfDeath: "2026-05-08",
    biography: "A cherished teacher, mother, and community volunteer.",
    status: "approved",
    paymentMethod: "stripe",
    createdAt: "2026-05-08",
    updatedAt: "2026-05-08",
  },
  {
    id: "mem-002",
    obituaryId: "obit-002",
    memorialImage:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80",
    deceasedFirstName: "Robert",
    deceasedLastName: "Mitchell",
    rejectionReason: "Pending family confirmation before publication.",
    dateOfBirth: "1952-10-04",
    dateOfDeath: "2026-05-10",
    biography: "Remembered for his compassion, humor, and devotion to family.",
    status: "pending",
    paymentMethod: "token",
    createdAt: "2026-05-10",
    updatedAt: "2026-05-10",
  },
  {
    id: "mem-003",
    obituaryId: "obit-003",
    memorialImage:
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=900&q=80",
    deceasedFirstName: "Eleanor",
    deceasedLastName: "Williams",
    rejectionReason:
      "Rejected for incomplete obituary details and missing service notice.",
    dateOfBirth: "1940-08-22",
    dateOfDeath: "2026-05-11",
    biography: "Her family requested additional details before publishing.",
    status: "rejected",
    paymentMethod: "admin_override",
    createdAt: "2026-05-11",
    updatedAt: "2026-05-12",
  },
];

/**
 * Formats a date string for dashboard display.
 *
 * @param {string} value - ISO date string.
 * @returns {string} The localized date label.
 */
export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

/**
 * Returns the visual treatment for a memorial status.
 *
 * @param {ObituaryStatus} status - The memorial status.
 * @returns {{ label: string; className: string; icon: JSX.Element }} The badge metadata.
 */
export function getStatusMeta(status: ObituaryStatus) {
  switch (status) {
    case "approved":
      return {
        label: "Approved",
        className: "border-[#a7c9a7] bg-[#edf7ed] text-[#2d6b35]",
        icon: createElement(CheckCircle2, { className: "h-3.5 w-3.5" }),
      };
    case "pending":
      return {
        label: "Pending",
        className: "border-[#e0c48d] bg-[#fff7e5] text-[#9a6a15]",
        icon: createElement(Clock3, { className: "h-3.5 w-3.5" }),
      };
    default:
      return {
        label: "Rejected",
        className: "border-[#efb3b3] bg-[#fff0f0] text-[#b32424]",
        icon: createElement(AlertCircle, { className: "h-3.5 w-3.5" }),
      };
  }
}

/**
 * Builds the initial edit draft from a memorial submission.
 *
 * @param {MemorialSubmission} submission - The selected memorial submission.
 * @returns {SubmissionDraft} Pre-filled form state.
 */
export function buildDraft(submission: MemorialSubmission): SubmissionDraft {
  return {
    memorialImage: submission.memorialImage,
    deceasedFirstName: submission.deceasedFirstName,
    deceasedLastName: submission.deceasedLastName,
    rejectionReason: submission.rejectionReason ?? "",
    dateOfBirth: submission.dateOfBirth,
    dateOfDeath: submission.dateOfDeath,
    biography: submission.biography,
    status: submission.status,
    paymentMethod: submission.paymentMethod,
  };
}
