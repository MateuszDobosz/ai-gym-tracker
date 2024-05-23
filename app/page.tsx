import { auth } from "@/auth";
import Link from "next/link";

export default async function Home() {
  const session = await auth();

  return (
    <div className="hero min-h-screen">
      <div className="hero-content text-center prose">
        <div className="max-w-md ">
          <h1 className="text-5xl font-bold">AI-Enhanced Training Insights</h1>
          <p className="py-6">
            Harness the power of AI to analyze and boost your workouts for
            optimal results.
          </p>
          <div className="flex justify-evenly">
            {!session?.user ? (
              <>
                <Link className="btn btn-primary" href="/api/auth/signin">
                  Sing in
                </Link>
                <Link className="btn btn-primary" href="/signup">
                  Sing up
                </Link>
              </>
            ) : (
              <>
                <Link className="btn btn-primary" href="/addTraining">
                  Get Started!
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
