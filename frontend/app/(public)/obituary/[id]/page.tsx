import ObituaryDetailContainer from "@/Component/public/obituary_detail/ObituaryDetailContainer";

interface ObituaryDetailPageProps {
  params: {
    id: string;
  };
}

/**
 * Wrapper for the obituary detail page.
 *
 * @param {ObituaryDetailPageProps} props - Route props.
 * @returns {JSX.Element} The obituary detail container.
 */
export default function ObituaryDetailPage({
  params,
}: ObituaryDetailPageProps) {
  return <ObituaryDetailContainer id={params.id} />;
}
