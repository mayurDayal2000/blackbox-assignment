"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    setError(null);

    if (password !== repeatPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (password.length < 5) {
      setError("Password must be at least 5 characters");
      setIsLoading(false);
      return;
    }

    toast.success("Account Created!", {
      description:
        "We have sent a confirmation link to your email address. Click the link to verify your account",
    });
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card className="border-border/50 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Sign Up</CardTitle>
            <CardDescription>Create a new account to get started</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSignUp}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label className="text-foreground" htmlFor="fullName">
                    Full Name
                  </Label>
                  <Input
                    className="bg-background border-border"
                    id="fullName"
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Robert"
                    required
                    type="text"
                    value={fullName}
                  />
                </div>

                <div className="grid gap-2">
                  <Label className="text-foreground" htmlFor="email">
                    Email
                  </Label>
                  <Input
                    className="bg-background border-border"
                    id="email"
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="robert@gmail.com"
                    required
                    type="email"
                    value={email}
                  />
                </div>

                <div className="grid gap-2">
                  <Label className="text-foreground" htmlFor="password">
                    Password
                  </Label>
                  <Input
                    className="bg-background border-border"
                    id="password"
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    required
                    type="password"
                    value={password}
                  />
                </div>

                <div className="grid gap-2">
                  <Label className="text-foreground" htmlFor="repeat-password">
                    Confirm Password
                  </Label>
                  <Input
                    className="bg-background border-border"
                    id="repeat-password"
                    onChange={(e) => setRepeatPassword(e.target.value)}
                    required
                    type="password"
                    value={repeatPassword}
                  />
                </div>

                {error && <p className="text-sm text-destructive font-medium">{error}</p>}

                <Button className="w-full" disabled={isLoading} size="lg" type="submit">
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              </div>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link className="font-semibold text-primary hover:underline" href="/auth/login">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
