import DonationsManagement from "../../../../Component/protected/admin/DonationsManagement";

export const metadata = {
  title: "Donation History | Admin",
  description: "View all memorial donations",
};

export default function AdminDonationsPage() {
  return <DonationsManagement />;
}
