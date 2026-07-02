import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Calendar, MapPin, Users } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/lib/use-auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/_authenticated/organizer")({
  head: () => ({
    meta: [{ title: "Organizer — BhandaraSetu" }],
  }),
  component: OrganizerDashboard,
});

type Booking = {
  id: string;
  booking_id: string;
  event_name: string;
  organizer_name: string | null;
  event_date: string | null;
  city: string | null;
  guests: number | null;
  booking_status: string;
  payment_status: string;
};

type Venue = {
  id: string;
  name: string;
  city: string | null;
  state: string | null;
  capacity: number | null;
};

const STATUSES = ["Pending", "Confirmed", "In Progress", "Completed", "Cancelled"];

function OrganizerDashboard() {
  const { role } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [newVenue, setNewVenue] = useState({ name: "", city: "", state: "", capacity: "" });

  if (role && role === "user") {
    return (
      <PageShell>
        <div className="mx-auto max-w-2xl px-4 py-24 text-center">
          <h1 className="font-display text-2xl font-semibold">Organizer access required</h1>
          <p className="mt-2 text-sm text-muted-foreground">Contact an admin to be assigned the organizer role.</p>
        </div>
      </PageShell>
    );
  }

  const refresh = async () => {
    const [{ data: bks }, { data: vns }] = await Promise.all([
      supabase.from("bookings").select("id,booking_id,event_name,organizer_name,event_date,city,guests,booking_status,payment_status").order("created_at", { ascending: false }),
      supabase.from("venues").select("id,name,city,state,capacity").order("created_at", { ascending: false }),
    ]);
    setBookings((bks ?? []) as Booking[]);
    setVenues((vns ?? []) as Venue[]);
  };
  useEffect(() => {
    void refresh();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("bookings").update({ booking_status: status }).eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Status updated");
      refresh();
    }
  };

  const addVenue = async () => {
    if (!newVenue.name) return;
    const { error } = await supabase.from("venues").insert({
      name: newVenue.name,
      city: newVenue.city || null,
      state: newVenue.state || null,
      capacity: newVenue.capacity ? Number(newVenue.capacity) : null,
    });
    if (error) toast.error(error.message);
    else {
      toast.success("Venue added");
      setNewVenue({ name: "", city: "", state: "", capacity: "" });
      refresh();
    }
  };

  return (
    <PageShell>
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-primary">Organizer</p>
          <h1 className="font-display text-3xl font-bold sm:text-4xl">Assigned bookings & venues</h1>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-3xl border border-border/60 bg-background/60 p-6 backdrop-blur">
            <div className="mb-4 flex items-center gap-2">
              <Calendar className="size-5 text-primary" />
              <h2 className="font-display text-xl font-semibold">Bookings</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="py-2">Booking</th>
                    <th>Event</th>
                    <th>Date</th>
                    <th>Guests</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.id} className="border-t border-border/60">
                      <td className="py-2 font-mono text-xs">{b.booking_id}</td>
                      <td>{b.event_name}<div className="text-xs text-muted-foreground">{b.city ?? "—"}</div></td>
                      <td>{b.event_date ?? "—"}</td>
                      <td><Users className="mr-1 inline size-3" />{b.guests ?? 0}</td>
                      <td>
                        <select
                          className="rounded-md border border-input bg-background px-2 py-1 text-xs"
                          value={b.booking_status}
                          onChange={(e) => updateStatus(b.id, e.target.value)}
                        >
                          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                    </tr>
                  ))}
                  {bookings.length === 0 && (
                    <tr><td colSpan={5} className="py-6 text-center text-muted-foreground">No bookings yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-3xl border border-border/60 bg-background/60 p-6 backdrop-blur">
            <div className="mb-4 flex items-center gap-2">
              <MapPin className="size-5 text-primary" />
              <h2 className="font-display text-xl font-semibold">Venues</h2>
            </div>
            <div className="mb-4 space-y-2">
              {venues.map((v) => (
                <div key={v.id} className="rounded-lg border border-border/60 p-3 text-sm">
                  <p className="font-medium">{v.name}</p>
                  <p className="text-xs text-muted-foreground">{v.city ?? "—"}, {v.state ?? "—"} · cap {v.capacity ?? "—"}</p>
                </div>
              ))}
              {venues.length === 0 && <p className="text-xs text-muted-foreground">No venues yet.</p>}
            </div>
            <div className="space-y-2 border-t border-border/60 pt-4">
              <Label>Add venue</Label>
              <Input placeholder="Name" value={newVenue.name} onChange={(e) => setNewVenue({ ...newVenue, name: e.target.value })} />
              <div className="grid grid-cols-2 gap-2">
                <Input placeholder="City" value={newVenue.city} onChange={(e) => setNewVenue({ ...newVenue, city: e.target.value })} />
                <Input placeholder="State" value={newVenue.state} onChange={(e) => setNewVenue({ ...newVenue, state: e.target.value })} />
              </div>
              <Input placeholder="Capacity" type="number" value={newVenue.capacity} onChange={(e) => setNewVenue({ ...newVenue, capacity: e.target.value })} />
              <Button onClick={addVenue} className="w-full rounded-full">Add venue</Button>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
