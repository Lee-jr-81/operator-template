import { DashboardShell } from "@/app/dashboard/dashboard-shell";
import { requireOperator } from "@/lib/auth/operator";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const claims = await requireOperator();
  const email =
    typeof claims.email === "string" ? claims.email : "operator account";

  return <DashboardShell email={email}>{children}</DashboardShell>;
}
