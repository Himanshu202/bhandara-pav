import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/button";
import { Calendar, Users, IndianRupee, TrendingUp, Bell, Download, QrCode, MapPin, Check } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — BhandaraSetu" },
      { name: "description", content: "Manage bookings, guests, payments and venues from a single dashboard." },
    ],
  }),
  component: Dashboard,
});

const stats = [
  { icon: Calendar, label: "Active bookings", value: "12", sub: "+3 this week" },
  { icon: Users, label: "Guests confirmed", value: "1,842", sub: "94% RSVP rate" },
  { icon: IndianRupee, label: "Revenue (MTD)", value: "₹4.2L", sub: "+18% MoM" },
  { icon: TrendingUp, label: "Avg. rating", value: "4.9", sub: "from 264 reviews" },
];

const bookings = [
  { id: "BHS-04821", event: "Sundar Kand Bhandara", venue: "Shri Ganesha Courtyard", date: "20 Oct 2026", guests: 500, status: "Confirmed" },
  { id: "BHS-04820", event: "Annakoot Feast", venue: "Lotus Community Hall", date: "24 Oct 2026", guests: 1200, status: "Pending" },
  { id: "BHS-04819", event: "Charity Langar", venue: "Sacred Banyan Garden", date: "02 Nov 2026", guests: 300, status: "Confirmed" },
];

function Dashboard() {
  return (
    <PageShell>
      <section className="border-b border-border/60 bg-[var(--gradient-warm)]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary">Organizer dashboard</p>
              <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Namaste, Sevak 🙏</h1>
              <p className="mt-1 text-muted-foreground">Here's what's happening across your events.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="rounded-full"><Bell className="mr-2 size-4" /> Notifications</Button>
              <Button className="rounded-full"><Download className="mr-2 size-4" /> Export report</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl bg-card p-5 ring-1 ring-border">
              <div className="flex items-center justify-between">
                <div className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                  <s.icon className="size-5" />
                </div>
                <span className="text-xs text-muted-foreground">{s.sub}</span>
              </div>
              <div className="mt-4 font-display text-3xl font-bold">{s.value}</div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div className="rounded-3xl bg-card p-6 ring-1 ring-border">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold">Recent bookings</h2>
              <Button variant="ghost" size="sm">View all</Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="pb-3 font-semibold">ID</th>
                    <th className="pb-3 font-semibold">Event</th>
                    <th className="pb-3 font-semibold">Date</th>
                    <th className="pb-3 font-semibold">Guests</th>
                    <th className="pb-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {bookings.map((b) => (
                    <tr key={b.id}>
                      <td className="py-4 font-mono text-xs text-muted-foreground">{b.id}</td>
                      <td className="py-4">
                        <div className="font-semibold">{b.event}</div>
                        <div className="text-xs text-muted-foreground"><MapPin className="mr-1 inline size-3" />{b.venue}</div>
                      </td>
                      <td className="py-4 text-muted-foreground">{b.date}</td>
                      <td className="py-4">{b.guests}</td>
                      <td className="py-4">
                        <span
                          className={
                            "rounded-full px-2.5 py-1 text-xs font-semibold " +
                            (b.status === "Confirmed" ? "bg-primary/10 text-primary" : "bg-accent/20 text-accent-foreground")
                          }
                        >
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-3xl bg-[var(--gradient-hero)] p-6 text-primary-foreground shadow-[var(--shadow-warm)]">
            <div className="grid size-12 place-items-center rounded-xl bg-primary-foreground/15">
              <QrCode className="size-6" />
            </div>
            <h3 className="mt-4 font-display text-xl font-semibold">Digital entry passes</h3>
            <p className="mt-2 text-sm opacity-90">432 QR passes generated for Sundar Kand Bhandara.</p>
            <div className="mt-6 space-y-2 text-sm">
              {[
                "Sent via WhatsApp",
                "Sent via Email",
                "Scanned at entry",
              ].map((l, i) => (
                <div key={l} className="flex items-center justify-between rounded-lg bg-primary-foreground/10 px-3 py-2">
                  <span className="flex items-center gap-2"><Check className="size-4" strokeWidth={3} />{l}</span>
                  <span className="font-mono">{[432, 421, 0][i]}</span>
                </div>
              ))}
            </div>
            <Button className="mt-6 w-full rounded-full bg-background text-foreground hover:bg-background/90">
              Manage passes
            </Button>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
