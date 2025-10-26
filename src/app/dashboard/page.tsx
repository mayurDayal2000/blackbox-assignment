"use client";

import { signOut } from "firebase/auth";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { CheckoutPlan } from "@/components/CheckoutPlan";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hook/useAuth";
import { useCheckoutForm } from "@/hook/useCheckoutForm";
import { auth } from "@/lib/firebase";

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const { formData, selectedPlan, isSubmitting, handleInputChange, handleSubmit, setSelectedPlan } =
    useCheckoutForm(user?.displayName || "");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, authLoading, router]);

  // Handler for the logout process
  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/auth/login");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  if (authLoading || !user) {
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
          <Button disabled={authLoading} onClick={handleLogout} variant="outline">
            {authLoading ? "Signing out..." : "Sign Out"}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 md:px-10 py-10">
        <CheckoutPlan
          formData={formData}
          isSubmitting={isSubmitting}
          onInputChange={handleInputChange}
          onPlanSelect={setSelectedPlan}
          onSubmit={handleSubmit}
          selectedPlan={selectedPlan}
        />
      </main>
    </div>
  );
}
