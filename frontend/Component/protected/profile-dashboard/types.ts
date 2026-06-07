export type ObituaryStatus = "pending" | "approved" | "rejected";

export interface MemorialSubmission {
  id: string;
  obituaryId: string;
  memorialImage: string;
  deceasedFirstName: string;
  deceasedLastName: string;
  rejectionReason?: string;
  dateOfBirth: string;
  dateOfDeath: string;
  biography: string;
  status: ObituaryStatus;
  paymentMethod: "stripe" | "token" | "admin_override";
  createdAt: string;
  updatedAt: string;
}

export interface SubmissionDraft {
  memorialImage: string;
  deceasedFirstName: string;
  deceasedLastName: string;
  rejectionReason: string;
  dateOfBirth: string;
  dateOfDeath: string;
  biography: string;
  status: ObituaryStatus;
  paymentMethod: "stripe" | "token" | "admin_override";
}

export interface DashboardUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  userImage: string;
  funeralHome?: {
    logoImageUrl?: string;
    [key: string]: any;
  };
}
