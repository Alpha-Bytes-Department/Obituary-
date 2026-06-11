import ResetPasswordContainer from "../../../../../Component/public/auth/forgot_password/ResetPasswordContainer";

/**
 * Reset password page that extracts userId and token from the URL.
 */
export default async function ResetPasswordPage({
  params,
}: {
  params: Promise<{ userId: string; token: string }>;
}) {
  const resolvedParams = await params;
  return (
    <ResetPasswordContainer
      userId={resolvedParams.userId}
      token={resolvedParams.token}
    />
  );
}
