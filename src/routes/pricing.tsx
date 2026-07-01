import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/button";
import { Check, IndianRupee } from "lucide-react";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — BhandaraSetu" },
      { name: "description", content: "Transparent per-event platform fees. Basic ₹99, Standard ₹299, Premium ₹599." },
    ],
  }),
  component: Pricing,
});

const tiers = [
  { name: "Basic", price: 99, tag: "Self managed", features: ["Venue listings", "Booking support", "Payment tracking", "Email receipts"] },
  { name: "Standard", price: 299, tag: "Most popular", highlight: true, features: ["Everything in Basic", "Decoration coordination", "Guest management", "Digital invitations + QR", "WhatsApp reminders"] },
  { name: "Premium", price: 599, tag: "Full service", features: ["Everything in Standard", "Catering & menu planning", "Photography coverage", "Dedicated event manager", "Priority support 24×7"] },
];

const charges = [
  { label: "Payment gateway fee", value: "2% + ₹3 per online transaction" },
  { label: "GST", value: "18% on platform fee" },
  { label: "Cancellation (>7 days)", value: "Free" },
  { label: "Cancellation (48 hrs–7 days)", value: "25% of platform fee" },
  { label: "Rescheduling", value: "Free once, ₹99 thereafter" },
  { label: "Add-on: extra decoration", value: "From ₹1,499" },
];

function Pricing() {
  return (
    <PageShell>
      <PageHero eyebrow="Pricing" title="Simple per-event pricing" subtitle="Pay a small platform fee only when you confirm a booking. No subscriptions." />
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {tiers.map((p) => (
            <div
              key={p.name}
              className={
                "relative flex flex-col rounded-3xl p-8 ring-1 " +
                (p.highlight
                  ? "bg-[var(--gradient-hero)] text-primary-foreground shadow-[var(--shadow-warm)] ring-primary lg:-translate-y-4"
                  : "bg-card ring-border")
              }
            >
              {p.highlight && (
                <span className="absolute -top-3 left-8 rounded-full bg-accent px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-accent-foreground">
                  {p.tag}
                </span>
              )}
              {!p.highlight && <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{p.tag}</p>}
              <h3 className="mt-3 font-display text-2xl font-bold">{p.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <IndianRupee className={"size-5 " + (p.highlight ? "opacity-80" : "text-muted-foreground")} />
                <span className="font-display text-5xl font-bold">{p.price}</span>
                <span className={"text-sm " + (p.highlight ? "opacity-80" : "text-muted-foreground")}>/ event</span>
              </div>
              <ul className="mt-8 flex-1 space-y-3.5">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm">
                    <Check className={"mt-0.5 size-4 shrink-0 " + (p.highlight ? "" : "text-primary")} strokeWidth={3} />
                    <span className={p.highlight ? "" : "text-muted-foreground"}>{f}</span>
                  </li>
                ))}
              </ul>
              <Button
                asChild
                className={"mt-10 h-11 w-full rounded-full " + (p.highlight ? "bg-background text-foreground hover:bg-background/90" : "")}
                variant={p.highlight ? "default" : "outline"}
              >
                <Link to="/book">Choose {p.name}</Link>
              </Button>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-border/60 bg-secondary/40 py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-center font-display text-3xl font-bold">Additional charges</h2>
          <p className="mt-3 text-center text-muted-foreground">Everything is transparent. No hidden fees.</p>
          <div className="mt-10 divide-y divide-border rounded-2xl bg-card ring-1 ring-border">
            {charges.map((c) => (
              <div key={c.label} className="flex flex-wrap items-center justify-between gap-2 p-5 text-sm">
                <span className="font-medium">{c.label}</span>
                <span className="text-muted-foreground">{c.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
