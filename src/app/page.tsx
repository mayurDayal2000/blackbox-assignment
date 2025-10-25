import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="4xl font-semibold text-center mb-4">Subscription Management</h1>

      <div className="flex items-center gap-4 justify-center">
        <Link href="/auth/signup">
          <Button variant="default">Sign up</Button>
        </Link>

        <Link href="/auth/login">
          <Button variant="secondary">LogIn</Button>
        </Link>
      </div>
    </div>
  );
}
