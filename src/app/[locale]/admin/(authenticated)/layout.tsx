import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AdminLayoutShell } from "@/components/admin/AdminLayoutShell";

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { locale } = await params;

  if (!user) {
    redirect(`/${locale}/admin/login`);
  }

  // Get pending count
  const { count: pendingCount } = await supabase
    .from("discovery_forms")
    .select("*", { count: "exact", head: true })
    .eq("created_by", user.id)
    .eq("status", "pending");

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <AdminLayoutShell
        userEmail={user.email || ""}
        pendingCount={pendingCount || 0}
        locale={locale}>
        {children}
      </AdminLayoutShell>
    </div>
  );
}
