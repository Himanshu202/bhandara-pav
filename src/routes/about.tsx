import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/layout/PageShell";
import { Heart, Users, Sparkles, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About BhandaraSetu — Devotion meets technology" },
      { name: "description", content: "Learn how BhandaraSetu is modernizing India's community feast tradition with technology." },
    ],
  }),
  component: About,
});

const values = [
  { icon: Heart, title: "Devotion first", desc: "Technology serves tradition — not the other way around." },
  { icon: Users, title: "Community driven", desc: "Every feature shaped by temples, sevaks, and organizers." },
  { icon: Sparkles, title: "Effortless craft", desc: "Beautiful, fast, bilingual tools anyone can use." },
  { icon: ShieldCheck, title: "Trust and transparency", desc: "Verified venues, transparent fees, clear policies." },
];

function About() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Our story"
        title="Modernizing India's oldest tradition of giving"
        subtitle="BhandaraSetu was born to make organizing community feasts — Bhandaras, langars, community meals — as simple as booking a cab."
      />
      <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-2">
          {values.map((v) => (
            <div key={v.title} className="rounded-2xl bg-card p-6 ring-1 ring-border">
              <div className="mb-3 grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
                <v.icon className="size-5" />
              </div>
              <h3 className="font-display text-lg font-semibold">{v.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{v.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-16 rounded-3xl bg-[var(--gradient-warm)] p-8 ring-1 ring-border sm:p-12">
          <h2 className="font-display text-3xl font-bold">A bridge between tradition and today</h2>
          <p className="mt-4 text-muted-foreground">
            Every year, millions of Bhandaras are organized across India — feeding communities,
            marking festivals, and honoring loved ones. But the logistics remain painful: paper
            registers, phone calls, cash-only payments, no way to know if a venue is available.
          </p>
          <p className="mt-4 text-muted-foreground">
            We built BhandaraSetu as a bridge (setu) — connecting organizers with verified venues,
            enabling online + offline payments, and tracking every booking in real time. So the
            focus stays where it belongs: on the seva.
          </p>
        </div>
      </section>
    </PageShell>
  );
}
