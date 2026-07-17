import Link from "next/link";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-6 sm:py-24">
      <EmptyState
        icon="📒"
        title="Page not found"
        description="We could not find this page. Return to the game board to choose an available lesson, game, or challenge."
        action={
          <Link href="/board">
            <Button>Return to game board</Button>
          </Link>
        }
      />
    </div>
  );
}
