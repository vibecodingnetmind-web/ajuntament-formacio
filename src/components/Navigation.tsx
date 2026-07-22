import Link from 'next/link';

const links = [
  { href: '/', label: 'Inici' },
  { href: '/tramits/empadronament', label: 'Empadronament' },
  { href: '/tramits/cita', label: 'Demana cita' },
];

export default function Navigation() {
  return (
    <ul className="flex flex-col md:flex-row gap-4 md:gap-6">
      {links.map((link) => (
        <li key={link.href}>
          <Link
            href={link.href}
            className="text-gray-600 hover:text-gencat-red transition-colors font-semibold text-sm uppercase tracking-wide"
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
