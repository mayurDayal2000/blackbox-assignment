"use client";

import { signOut } from "firebase/auth";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hook/useAuth";
import { auth } from "@/lib/firebase";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/auth/login");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  if (loading || !user) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-background via-background to-muted">
      <header className="border-b border-border/50 bg-card">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {user.displayName ? `Welcome, ${user.displayName}` : `Logged in as ${user.email}`}
            </p>
          </div>
          <Button
            className="bg-transparent"
            disabled={loading}
            onClick={handleLogout}
            variant="outline"
          >
            {loading ? "Signing out..." : "Sign Out"}
          </Button>
        </div>
      </header>
    </div>
  );
}
