import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/app/(public)/login/login-form";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { getOperatorClaims } from "@/lib/auth/operator";

export const metadata: Metadata = {
  title: "Operator login",
};

export default async function LoginPage() {
  const claims = await getOperatorClaims();

  if (claims) {
    redirect("/dashboard");
  }

  return (
    <Container className="py-12 sm:py-16">
      <Card className="mx-auto max-w-md">
        <h1 className="text-xl font-semibold tracking-tight">Operator login</h1>
        <p className="mt-2 mb-6 text-sm text-slate-600">
          Sign in with the operator account created in Supabase Auth.
        </p>
        <LoginForm />
      </Card>
    </Container>
  );
}
