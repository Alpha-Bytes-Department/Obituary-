/**
 * Mock data for the frontend UI shell.
 */

export interface FamilyRelation {
  name: string;
  relation: string;
}

export interface ObituaryMock {
  id: string;
  deceasedFirstName: string;
  deceasedLastName: string;
  dateOfDeath: string;
  location: {
    city: string;
  };
  headline: string;
  excerpt: string;
  images: string[];
  featuredToday?: boolean;
  allTimeMemorable?: boolean;
  familyTree?: FamilyRelation[];
}

export interface CondolenceMock {
  id: string;
  obituaryId: string;
  name: string;
  message: string;
}

export interface UserMock {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "user" | "admin";
}

export const mockObituaries: ObituaryMock[] = [
  {
    id: "1",
    deceasedFirstName: "John",
    deceasedLastName: "Doe",
    dateOfDeath: "2026-05-01",
    location: { city: "Dhaka" },
    headline: "Beloved father and teacher",
    excerpt:
      "John Doe peacefully passed away after a life of service, learning, and quiet generosity.",
    images: ["/placeholders/obit-1.svg", "/placeholders/obit-2.svg"],
    featuredToday: true,
    allTimeMemorable: true,
    familyTree: [
      { name: "Mary Doe", relation: "Spouse" },
      { name: "Anna Doe", relation: "Daughter" },
    ],
  },
  {
    id: "2",
    deceasedFirstName: "Aisha",
    deceasedLastName: "Khan",
    dateOfDeath: "2025-11-10",
    location: { city: "Chittagong" },
    headline: "Cherished community leader",
    excerpt:
      "Aisha Khan devoted her life to community care, literacy, and family support.",
    images: ["/placeholders/obit-3.svg"],
    allTimeMemorable: true,
    familyTree: [
      { name: "Imran Khan", relation: "Son" },
      { name: "Sara Khan", relation: "Daughter" },
    ],
  },
  {
    id: "3",
    deceasedFirstName: "Rahim",
    deceasedLastName: "Ali",
    dateOfDeath: "2026-04-18",
    location: { city: "Sylhet" },
    headline: "A life full of songs and stories",
    excerpt:
      "Rahim Ali was known for his storytelling, calm presence, and unwavering kindness.",
    images: ["/placeholders/obit-4.svg"],
    featuredToday: true,
  },
  {
    id: "4",
    deceasedFirstName: "Nusrat",
    deceasedLastName: "Jahan",
    dateOfDeath: "2024-08-22",
    location: { city: "Rajshahi" },
    headline: "Treasured mentor and artist",
    excerpt:
      "Nusrat Jahan created spaces where young people felt seen, heard, and encouraged.",
    images: ["/placeholders/obit-2.svg"],
    allTimeMemorable: true,
  },
];

export const featuredTodayObituaries = mockObituaries.filter(
  (obituary) => obituary.featuredToday,
);
export const allTimeMemorableObituaries = mockObituaries.filter(
  (obituary) => obituary.allTimeMemorable,
);

export const mockCondolences: CondolenceMock[] = [
  {
    id: "c1",
    obituaryId: "1",
    name: "Mary",
    message: "So sorry for your loss.",
  },
  {
    id: "c2",
    obituaryId: "1",
    name: "Hassan",
    message: "A gentle soul remembered with love.",
  },
];

export const mockUsers: UserMock[] = [
  {
    id: "u1",
    firstName: "Admin",
    lastName: "User",
    email: "admin@example.com",
    role: "admin",
  },
  {
    id: "u2",
    firstName: "Guest",
    lastName: "Member",
    email: "user@example.com",
    role: "user",
  },
];
