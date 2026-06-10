import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PanelProps {
  title?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}

export function Panel({ title, icon, action, className, children }: PanelProps) {
  return (
    <section
      className={cn(
        "glass rounded-xl shadow-lg shadow-black/20 transition-colors",
        className,
      )}
    >
      {title && (
        <header className="flex items-center justify-between gap-2 border-b border-border/60 px-4 py-3">
          <div className="flex items-center gap-2">
            {icon && <span className="text-primary">{icon}</span>}
            <h2 className="text-sm font-semibold tracking-wide text-foreground/90">
              {title}
            </h2>
          </div>
          {action}
        </header>
      )}
      <div className="p-4">{children}</div>
    </section>
  );
}
