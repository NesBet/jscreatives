export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-[calc(100dvh-74px)] bg-slate-950">
      {children}
    </div>
  );
}
