import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/layout/PageShell";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const Route = createFileRoute("/faqs")({
  head: () => ({
    meta: [
      { title: "FAQs — BhandaraSetu" },
      { name: "description", content: "Answers to common questions about booking, payments, cancellations, and venues." },
    ],
  }),
  component: FAQs,
});

const faqs = [
  { q: "How does booking work?", a: "Search a venue by location, pick your date, choose a package, and pay a small platform convenience fee. You'll get a booking ID and can track everything live." },
  { q: "Can I pay offline?", a: "Yes. We support cash, bank deposit, pay-at-venue, and pay-to-organizer alongside all major online methods (UPI, cards, net banking, wallets, QR)." },
  { q: "What's your cancellation policy?", a: "Free cancellation up to 7 days before the event. 25% of the platform fee applies between 48 hrs and 7 days. No refunds within 48 hrs." },
  { q: "Can I reschedule?", a: "Yes — one free reschedule per booking, up to 48 hrs before the event. Additional reschedules cost ₹99 each." },
  { q: "Is my payment secure?", a: "All online payments are processed via PCI-DSS compliant gateways. We never store card details on our servers." },
  { q: "Do you support Hindi?", a: "Yes. Toggle हिन्दी from any screen — the entire platform, invoices, and WhatsApp reminders switch languages." },
];

function FAQs() {
  return (
    <PageShell>
      <PageHero eyebrow="FAQs" title="Frequently asked questions" subtitle="Can't find an answer? Reach us on WhatsApp." />
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="overflow-hidden rounded-2xl border border-border bg-card px-5">
              <AccordionTrigger className="text-left font-display text-base font-semibold hover:no-underline">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </PageShell>
  );
}
