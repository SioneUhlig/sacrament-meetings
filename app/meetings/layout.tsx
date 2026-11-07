import NavLinks from '@/components/NavLinks';

const LINKS = [
  { href: '/meetings', label: 'All meetings' },
  { href: '/meetings/current', label: 'This Sunday' },
];

export default function MeetingsLayout({ children }: LayoutProps<'/meetings'>) {
  return (
    <section className="space-y-6">
      <div className="border-b border-border">
        <NavLinks label="Meetings" links={LINKS} variant="section" />
      </div>
      {children}
    </section>
  );
}