import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell, PageHero } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, MapPin, Calendar, Users, Upload } from "lucide-react";

export const Route = createFileRoute("/book")({
  head: () => ({
    meta: [
      { title: "Book Your Bhandara — BhandaraSetu" },
      { name: "description", content: "Choose location, date, and package. Book your Bhandara in minutes." },
    ],
  }),
  component: Book,
});

const steps = ["Location", "Event details", "Date & time", "Review"];

function Book() {
  const [step, setStep] = useState(0);

  return (
    <PageShell>
      <PageHero eyebrow="Book event" title="Let's plan your Bhandara" subtitle="4 quick steps. Save progress anytime." />
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        {/* Stepper */}
        <ol className="mb-10 flex flex-wrap items-center gap-3">
          {steps.map((s, i) => (
            <li key={s} className="flex items-center gap-3">
              <div
                className={
                  "grid size-8 place-items-center rounded-full text-xs font-bold " +
                  (i <= step ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground")
                }
              >
                {i < step ? <Check className="size-4" strokeWidth={3} /> : i + 1}
              </div>
              <span className={"text-sm font-medium " + (i === step ? "text-foreground" : "text-muted-foreground")}>
                {s}
              </span>
              {i < steps.length - 1 && <span className="hidden h-px w-8 bg-border sm:block" />}
            </li>
          ))}
        </ol>

        <div className="rounded-3xl bg-card p-6 ring-1 ring-border shadow-[var(--shadow-elegant)] sm:p-10">
          {step === 0 && (
            <div className="space-y-6">
              <SectionTitle icon={MapPin} title="Where's your Bhandara?" />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="State">
                  <Select><SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger>
                    <SelectContent>
                      {["Maharashtra", "Uttar Pradesh", "Delhi", "Karnataka", "Gujarat", "Rajasthan"].map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="City"><Input placeholder="e.g. Pune" /></Field>
                <Field label="Area / Pincode"><Input placeholder="411038" /></Field>
                <Field label="Landmark (optional)"><Input placeholder="Near temple / school" /></Field>
              </div>
              <div className="grid h-56 place-items-center rounded-2xl bg-[var(--gradient-warm)] ring-1 ring-border">
                <div className="text-center">
                  <MapPin className="mx-auto size-10 text-primary" />
                  <p className="mt-2 text-sm text-muted-foreground">Interactive map preview</p>
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <SectionTitle icon={Users} title="Event details" />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Event name"><Input placeholder="Sundar Kand Bhandara" /></Field>
                <Field label="Organizer name"><Input placeholder="Your full name" /></Field>
                <Field label="Mobile number"><Input placeholder="+91 " type="tel" /></Field>
                <Field label="Email"><Input placeholder="you@example.com" type="email" /></Field>
                <Field label="Event type">
                  <Select><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>
                      {["Religious Bhandara", "Birthday Bhandara", "Community Feast", "Corporate Event", "Charity Event", "Custom Event"].map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Expected guests"><Input placeholder="200" type="number" /></Field>
              </div>
              <Field label="Special requirements">
                <Textarea placeholder="Prasad menu, aarti timing, decoration preferences..." rows={4} />
              </Field>
              <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-border p-6 hover:border-primary/50">
                <Upload className="size-5 text-muted-foreground" />
                <div className="text-sm">
                  <div className="font-medium">Upload documents / images</div>
                  <div className="text-muted-foreground">PDF, JPG, PNG up to 10 MB</div>
                </div>
                <input type="file" className="hidden" multiple />
              </label>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <SectionTitle icon={Calendar} title="Date & time" />
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Booking date"><Input type="date" /></Field>
                <Field label="Start time"><Input type="time" defaultValue="11:00" /></Field>
                <Field label="End time"><Input type="time" defaultValue="15:00" /></Field>
              </div>
              <div className="rounded-2xl bg-primary/5 p-5 ring-1 ring-primary/20">
                <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                  <Check className="size-4" strokeWidth={3} /> Real-time availability confirmed
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Your selected slot is available. Reschedule anytime up to 48 hrs before the event.
                </p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <SectionTitle icon={Check} title="Review & confirm" />
              <div className="divide-y divide-border rounded-2xl border border-border">
                {[
                  ["Venue", "Shri Ganesha Courtyard, Kothrud"],
                  ["Date", "20 Oct 2026 · 11:00–15:00"],
                  ["Event type", "Religious Bhandara · 200 guests"],
                  ["Package", "Standard — ₹299 platform fee"],
                  ["Total (est.)", "₹18,299 incl. taxes"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between p-4 text-sm">
                    <span className="text-muted-foreground">{k}</span>
                    <span className="font-semibold">{v}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Proceeding to payment. You can pay online (UPI, cards, net banking) or select
                pay-at-venue / bank deposit on the next screen.
              </p>
            </div>
          )}

          <div className="mt-10 flex justify-between gap-3">
            <Button variant="outline" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
              Back
            </Button>
            {step < steps.length - 1 ? (
              <Button onClick={() => setStep((s) => s + 1)}>Continue</Button>
            ) : (
              <Button asChild><a href="/payment">Proceed to Payment</a></Button>
            )}
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

function SectionTitle({ icon: Icon, title }: { icon: typeof MapPin; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
        <Icon className="size-5" />
      </div>
      <h2 className="font-display text-2xl font-semibold">{title}</h2>
    </div>
  );
}
