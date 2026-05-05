import { Aurora } from "@/components/ui/Aurora";
import { AppShell } from "@/components/app/AppShell";

export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="relative isolate">
      <Aurora />
      <AppShell>{children}</AppShell>
    </div>
  );
}
