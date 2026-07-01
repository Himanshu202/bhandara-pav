import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell, PageHero } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/button";
import { CreditCard, Smartphone, Landmark, Wallet, QrCode, Banknote, Building2, MapPin, IndianRupee, Check } from "lucide-react";

export const Route = createFileRoute("/payment")({
  head: () => ({
    meta: [
      { title: "Payment — BhandaraSetu" },
      { name: "description", content: "Pay online (UPI, cards, net banking, wallet, QR) or offline (cash, bank deposit, at venue)." },
    ],
  }),
  component: Payment,
});

const online = [
  { icon: Smartphone, label: "UPI" },
  { icon: CreditCard, label: "Credit / Debit Card" },
  { icon: Landmark, label: "Net Banking" },
  { icon: Wallet, label: "Wallet" },
  { icon: QrCode, label: "QR Code" },
];
const offline = [
  { icon: Banknote, label: "Cash" },
  { icon: MapPin, label: "Pay at Venue" },
  { icon: Building2, label: "Bank Deposit" },
  { icon: Wallet, label: "Pay to Organizer" },
];

function Payment() {
  const [mode, setMode] = useState<"online" | "offline">("online");
  const [method, setMethod] = useState("UPI");

  return (
    <PageShell>
      <PageHero eyebrow="Payment" title="Complete your booking" subtitle="Online or offline — choose what works. Secure and instant." />
      <section className="mx-auto grid max-w-6xl gap-8 px-4 pb-20 sm:px-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-3xl bg-card p-6 ring-1 ring-border sm:p-8">
          <div className="inline-flex rounded-full bg-secondary p-1">
            {(["online", "offline"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={
                  "rounded-full px-5 py-2 text-sm font-semibold capitalize transition-colors " +
                  (mode === m ? "bg-primary text-primary-foreground" : "text-muted-foreground")
                }
              >
                {m} payment
              </button>
            ))}
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {(mode === "online" ? online : offline).map((o) => (
              <button
                key={o.label}
                onClick={() => setMethod(o.label)}
                className={
                  "flex items-center gap-3 rounded-2xl border p-4 text-left transition-all " +
                  (method === o.label ? "border-primary bg-primary/5" : "border-border hover:border-primary/30")
                }
              >
                <div className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                  <o.icon className="size-5" />
                </div>
                <span className="text-sm font-semibold">{o.label}</span>
                {method === o.label && <Check className="ml-auto size-5 text-primary" strokeWidth={3} />}
              </button>
            ))}
          </div>
          <Button size="lg" className="mt-8 h-12 w-full rounded-full">
            {mode === "online" ? `Pay ₹18,299 via ${method}` : `Confirm ${method}`}
          </Button>
        </div>

        <aside className="rounded-3xl bg-[var(--gradient-warm)] p-6 ring-1 ring-border sm:p-8">
          <h3 className="font-display text-xl font-bold">Order summary</h3>
          <p className="text-xs text-muted-foreground">Booking ID · BHS-2026-04821</p>
          <div className="mt-6 space-y-3 border-y border-border py-6 text-sm">
            {[
              ["Venue booking", "₹15,000"],
              ["Standard package", "₹299"],
              ["Decoration add-on", "₹1,499"],
              ["GST (18%)", "₹324"],
              ["Gateway fee", "₹67"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span className="text-muted-foreground">{k}</span>
                <span className="font-medium">{v}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-baseline justify-between">
            <span className="font-display text-lg font-semibold">Total</span>
            <span className="flex items-baseline font-display text-3xl font-bold text-primary">
              <IndianRupee className="size-5" />17,189
            </span>
          </div>
          <div className="mt-6 rounded-xl bg-background/70 p-4 text-xs text-muted-foreground">
            Advance ₹5,000 now · balance due at venue. Invoice & receipt PDF sent on payment.
          </div>
        </aside>
      </section>
    </PageShell>
  );
}
