import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MessageCircle, MapPin } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact BhandaraSetu" },
      { name: "description", content: "Talk to our team about venues, bookings, or partnerships." },
    ],
  }),
  component: Contact,
});

function Contact() {
  return (
    <PageShell>
      <PageHero eyebrow="Contact" title="We're here to help" subtitle="Reach out by email, phone, or WhatsApp. We reply within 4 hours." />
      <section className="mx-auto grid max-w-5xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[1.2fr_1fr]">
        <form className="space-y-5 rounded-3xl bg-card p-8 ring-1 ring-border">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2"><Label>Name</Label><Input placeholder="Your name" /></div>
            <div className="space-y-2"><Label>Email</Label><Input placeholder="you@example.com" type="email" /></div>
          </div>
          <div className="space-y-2"><Label>Mobile</Label><Input placeholder="+91 " type="tel" /></div>
          <div className="space-y-2"><Label>Message</Label><Textarea rows={5} placeholder="Tell us about your Bhandara..." /></div>
          <Button size="lg" className="w-full rounded-full">Send message</Button>
        </form>

        <div className="space-y-4">
          {[
            { icon: Mail, label: "Email", value: "hello@bhandarasetu.in" },
            { icon: Phone, label: "Phone", value: "+91 98765 43210" },
            { icon: MessageCircle, label: "WhatsApp", value: "+91 98765 43210" },
            { icon: MapPin, label: "Office", value: "Pune, Maharashtra, India" },
          ].map((c) => (
            <div key={c.label} className="flex items-center gap-4 rounded-2xl bg-card p-5 ring-1 ring-border">
              <div className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
                <c.icon className="size-5" />
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{c.label}</div>
                <div className="font-semibold">{c.value}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
