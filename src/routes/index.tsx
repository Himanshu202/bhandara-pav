import { createFileRoute, Link } from "@tanstack/react-router";
import {
  MapPin,
  Calendar,
  Users,
  Sparkles,
  Check,
  QrCode,
  Bell,
  BarChart3,
  Wallet,
  Star,
  ArrowRight,
  ShieldCheck,
  Languages,
  IndianRupee,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/layout/PageShell";
import heroImg from "@/assets/hero-bhandara.jpg";
import venue1 from "@/assets/venue-1.jpg";
import venue2 from "@/assets/venue-2.jpg";
import venue3 from "@/assets/venue-3.jpg";

export const Route = createFileRoute("/")({
  component: Home,
});

const eventTypes = [
  "Religious Bhandara",
  "Birthday Bhandara",
  "Community Feast",
  "Corporate Event",
  "Charity Event",
  "Custom Event",
];

const venues = [
  { img: venue1, name: "Shri Ganesha Courtyard", city: "Kothrud, Pune", capacity: 500, price: 4999, rating: 4.9 },
  { img: venue2, name: "Lotus Community Hall", city: "Baner, Pune", capacity: 1200, price: 12000, rating: 4.7 },
  { img: venue3, name: "Sacred Banyan Garden", city: "Mulshi Road", capacity: 300, price: 8500, rating: 5.0 },
];

const packages = [
  {
    name: "Basic",
    tag: "Self managed",
    price: 99,
    features: ["Verified venue listings", "Booking support", "Payment tracking", "Email receipts"],
    cta: "Start Basic",
  },
  {
    name: "Standard",
    tag: "Most popular",
    price: 299,
    highlight: true,
    features: [
      "Everything in Basic",
      "Decoration coordination",
      "Guest management",
      "Digital invitations + QR passes",
      "WhatsApp reminders",
    ],
    cta: "Choose Standard",
  },
  {
    name: "Premium",
    tag: "Full service",
    price: 599,
    features: [
      "Everything in Standard",
      "Catering & menu planning",
      "Photography coverage",
      "Dedicated event manager",
      "Priority support 24×7",
    ],
    cta: "Go Premium",
  },
];

const features = [
  { icon: Sparkles, title: "AI cost estimator", desc: "Instant budget for guest count, menu and add-ons." },
  { icon: QrCode, title: "QR digital passes", desc: "Contactless entry with unique guest QR codes." },
  { icon: Bell, title: "SMS + WhatsApp alerts", desc: "Automated reminders to organizers and guests." },
  { icon: BarChart3, title: "Live tracker", desc: "Real-time seat, capacity and payment status." },
  { icon: Wallet, title: "Online + offline pay", desc: "UPI, cards, cash, bank deposit, pay at venue." },
  { icon: Languages, title: "English + हिन्दी", desc: "Full bilingual UI for organizers and guests." },
];

const timeline = [
  { title: "Venue confirmed", when: "12 Oct · 10:30 AM", note: "Shri Ganesha Courtyard accepted your request.", done: true },
  { title: "Catering finalized", when: "12 Oct · 02:15 PM", note: "Menu locked for 500 guests. Procurement started.", done: true },
  { title: "Invitations sent", when: "13 Oct · 09:00 AM", note: "312 digital invites delivered via WhatsApp.", done: true },
  { title: "Digital passes issued", when: "Pending", note: "QR entry passes to be sent 24 hrs before event.", done: false },
  { title: "Live at venue", when: "20 Oct · 11:00 AM", note: "Dedicated manager on-site with real-time tracker.", done: false },
];

function Home() {
  return (
    <PageShell>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[var(--gradient-warm)]" />
        <div className="pointer-events-none absolute -top-32 left-1/2 size-[600px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        {/* petals */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {[0, 2, 4, 6, 8].map((d) => (
            <span
              key={d}
              className="animate-petal absolute size-3 rounded-full bg-primary/40"
              style={{ left: `${10 + d * 10}%`, animationDelay: `${d}s` }}
            />
          ))}
        </div>

        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 pb-20 pt-16 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:pt-24">
          <div className="animate-float-up">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-primary" />
              </span>
              2,400+ successful events managed
            </div>
            <h1 className="text-balance text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-6xl">
              Book Your <span className="text-gradient">Bhandara</span> in Minutes
              <span className="mt-3 block text-3xl font-semibold text-muted-foreground sm:text-4xl">
                Online & Offline Management Platform
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-pretty text-lg text-muted-foreground">
              Search venues by city, lock a date, invite guests, and manage payments — all in one
              devotional-grade platform trusted by temples and organizers across India.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="h-12 rounded-full px-8 shadow-[var(--shadow-warm)]">
                <Link to="/book">Book Now <ArrowRight className="ml-1 size-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 rounded-full px-8">
                <Link to="/pricing">View Pricing</Link>
              </Button>
              <Button asChild size="lg" variant="ghost" className="h-12 rounded-full px-6">
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-6 border-t border-border/60 pt-8">
              {[
                { num: "12k+", label: "Guests hosted" },
                { num: "180+", label: "Venues onboard" },
                { num: "4.9★", label: "Organizer rating" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="font-display text-3xl font-bold text-primary">{s.num}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="relative overflow-hidden rounded-[2rem] shadow-[var(--shadow-warm)] ring-1 ring-border">
              <img
                src={heroImg}
                alt="Community Bhandara feast being served in a decorated courtyard"
                width={1600}
                height={1280}
                className="aspect-[4/5] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
            </div>
            {/* floating status card */}
            <div className="glass absolute -bottom-6 -left-6 hidden rounded-2xl p-4 shadow-[var(--shadow-elegant)] sm:block">
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-full bg-primary/15 text-primary">
                  <Check className="size-5" strokeWidth={3} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Live status</p>
                  <p className="truncate text-sm font-semibold">Varanasi venue booked</p>
                </div>
              </div>
            </div>
            <div className="glass absolute -right-4 top-8 hidden rounded-2xl p-4 shadow-[var(--shadow-elegant)] sm:block">
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-full bg-accent/25 text-accent-foreground">
                  <Users className="size-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Guests confirmed</p>
                  <p className="text-sm font-semibold">432 / 500</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEARCH */}
      <section className="relative z-10 mx-auto -mt-6 max-w-5xl px-4 sm:-mt-10 sm:px-6">
        <div className="glass rounded-3xl p-3 shadow-[var(--shadow-elegant)]">
          <div className="grid gap-2 md:grid-cols-[1fr_1fr_1fr_auto]">
            <SearchField icon={MapPin} label="State" value="Maharashtra" />
            <SearchField icon={MapPin} label="City / Area" value="Pune (Kothrud)" />
            <SearchField icon={Calendar} label="Date" value="20 Oct, 2026" />
            <Button asChild size="lg" className="h-full min-h-14 rounded-2xl px-6">
              <Link to="/book">Search Venues</Link>
            </Button>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {eventTypes.map((t, i) => (
            <span
              key={t}
              className={
                i === 0
                  ? "rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary ring-1 ring-primary/20"
                  : "rounded-full bg-secondary px-4 py-1.5 text-sm font-medium text-muted-foreground ring-1 ring-border hover:text-foreground"
              }
            >
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* VENUES */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <SectionHeading
          eyebrow="Curated venues"
          title="Sacred spaces, verified"
          sub="Handpicked temples, halls, and open-air pavilions across India — every listing verified for capacity, safety, and hospitality."
        />
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {venues.map((v) => (
            <article
              key={v.name}
              className="group overflow-hidden rounded-3xl bg-card ring-1 ring-border transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-warm)]"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={v.img}
                  alt={v.name}
                  loading="lazy"
                  width={1024}
                  height={768}
                  className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-background/90 px-2.5 py-1 text-xs font-bold backdrop-blur">
                  <Star className="size-3 fill-accent text-accent" />
                  {v.rating}
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-display text-lg font-semibold">{v.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  <MapPin className="mr-1 inline size-3.5" />
                  {v.city} · up to {v.capacity} guests
                </p>
                <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                  <div>
                    <div className="text-xs text-muted-foreground">Starts at</div>
                    <div className="font-display text-lg font-bold text-primary">
                      <IndianRupee className="inline size-4" />
                      {v.price.toLocaleString("en-IN")}
                    </div>
                  </div>
                  <Button asChild size="sm" variant="outline" className="rounded-full">
                    <Link to="/book">View <ArrowRight className="ml-1 size-3" /></Link>
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* PACKAGES */}
      <section className="border-y border-border/60 bg-secondary/40 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Service packages"
            title="Transparent platform pricing"
            sub="One-time convenience fee per event. Add-ons like catering and photography billed transparently."
          />
          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {packages.map((p) => (
              <div
                key={p.name}
                className={
                  "relative flex flex-col rounded-3xl p-8 ring-1 transition-all " +
                  (p.highlight
                    ? "bg-[var(--gradient-hero)] text-primary-foreground shadow-[var(--shadow-warm)] ring-primary lg:-translate-y-4"
                    : "bg-card ring-border hover:-translate-y-1 hover:shadow-[var(--shadow-elegant)]")
                }
              >
                {p.highlight && (
                  <span className="absolute -top-3 left-8 rounded-full bg-accent px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-accent-foreground">
                    {p.tag}
                  </span>
                )}
                {!p.highlight && (
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{p.tag}</p>
                )}
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
                  className={
                    "mt-10 h-11 w-full rounded-full " +
                    (p.highlight ? "bg-background text-foreground hover:bg-background/90" : "")
                  }
                  variant={p.highlight ? "default" : "outline"}
                >
                  <Link to="/book">{p.cta}</Link>
                </Button>
              </div>
            ))}
          </div>
          <p className="mt-10 text-center text-xs text-muted-foreground">
            + Payment gateway fee · GST as applicable · Refunds per cancellation policy
          </p>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <SectionHeading
          eyebrow="Built for organizers"
          title="Everything you need, in one place"
          sub="From the first search to the final thali served — features that respect tradition and save you hours."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl bg-card p-6 ring-1 ring-border transition-all hover:-translate-y-0.5 hover:ring-primary/30"
            >
              <div className="mb-4 grid size-11 place-items-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <f.icon className="size-5" />
              </div>
              <h4 className="font-display text-lg font-semibold">{f.title}</h4>
              <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* LIVE TRACKER */}
      <section className="border-y border-border/60 bg-[var(--gradient-warm)] py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Live booking tracker"
            title="See every step in real time"
            sub="Every booking gets a live timeline shared with the organizer, temple, and guests."
          />
          <div className="mt-14 rounded-3xl bg-card p-6 shadow-[var(--shadow-elegant)] ring-1 ring-border sm:p-10">
            <ol className="relative">
              <div className="absolute left-4 top-2 bottom-2 w-px bg-border" />
              {timeline.map((step) => (
                <li key={step.title} className="relative flex gap-5 pb-8 last:pb-0">
                  <div
                    className={
                      "z-10 grid size-8 shrink-0 place-items-center rounded-full ring-4 ring-card " +
                      (step.done ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground")
                    }
                  >
                    {step.done ? <Check className="size-4" strokeWidth={3} /> : <div className="size-2 rounded-full bg-current" />}
                  </div>
                  <div className={step.done ? "" : "opacity-60"}>
                    <div className="flex flex-wrap items-baseline gap-3">
                      <h4 className="font-display text-lg font-semibold">{step.title}</h4>
                      <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                        {step.when}
                      </span>
                    </div>
                    <p className="mt-1 max-w-xl text-sm text-muted-foreground">{step.note}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <div className="relative overflow-hidden rounded-[2rem] bg-[var(--gradient-hero)] p-10 text-primary-foreground shadow-[var(--shadow-warm)] sm:p-16">
          <div className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-primary-foreground/10 blur-2xl" />
          <div className="relative grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/15 px-3 py-1 text-xs font-bold uppercase tracking-widest">
                <ShieldCheck className="size-3.5" /> Trusted by 180+ venues
              </div>
              <h2 className="mt-4 font-display text-3xl font-bold sm:text-5xl">
                Ready to book your next Bhandara?
              </h2>
              <p className="mt-4 max-w-xl opacity-90">
                Start with a free search. Pay only when you confirm a venue. Cancel anytime as per policy.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <Button asChild size="lg" className="h-12 rounded-full bg-background px-8 text-foreground hover:bg-background/90">
                <Link to="/book">Book Now</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 rounded-full border-primary-foreground/40 bg-transparent px-8 text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Link to="/contact">Talk to Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function SectionHeading({ eyebrow, title, sub }: { eyebrow: string; title: string; sub: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary">
        {eyebrow}
      </span>
      <h2 className="mt-4 text-balance text-3xl font-bold sm:text-5xl">{title}</h2>
      <p className="mt-4 text-pretty text-muted-foreground">{sub}</p>
    </div>
  );
}

function SearchField({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MapPin;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-2xl px-4 py-3 transition-colors hover:bg-secondary/60">
      <div className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
        <Icon className="size-4" />
      </div>
      <div className="min-w-0">
        <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</div>
        <div className="truncate text-sm font-semibold">{value}</div>
      </div>
    </div>
  );
}
