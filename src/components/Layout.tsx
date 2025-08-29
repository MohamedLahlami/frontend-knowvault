import { HorizontalNavigation } from "./HorizontalNavigation";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col w-full bg-background">
      <HorizontalNavigation />

      <main className="flex-1 overflow-auto">{children}</main>

      <footer className="border-t py-3 text-center text-xs text-muted-foreground">
        2025 - Norsys Afrique
      </footer>
    </div>
  );
}
