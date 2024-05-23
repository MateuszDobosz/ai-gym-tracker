import { auth } from "@/auth";
import { SignUpForm } from "@/components/sign-up-form";
import { redirect } from "next/navigation";

export default async function SignUp() {
  const session = await auth();

  if (session) redirect("/");
  return (
    <div className="min-h-screen flex items-center justify-center">
      <SignUpForm />
    </div>
  );
}
