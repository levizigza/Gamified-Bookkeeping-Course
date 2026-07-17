import { CourseCertificate } from "@/components/game/CourseCertificate";
import { PageHeader } from "@/components/ui/PageHeader";
import { getMockGamificationProgress } from "@/lib/game/mockProgress";
import { sampleBusiness } from "@/lib/data/sampleBusiness";

export const metadata = {
  title: "Certificate — Ledger Quest",
};

export default function CertificatePage() {
  const progress = getMockGamificationProgress();
  const completionDate = new Date().toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
      <PageHeader
        backHref="/profile"
        backLabel="Back to profile"
        title="Your certificate"
        description="A record of your progress through the Bright Path Consulting simulation."
        className="mb-8"
      />
      <CourseCertificate
        businessName={progress.businessName}
        ownerName={sampleBusiness.ownerName}
        completionDate={completionDate}
        masteryPercent={progress.masteryPercent}
        badgesEarned={progress.earnedBadgeCount}
        totalBadges={progress.badges.length}
      />
    </div>
  );
}
