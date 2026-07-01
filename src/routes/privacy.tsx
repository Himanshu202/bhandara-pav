import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/layout/PageShell";

export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: [{ title: "Privacy Policy — BhandaraSetu" }, { name: "description", content: "How BhandaraSetu handles your personal data." }] }),
  component: Privacy,
});

function Privacy() {
  return (
    <PageShell>
      <PageHero eyebrow="Legal" title="Privacy Policy" />
      <section className="mx-auto max-w-3xl space-y-6 px-4 py-16 text-sm leading-relaxed text-muted-foreground sm:px-6">
        <p>This page is maintained by BhandaraSetu to describe how we handle your data. Replace with reviewed legal copy before launch.</p>
        {["Information we collect", "How we use information", "Sharing with venues", "Cookies", "Data retention", "Your rights", "Contact for privacy"].map((h) => (
          <div key={h}>
            <h2 className="font-display text-xl font-semibold text-foreground">{h}</h2>
            <p className="mt-2">Placeholder content describing {h.toLowerCase()}.</p>
          </div>
        ))}
      </section>
    </PageShell>
  );
}
