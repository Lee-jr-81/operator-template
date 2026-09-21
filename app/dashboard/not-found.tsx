import Link from "next/link";
import { BackLink } from "@/components/dashboard/back-link";
import { PageHeader } from "@/components/dashboard/page-header";
import { dashLink } from "@/lib/dashboard/classes";

export default function DashboardNotFound() {
  return (
    <div className="max-w-lg">
      <PageHeader
        title="Not found"
        description="That page does not exist or has already been removed."
        back={<BackLink href="/dashboard">Back to Dashboard</BackLink>}
      />
      <p className="mt-6">
        <Link href="/dashboard" className={dashLink}>
          Back to Overview
        </Link>
      </p>
    </div>
  );
}
