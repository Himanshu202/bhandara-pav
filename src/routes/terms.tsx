import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/layout/PageShell";

export const Route = createFileRoute("/terms")({
  head: () => ({ meta: [{ title: "Terms & Conditions — BhandaraSetu" }, { name: "description", content: "Terms and conditions for using BhandaraSetu." }] }),
  component: Terms,
});

function Terms() {
  return (
    <PageShell>
      <PageHero eyebrow="Legal" title="Terms & Conditions" />
      <section className="mx-auto max-w-3xl space-y-6 px-4 py-16 text-sm leading-relaxed text-muted-foreground sm:px-6">
        <p>By using BhandaraSetu you agree to the following terms. These are illustrative placeholders — please replace with your legally reviewed content before going live.</p>
        {["Use of platform", "Bookings and payments", "Cancellations and refunds", "Venue partner obligations", "User conduct", "Limitation of liability", "Governing law"].map((h) => (
          <div key={h}>
            <h2 className="font-display text-xl font-semibold text-foreground">{h}</h2>
            <p className="mt-2">Placeholder content describing {h.toLowerCase()}. Replace with reviewed legal copy.</p>
          </div>
        ))}
      </section>
    </PageShell>
  );
}
