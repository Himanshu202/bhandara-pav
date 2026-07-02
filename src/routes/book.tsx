import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell, PageHero } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, MapPin, Calendar, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/use-auth";
import { toast } from "sonner";

export const Route = createFileRoute("/book")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Book Your Bhandara — BhandaraSetu" },
      { name: "description", content: "Choose location, date, and package. Book your Bhandara in minutes." },
    ],
  }),
  component: Book,
});

const steps = ["Location", "Event details", "Date & time", "Review"];
const PACKAGES: Record<string, number> = { Basic: 99, Standard: 299, Premium: 599 };

function Book() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    state: "", city: "", area: "",
    event_name: "", organizer_name: "", mobile: "",
    event_type: "", guests: "200",
    special_requirements: "",
    event_date: "", start_time: "11:00", end_time: "15:00",
    package: "Standard",
  });
  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!user) { navigate({ to: "/auth" }); return; }
    setBusy(true);
    const { data, error } = await supabase.from("bookings").insert({
      user_id: user.id,
      organizer_name: form.organizer_name,
      mobile: form.mobile,
      state: form.state,
      city: form.city,
      area: form.area,
      event_name: form.event_name,
      event_type: form.event_type,
      event_date: form.event_date || null,
      start_time: form.start_time || null,
      end_time: form.end_time || null,
      guests: Number(form.guests) || null,
      package: form.package,
      amount: PACKAGES[form.package] ?? 299,
      payment_status: "Pending",
      booking_status: "Pending",
      special_requirements: form.special_requirements,
    }).select("id").single();
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Booking created");
    navigate({ to: "/payment", search: { id: data!.id } as never });
  };

  return (
    <PageShell>
      <PageHero eyebrow="Book event" title="Let's plan your Bhandara" subtitle="4 quick steps. Save progress anytime." />
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <ol className="mb-10 flex flex-wrap items-center gap-3">
          {steps.map((s, i) => (
            <li key={s} className="flex items-center gap-3">
              <div className={"grid size-8 place-items-center rounded-full text-xs font-bold " + (i <= step ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground")}>
                {i < step ? <Check className="size-4" strokeWidth={3} /> : i + 1}
              </div>
              <span className={"text-sm font-medium " + (i === step ? "text-foreground" : "text-muted-foreground")}>{s}</span>
              {i < steps.length - 1 && <span className="hidden h-px w-8 bg-border sm:block" />}
            </li>
          ))}
        </ol>

        <div className="rounded-3xl bg-card p-6 ring-1 ring-border shadow-[var(--shadow-elegant)] sm:p-10">
          {!user && (
            <div className="mb-4 rounded-xl border border-primary/30 bg-primary/5 p-4 text-sm">
              Please <a href="/auth" className="font-semibold text-primary underline">sign in</a> to save your booking.
            </div>
          )}

          {step === 0 && (
            <div className="space-y-6">
              <SectionTitle icon={MapPin} title="Where's your Bhandara?" />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="State">
                  <Select value={form.state} onValueChange={(v) => set("state", v)}>
                    <SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger>
                    <SelectContent>
                      {["Maharashtra", "Uttar Pradesh", "Delhi", "Karnataka", "Gujarat", "Rajasthan"].map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="City"><Input value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="e.g. Pune" /></Field>
                <Field label="Area / Pincode"><Input value={form.area} onChange={(e) => set("area", e.target.value)} placeholder="411038" /></Field>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <SectionTitle icon={Users} title="Event details" />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Event name"><Input value={form.event_name} onChange={(e) => set("event_name", e.target.value)} placeholder="Sundar Kand Bhandara" /></Field>
                <Field label="Organizer name"><Input value={form.organizer_name} onChange={(e) => set("organizer_name", e.target.value)} placeholder="Your full name" /></Field>
                <Field label="Mobile number"><Input value={form.mobile} onChange={(e) => set("mobile", e.target.value)} placeholder="+91 " type="tel" /></Field>
                <Field label="Event type">
                  <Select value={form.event_type} onValueChange={(v) => set("event_type", v)}>
                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>
                      {["Religious Bhandara", "Birthday Bhandara", "Community Feast", "Corporate Event", "Charity Event", "Custom Event"].map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Expected guests"><Input value={form.guests} onChange={(e) => set("guests", e.target.value)} type="number" /></Field>
                <Field label="Package">
                  <Select value={form.package} onValueChange={(v) => set("package", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(PACKAGES).map(([k, v]) => <SelectItem key={k} value={k}>{k} — ₹{v}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </Field>
              </div>
              <Field label="Special requirements">
                <Textarea value={form.special_requirements} onChange={(e) => set("special_requirements", e.target.value)} placeholder="Prasad menu, aarti timing, decoration preferences..." rows={4} />
              </Field>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <SectionTitle icon={Calendar} title="Date & time" />
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Booking date"><Input type="date" value={form.event_date} onChange={(e) => set("event_date", e.target.value)} /></Field>
                <Field label="Start time"><Input type="time" value={form.start_time} onChange={(e) => set("start_time", e.target.value)} /></Field>
                <Field label="End time"><Input type="time" value={form.end_time} onChange={(e) => set("end_time", e.target.value)} /></Field>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <SectionTitle icon={Check} title="Review & confirm" />
              <div className="divide-y divide-border rounded-2xl border border-border">
                {[
                  ["Location", `${form.city}, ${form.state}`],
                  ["Event", `${form.event_name} · ${form.event_type}`],
                  ["Date", `${form.event_date || "—"} · ${form.start_time}–${form.end_time}`],
                  ["Guests", String(form.guests)],
                  ["Package", `${form.package} — ₹${PACKAGES[form.package]}`],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between p-4 text-sm">
                    <span className="text-muted-foreground">{k}</span>
                    <span className="font-semibold">{v}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">Payment status will stay <b>Pending</b> until live payment is enabled.</p>
            </div>
          )}

          <div className="mt-10 flex justify-between gap-3">
            <Button variant="outline" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>Back</Button>
            {step < steps.length - 1 ? (
              <Button onClick={() => setStep((s) => s + 1)}>Continue</Button>
            ) : (
              <Button onClick={submit} disabled={busy || !user}>{busy ? "Saving…" : "Confirm booking"}</Button>
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
      <div className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary"><Icon className="size-5" /></div>
      <h2 className="font-display text-2xl font-semibold">{title}</h2>
    </div>
  );
}
