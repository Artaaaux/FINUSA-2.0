const footerColumns = [
  {
    title: "FITUR",
    links: [
      { label: "AI Advisor", href: "#features" },
      { label: "Budget Tracker", href: "#features" },
      { label: "Savings Goals", href: "#features" },
      { label: "Fitur Tabungan", href: "#features" },
    ],
  },
  {
    title: "RESOURCE",
    links: [
      { label: "Blog", href: "#" },
      { label: "Panduan", href: "#" },
      { label: "FAQ", href: "#" },
    ],
  },
  {
    title: "TENTANG",
    links: [
      { label: "Tentang Kami", href: "#about" },
      { label: "Kontak", href: "#" },
      { label: "Karir", href: "#" },
    ],
  },
  {
    title: "LEGAL",
    links: [
      { label: "Kebijakan Privasi", href: "#" },
      { label: "Syarat & Ketentuan", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer
      id="footer"
      className="border-t border-slate-800 bg-slate-950 text-white"
    >
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Brand + Columns */}
        <div className="mb-12 grid grid-cols-2 gap-8 md:grid-cols-5">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <a
              href="#home"
              className="text-lg font-bold tracking-tight text-white"
            >
              FINUSA
            </a>
            <p className="mt-3 text-sm leading-relaxed text-gray-400">
              Finance Nusantara, solusi literasi keuangan untuk pelajar &amp;
              generasi muda Indonesia.
            </p>
          </div>

          {/* Link columns */}
          {footerColumns.map((col) => (
            <div key={col.title}>
              <h4 className="mb-4 text-xs font-bold tracking-wider text-gray-300">
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-gray-400 transition-colors duration-200 hover:text-accent-cyan"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-8 sm:flex-row">
          <p className="flex items-center gap-1 text-sm text-gray-500">
            © {new Date().getFullYear()} FINUSA.
          </p>
          <div className="flex gap-6">
            {["GitHub", "Twitter", "Email"].map((social) => (
              <a
                key={social}
                href="#"
                className="text-sm text-gray-500 transition-colors duration-200 hover:text-accent-cyan"
                aria-label={`Kunjungi ${social} FINUSA`}
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
