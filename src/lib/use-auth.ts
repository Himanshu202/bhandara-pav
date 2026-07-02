import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type AppRole = "user" | "organizer" | "admin";

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const load = async (s: Session | null) => {
      if (!mounted) return;
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        const { data } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", s.user.id);
        if (!mounted) return;
        const roles = (data ?? []).map((r) => r.role as AppRole);
        const best: AppRole = roles.includes("admin")
          ? "admin"
          : roles.includes("organizer")
            ? "organizer"
            : "user";
        setRole(best);
      } else {
        setRole(null);
      }
      setLoading(false);
    };

    supabase.auth.getSession().then(({ data }) => load(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      load(s);
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return { session, user, role, loading, signOut };
}

export function roleHomePath(role: AppRole | null | undefined): string {
  if (role === "admin") return "/admin";
  if (role === "organizer") return "/organizer";
  return "/dashboard";
}
