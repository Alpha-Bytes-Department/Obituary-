import ObituaryDetailContainer from "../../../../Component/public/obituary_detail/ObituaryDetailContainer";

interface ObituaryDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

/**
 * Wrapper for the obituary detail page.
 *
 * @param {ObituaryDetailPageProps} props - Route props.
 * @returns {JSX.Element} The obituary detail container.
 */
export default async function ObituaryDetailPage({
  params,
}: ObituaryDetailPageProps) {
  const { id } = await params;

  return <ObituaryDetailContainer id={id} />;
}
