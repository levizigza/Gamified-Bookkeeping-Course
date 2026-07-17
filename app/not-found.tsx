import Link from "next/link";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-6 sm:py-24">
      <EmptyState
        icon="📒"
        title="Page not found"
        description="This lesson or challenge does not exist yet. Check the URL or return to your dashboard."
        action={
          <Link href="/dashboard">
            <Button>Go to dashboard</Button>
          </Link>
        }
      />
    </div>
  );
}
