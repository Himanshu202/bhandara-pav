import { Link } from "@tanstack/react-router";
import { Flame, Instagram, Facebook, Twitter } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2">
              <div className="grid size-9 place-items-center rounded-xl bg-[var(--gradient-hero)]">
                <Flame className="size-5 text-primary-foreground" strokeWidth={2.5} />
              </div>
              <span className="font-display text-xl font-bold tracking-tight">
                Bhandara<span className="text-primary">Setu</span>
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-sm text-muted-foreground">
              India's modern platform for booking and managing Bhandaras — religious feasts,
              community gatherings, and charity events. Online + offline, effortlessly.
            </p>
            <div className="mt-6 flex gap-3">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="grid size-9 place-items-center rounded-full bg-background text-muted-foreground ring-1 ring-border hover:text-primary"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {[
            { title: "Platform", links: [["Book Event", "/book"], ["Pricing", "/pricing"], ["Dashboard", "/dashboard"], ["Payment", "/payment"]] },
            { title: "Company", links: [["About", "/about"], ["Contact", "/contact"], ["FAQs", "/faqs"]] },
            { title: "Legal", links: [["Terms & Conditions", "/terms"], ["Privacy Policy", "/privacy"]] },
          ].map((col) => (
            <div key={col.title}>
              <h5 className="mb-5 text-xs font-bold uppercase tracking-widest text-foreground">{col.title}</h5>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {col.links.map(([label, to]) => (
                  <li key={to}>
                    <Link to={to} className="hover:text-primary">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-8 text-xs text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} BhandaraSetu. Made with devotion in India.</p>
          <p className="font-medium">Available in English · हिन्दी</p>
        </div>
      </div>
    </footer>
  );
}
