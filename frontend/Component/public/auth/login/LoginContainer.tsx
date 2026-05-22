import LoginForm from "./LoginForm";

/**
 * Composes the login page content.
 *
 * @returns {JSX.Element} The login container.
 */
export default function LoginContainer() {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-10rem)] w-full max-w-[720px] flex-col items-center px-4 pt-6 text-center sm:px-0 lg:pt-10">
      <div className="space-y-2">
        <h1 className="font-heading text-[2.05rem] leading-none tracking-[-0.02em] text-[#2d2a26] sm:text-[2.35rem]">
          Welcome Back
        </h1>
        <p className="text-[1rem] text-[#7b746d] sm:text-[1.05rem]">
          Sign in to manage your memorials
        </p>
      </div>
      <LoginForm />
      <p className="mt-6 text-center text-[0.95rem] text-[#7c7c7c]">
        By signing in, you agree to our{" "}
        <a href="#" className="font-medium text-[#1e3a5f]">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="font-medium text-[#1e3a5f]">
          Privacy Policy
        </a>
      </p>
    </section>
  );
}
