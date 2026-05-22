import RegisterForm from "./RegisterForm";

export default function RegisterContainer() {
  return (
    <section
      className="mx-auto flex min-h-[calc(100vh-2rem)] w-full flex-col items-center px-4 pb-10 pt-4 sm:px-0 sm:pt-6"
      style={{ maxWidth: 500 }}
    >
      <div className="text-center">
        <h1 className="font-heading text-[1.8rem] leading-none tracking-[-0.02em] text-[#2d2a26] sm:text-[2rem]">
          Create an Account
        </h1>
        <p className="mt-2 text-[0.98rem] text-[#7b746d]">
          Start creating meaningful memorials
        </p>
      </div>
      <RegisterForm />
    </section>
  );
}
