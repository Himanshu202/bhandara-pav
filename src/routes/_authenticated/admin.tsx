import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { BarChart3, IndianRupee, Users, Calendar, Download, MapPin, Search } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/lib/use-auth";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid,
} from "recharts";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [{ title: "Admin — BhandaraSetu" }],
  }),
  component: AdminDashboard,
});

type Booking = {
  id: string; booking_id: string; user_id: string; event_name: string; event_type: string | null;
  event_date: string | null; city: string | null; state: string | null; guests: number | null;
  amount: number | null; booking_status: string; payment_status: string; created_at: string;
};
type Payment = {
  id: string; booking_id: string; amount: number; payment_method: string | null;
  payment_status: string; transaction_id: string | null; created_at: string;
};
type Profile = { id: string; full_name: string | null; email: string | null; phone: string | null; created_at: string };
type UserRole = { user_id: string; role: "user" | "organizer" | "admin" };

const STATUSES = ["Pending", "Confirmed", "In Progress", "Completed", "Cancelled"];
const PAY_STATUSES = ["Pending", "Paid", "Refunded", "Failed"];

function AdminDashboard() {
  const { role, loading } = useAuth();
  const [tab, setTab] = useState<"overview" | "bookings" | "payments" | "users" | "venues">("overview");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [venues, setVenues] = useState<Array<{ id: string; name: string; city: string | null; state: string | null; capacity: number | null }>>([]);
  const [query, setQuery] = useState("");

  const refresh = async () => {
    const [{ data: bks }, { data: pmts }, { data: profs }, { data: rls }, { data: vns }] = await Promise.all([
      supabase.from("bookings").select("*").order("created_at", { ascending: false }),
      supabase.from("payments").select("*").order("created_at", { ascending: false }),
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("user_roles").select("user_id,role"),
      supabase.from("venues").select("id,name,city,state,capacity").order("created_at", { ascending: false }),
    ]);
    setBookings((bks ?? []) as Booking[]);
    setPayments((pmts ?? []) as Payment[]);
    setProfiles((profs ?? []) as Profile[]);
    setRoles((rls ?? []) as UserRole[]);
    setVenues((vns ?? []) as typeof venues);
  };

  useEffect(() => {
    if (role === "admin") void refresh();
  }, [role]);

  const revenueByMonth = useMemo(() => {
    const map = new Map<string, number>();
    for (const b of bookings) {
      const k = (b.created_at ?? "").slice(0, 7);
      map.set(k, (map.get(k) ?? 0) + Number(b.amount ?? 0));
    }
    return [...map.entries()].sort().map(([month, revenue]) => ({ month, revenue }));
  }, [bookings]);

  const usersByMonth = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of profiles) {
      const k = (p.created_at ?? "").slice(0, 7);
      map.set(k, (map.get(k) ?? 0) + 1);
    }
    return [...map.entries()].sort().map(([month, users]) => ({ month, users }));
  }, [profiles]);

  const bookingsByStatus = useMemo(() => {
    const map = new Map<string, number>();
    for (const b of bookings) map.set(b.booking_status, (map.get(b.booking_status) ?? 0) + 1);
    return [...map.entries()].map(([status, count]) => ({ status, count }));
  }, [bookings]);

  const totals = useMemo(() => ({
    revenue: bookings.reduce((s, b) => s + Number(b.amount ?? 0), 0),
    bookings: bookings.length,
    users: profiles.length,
    venues: venues.length,
  }), [bookings, profiles, venues]);

  const filterMatch = (s: string) => s.toLowerCase().includes(query.toLowerCase());

  const filteredBookings = useMemo(
    () => !query ? bookings : bookings.filter((b) =>
      filterMatch(b.booking_id) || filterMatch(b.event_name) || filterMatch(b.city ?? "") || filterMatch(b.booking_status),
    ),
    [bookings, query],
  );
  const filteredPayments = useMemo(
    () => !query ? payments : payments.filter((p) =>
      filterMatch(p.transaction_id ?? "") || filterMatch(p.payment_status) || filterMatch(p.payment_method ?? ""),
    ),
    [payments, query],
  );
  const filteredUsers = useMemo(
    () => !query ? profiles : profiles.filter((p) =>
      filterMatch(p.email ?? "") || filterMatch(p.full_name ?? "") || filterMatch(p.phone ?? ""),
    ),
    [profiles, query],
  );

  const updateBookingStatus = async (id: string, booking_status: string) => {
    const { error } = await supabase.from("bookings").update({ booking_status }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Booking updated"); refresh();
  };
  const updatePaymentStatus = async (id: string, payment_status: string) => {
    const { error } = await supabase.from("payments").update({ payment_status }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Payment updated"); refresh();
  };
  const setUserRole = async (user_id: string, next: "user" | "organizer" | "admin") => {
    await supabase.from("user_roles").delete().eq("user_id", user_id);
    const { error } = await supabase.from("user_roles").insert({ user_id, role: next });
    if (error) return toast.error(error.message);
    toast.success("Role updated"); refresh();
  };

  const exportCSV = (rows: Record<string, unknown>[], name: string) => {
    if (!rows.length) return toast.info("Nothing to export");
    const cols = Object.keys(rows[0]);
    const csv = [cols.join(","), ...rows.map((r) => cols.map((c) => JSON.stringify(r[c] ?? "")).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${name}.csv`;
    a.click();
  };
  const exportPDF = (title: string, rows: Record<string, unknown>[]) => {
    const w = window.open("", "_blank");
    if (!w) return;
    const cols = rows[0] ? Object.keys(rows[0]) : [];
    w.document.write(`<title>${title}</title><style>body{font-family:system-ui;padding:24px}table{width:100%;border-collapse:collapse;font-size:12px}th,td{border:1px solid #ddd;padding:6px;text-align:left}h1{color:#F97316}</style><h1>${title}</h1><table><thead><tr>${cols.map((c) => `<th>${c}</th>`).join("")}</tr></thead><tbody>${rows.map((r) => `<tr>${cols.map((c) => `<td>${String(r[c] ?? "")}</td>`).join("")}</tr>`).join("")}</tbody></table><script>window.print()</script>`);
    w.document.close();
  };

  const roleOf = (uid: string) => roles.find((r) => r.user_id === uid)?.role ?? "user";

  if (loading) return <PageShell><div className="p-24 text-center">Loading…</div></PageShell>;
  if (role !== "admin") {
    return (
      <PageShell>
        <div className="mx-auto max-w-2xl px-4 py-24 text-center">
          <h1 className="font-display text-2xl font-semibold">Admin access required</h1>
          <p className="mt-2 text-sm text-muted-foreground">You are signed in but don't have admin privileges.</p>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary">Admin console</p>
            <h1 className="font-display text-3xl font-bold sm:text-4xl">Platform overview</h1>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-input bg-background px-3 py-1.5">
            <Search className="size-4 text-muted-foreground" />
            <input
              className="w-64 bg-transparent text-sm outline-none"
              placeholder="Search bookings, users, payments…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {(["overview", "bookings", "payments", "users", "venues"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-full px-4 py-2 text-sm font-medium capitalize ${tab === t ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <Stat icon={IndianRupee} label="Total revenue" value={`₹${totals.revenue.toLocaleString()}`} />
              <Stat icon={Calendar} label="Bookings" value={String(totals.bookings)} />
              <Stat icon={Users} label="Users" value={String(totals.users)} />
              <Stat icon={MapPin} label="Venues" value={String(totals.venues)} />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card title="Revenue by month">
                <ResponsiveContainer width="100%" height={240}>
                  <LineChart data={revenueByMonth}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="month" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Line type="monotone" dataKey="revenue" stroke="#F97316" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
              <Card title="User growth">
                <ResponsiveContainer width="100%" height={240}>
                  <LineChart data={usersByMonth}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="month" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Line type="monotone" dataKey="users" stroke="#D4A017" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
              <Card title="Bookings by status" className="lg:col-span-2">
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={bookingsByStatus}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="status" fontSize={12} />
                    <YAxis fontSize={12} allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#F97316" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>
          </div>
        )}

        {tab === "bookings" && (
          <Card
            title={`Bookings (${filteredBookings.length})`}
            actions={
              <>
                <Button size="sm" variant="outline" className="rounded-full" onClick={() => exportCSV(filteredBookings as unknown as Record<string, unknown>[], "bookings")}>
                  <Download className="mr-1 size-3" /> Excel
                </Button>
                <Button size="sm" variant="outline" className="rounded-full" onClick={() => exportPDF("Bookings", filteredBookings as unknown as Record<string, unknown>[])}>
                  PDF
                </Button>
              </>
            }
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-xs uppercase text-muted-foreground">
                  <tr><th className="py-2">Booking</th><th>Event</th><th>City</th><th>Date</th><th>Amount</th><th>Payment</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {filteredBookings.map((b) => (
                    <tr key={b.id} className="border-t border-border/60">
                      <td className="py-2 font-mono text-xs">{b.booking_id}</td>
                      <td>{b.event_name}</td>
                      <td>{b.city ?? "—"}</td>
                      <td>{b.event_date ?? "—"}</td>
                      <td>₹{Number(b.amount ?? 0).toLocaleString()}</td>
                      <td>{b.payment_status}</td>
                      <td>
                        <select className="rounded-md border border-input bg-background px-2 py-1 text-xs" value={b.booking_status} onChange={(e) => updateBookingStatus(b.id, e.target.value)}>
                          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {tab === "payments" && (
          <Card
            title={`Payments (${filteredPayments.length})`}
            actions={
              <>
                <Button size="sm" variant="outline" className="rounded-full" onClick={() => exportCSV(filteredPayments as unknown as Record<string, unknown>[], "payments")}>
                  <Download className="mr-1 size-3" /> Excel
                </Button>
                <Button size="sm" variant="outline" className="rounded-full" onClick={() => exportPDF("Payments", filteredPayments as unknown as Record<string, unknown>[])}>
                  PDF
                </Button>
              </>
            }
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-xs uppercase text-muted-foreground">
                  <tr><th className="py-2">Txn</th><th>Booking</th><th>Amount</th><th>Method</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {filteredPayments.map((p) => (
                    <tr key={p.id} className="border-t border-border/60">
                      <td className="py-2 font-mono text-xs">{p.transaction_id ?? p.id.slice(0, 8)}</td>
                      <td className="font-mono text-xs">{p.booking_id.slice(0, 8)}</td>
                      <td>₹{Number(p.amount).toLocaleString()}</td>
                      <td>{p.payment_method ?? "—"}</td>
                      <td>
                        <select className="rounded-md border border-input bg-background px-2 py-1 text-xs" value={p.payment_status} onChange={(e) => updatePaymentStatus(p.id, e.target.value)}>
                          {PAY_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                    </tr>
                  ))}
                  {filteredPayments.length === 0 && <tr><td colSpan={5} className="py-6 text-center text-muted-foreground">No payments yet.</td></tr>}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {tab === "users" && (
          <Card
            title={`Users (${filteredUsers.length})`}
            actions={
              <Button size="sm" variant="outline" className="rounded-full" onClick={() => exportCSV(filteredUsers as unknown as Record<string, unknown>[], "users")}>
                <Download className="mr-1 size-3" /> Excel
              </Button>
            }
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-xs uppercase text-muted-foreground">
                  <tr><th className="py-2">Name</th><th>Email</th><th>Phone</th><th>Role</th></tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="border-t border-border/60">
                      <td className="py-2">{u.full_name ?? "—"}</td>
                      <td>{u.email ?? "—"}</td>
                      <td>{u.phone ?? "—"}</td>
                      <td>
                        <select className="rounded-md border border-input bg-background px-2 py-1 text-xs" value={roleOf(u.id)} onChange={(e) => setUserRole(u.id, e.target.value as "user" | "organizer" | "admin")}>
                          <option value="user">user</option>
                          <option value="organizer">organizer</option>
                          <option value="admin">admin</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {tab === "venues" && (
          <Card title={`Venues (${venues.length})`}>
            <ul className="divide-y divide-border/60">
              {venues.map((v) => (
                <li key={v.id} className="flex items-center justify-between py-3 text-sm">
                  <div>
                    <p className="font-medium">{v.name}</p>
                    <p className="text-xs text-muted-foreground">{v.city ?? "—"}, {v.state ?? "—"} · capacity {v.capacity ?? "—"}</p>
                  </div>
                  <Button size="sm" variant="ghost" onClick={async () => {
                    await supabase.from("venues").delete().eq("id", v.id);
                    refresh();
                  }}>Delete</Button>
                </li>
              ))}
              {venues.length === 0 && <p className="py-6 text-center text-sm text-muted-foreground">No venues yet.</p>}
            </ul>
          </Card>
        )}
      </section>
    </PageShell>
  );
}

function Stat({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-background/60 p-5 backdrop-blur">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
        <Icon className="size-4 text-primary" />
      </div>
      <p className="font-display text-2xl font-bold">{value}</p>
    </div>
  );
}

function Card({ title, actions, children, className = "" }: { title: string; actions?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-3xl border border-border/60 bg-background/60 p-6 backdrop-blur ${className}`}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <BarChart3 className="size-5 text-primary" />
          <h2 className="font-display text-lg font-semibold">{title}</h2>
        </div>
        <div className="flex gap-2">{actions}</div>
      </div>
      {children}
    </div>
  );
}
