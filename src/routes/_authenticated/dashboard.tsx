import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Calendar, Download, Plus, User as UserIcon, IndianRupee, Clock } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/use-auth";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "My Dashboard — BhandaraSetu" },
      { name: "description", content: "Track your bookings, invoices, and profile." },
    ],
  }),
  component: UserDashboard,
});

type Booking = {
  id: string;
  booking_id: string;
  event_name: string;
  event_date: string | null;
  guests: number | null;
  amount: number | null;
  payment_status: string;
  booking_status: string;
  city: string | null;
};

function UserDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [profile, setProfile] = useState({ full_name: "", phone: "", email: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    void (async () => {
      const [{ data: bks }, { data: prof }] = await Promise.all([
        supabase
          .from("bookings")
          .select("id,booking_id,event_name,event_date,guests,amount,payment_status,booking_status,city")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false }),
        supabase.from("profiles").select("full_name,phone,email").eq("id", user.id).maybeSingle(),
      ]);
      setBookings((bks ?? []) as Booking[]);
      if (prof) setProfile({ full_name: prof.full_name ?? "", phone: prof.phone ?? "", email: prof.email ?? "" });
    })();
  }, [user]);

  const saveProfile = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: profile.full_name, phone: profile.phone })
      .eq("id", user.id);
    setSaving(false);
    if (error) toast.error(error.message);
    else toast.success("Profile updated");
  };

  const downloadInvoice = (b: Booking) => {
    const html = `<!doctype html><meta charset="utf-8"><title>Invoice ${b.booking_id}</title>
<style>body{font-family:system-ui;max-width:640px;margin:40px auto;padding:24px;border:1px solid #eee}h1{color:#F97316}</style>
<h1>BhandaraSetu Invoice</h1>
<p><b>Booking:</b> ${b.booking_id}</p>
<p><b>Event:</b> ${b.event_name}</p>
<p><b>Date:</b> ${b.event_date ?? "—"}</p>
<p><b>Guests:</b> ${b.guests ?? "—"}</p>
<p><b>Amount:</b> ₹${b.amount ?? 0}</p>
<p><b>Payment:</b> ${b.payment_status}</p>`;
    const blob = new Blob([html], { type: "text/html" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `invoice-${b.booking_id}.html`;
    a.click();
  };

  return (
    <PageShell>
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary">My dashboard</p>
            <h1 className="mt-1 font-display text-3xl font-bold sm:text-4xl">Namaste, {profile.full_name || "friend"}</h1>
          </div>
          <Button asChild className="rounded-full">
            <Link to="/book"><Plus className="mr-2 size-4" /> New booking</Link>
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-3xl border border-border/60 bg-background/60 p-6 backdrop-blur">
            <div className="mb-4 flex items-center gap-2">
              <Calendar className="size-5 text-primary" />
              <h2 className="font-display text-xl font-semibold">My bookings</h2>
            </div>
            {bookings.length === 0 ? (
              <p className="text-sm text-muted-foreground">No bookings yet. Create your first one.</p>
            ) : (
              <div className="divide-y divide-border/60">
                {bookings.map((b) => (
                  <div key={b.id} className="flex flex-wrap items-center gap-3 py-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{b.event_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {b.booking_id} · {b.city ?? "—"} · {b.event_date ?? "—"} · {b.guests ?? 0} guests
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                      <Clock className="size-3" /> {b.booking_status}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent-foreground">
                      <IndianRupee className="size-3" />
                      {b.amount ?? 0} · {b.payment_status}
                    </span>
                    <Button size="sm" variant="outline" className="rounded-full" onClick={() => downloadInvoice(b)}>
                      <Download className="mr-1 size-3" /> Invoice
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-border/60 bg-background/60 p-6 backdrop-blur">
            <div className="mb-4 flex items-center gap-2">
              <UserIcon className="size-5 text-primary" />
              <h2 className="font-display text-xl font-semibold">Profile</h2>
            </div>
            <div className="space-y-3">
              <div>
                <Label>Email</Label>
                <Input value={profile.email} disabled />
              </div>
              <div>
                <Label>Full name</Label>
                <Input value={profile.full_name} onChange={(e) => setProfile((p) => ({ ...p, full_name: e.target.value }))} />
              </div>
              <div>
                <Label>Phone</Label>
                <Input value={profile.phone} onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))} />
              </div>
              <Button onClick={saveProfile} disabled={saving} className="w-full rounded-full">
                {saving ? "Saving…" : "Save profile"}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
