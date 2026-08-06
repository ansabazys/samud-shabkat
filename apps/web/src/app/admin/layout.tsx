import { AuthGuard } from "@/components/auth/auth-guard";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard requireAdmin={true}>
      <div className="min-h-screen bg-slate-950 text-white flex">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <AdminHeader />
          <main className="flex-1 p-8 overflow-y-auto">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
