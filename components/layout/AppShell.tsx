import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { IntroGate } from "@/components/intro/IntroGate";
import { SiteAtmosphere } from "@/components/visuals/SiteAtmosphere";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <IntroGate>
      <div className="relative isolate flex min-h-screen flex-col overflow-hidden">
        <SiteAtmosphere />
        <div className="relative z-10 flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
      </div>
    </IntroGate>
  );
}
