export default function AdminLayout({ children }: LayoutProps<'/'>) {
  return (
    <section className="space-y-6">
      <p className="rounded-md bg-accent-soft px-3 py-2 text-sm">
        Leader tools (sign-in comes in Week 05)
      </p>
      {children}
    </section>
  );
}