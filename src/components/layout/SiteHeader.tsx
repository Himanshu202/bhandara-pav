import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, Moon, Sun, Flame, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { roleHomePath, useAuth } from "@/lib/use-auth";

const publicNav = [
  { to: "/", label: "Home" },
  { to: "/book", label: "Book Event" },
  { to: "/pricing", label: "Pricing" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const { user, role, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefers = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = saved ? saved === "dark" : prefers;
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  const dashPath = roleHomePath(role);

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/", replace: true });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/75 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="grid size-9 place-items-center rounded-xl bg-[var(--gradient-hero)] shadow-[var(--shadow-warm)]">
            <Flame className="size-5 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <span className="font-display text-xl font-bold tracking-tight">
            Bhandara<span className="text-primary">Setu</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {publicNav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "!text-primary !bg-primary/10" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}
          {user && (
            <Link
              to={dashPath}
              className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "!text-primary !bg-primary/10" }}
            >
              {role === "admin" ? "Admin" : role === "organizer" ? "Organizer" : "Dashboard"}
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="grid size-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>

          {user ? (
            <>
              <Button asChild size="sm" variant="outline" className="hidden rounded-full sm:inline-flex">
                <Link to={dashPath}><LayoutDashboard className="mr-1 size-4" />My space</Link>
              </Button>
              <button
                onClick={handleSignOut}
                aria-label="Sign out"
                className="grid size-9 place-items-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                <LogOut className="size-4" />
              </button>
            </>
          ) : (
            <Button asChild size="sm" className="hidden rounded-full sm:inline-flex">
              <Link to="/auth">Sign in</Link>
            </Button>
          )}

          <button
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
            className="grid size-9 place-items-center rounded-full text-muted-foreground hover:bg-secondary lg:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "overflow-hidden border-t border-border/60 bg-background lg:hidden",
          open ? "max-h-[32rem]" : "max-h-0",
          "transition-all duration-300",
        )}
      >
        <nav className="flex flex-col p-4">
          {publicNav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "!text-primary !bg-primary/10" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}
          {user ? (
            <>
              <Link to={dashPath} onClick={() => setOpen(false)} className="rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground">
                {role === "admin" ? "Admin console" : role === "organizer" ? "Organizer" : "My dashboard"}
              </Link>
              <button onClick={() => { setOpen(false); void handleSignOut(); }} className="rounded-lg px-4 py-3 text-left text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground">
                Sign out
              </button>
            </>
          ) : (
            <Link to="/auth" onClick={() => setOpen(false)} className="rounded-lg px-4 py-3 text-sm font-medium text-primary hover:bg-primary/10">
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
