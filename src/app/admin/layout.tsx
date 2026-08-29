import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-950">
      <AdminSidebar />
      <div className="flex flex-1 flex-col lg:pl-64">
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
