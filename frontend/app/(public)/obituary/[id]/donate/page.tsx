import DonatePageContainer from "../../../../../Component/public/obituary_detail/DonatePageContainer";

interface DonatePageProps {
  params: Promise<{ id: string }>;
}

export default async function DonatePage({ params }: DonatePageProps) {
  const { id } = await params;
  return <DonatePageContainer memorialId={id} />;
}
