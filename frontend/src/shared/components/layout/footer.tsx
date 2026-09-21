const footerColumns = [
  {
    title: "FITUR",
    links: [
      { label: "Scan Struk AI", href: "/#features" },
      { label: "Catat Transaksi", href: "/#features" },
      { label: "Target Tabungan", href: "/#features" },
      { label: "Monitor Kas", href: "/#features" },
    ],
  },
  {
    title: "RESOURCE",
    links: [
      { label: "Pusat Bantuan & Panduan", href: "/bantuan" },
      { label: "FAQ Tabungan", href: "/bantuan?article=tambah-target-tabungan" },
    ],
  },
  {
    title: "TENTANG",
    links: [
      { label: "Tentang Kami", href: "#about" },
      { label: "Kontak", href: "#" },
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
      className="border-t border-slate-800/60 bg-slate-950 text-white"
    >
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Brand + Columns */}
        <div className="mb-10 grid grid-cols-2 gap-8 md:grid-cols-5">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <a
              href="#home"
              className="text-xl font-bold tracking-tight text-white"
            >
              FINUSA
            </a>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-400">
              Solusi pengelolaan keuangan praktis untuk pelajar &amp;
              generasi muda Indonesia.
            </p>
          </div>

          {/* Link columns */}
          {footerColumns.map((col) => (
            <div key={col.title}>
              <h4 className="mb-4 text-xs font-semibold tracking-wider text-slate-300">
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-slate-400 transition-colors duration-200 hover:text-white"
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
        <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-800/60 pt-8 sm:flex-row">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} FINUSA. Hak cipta dilindungi.
          </p>
          <div className="flex gap-6">
            {["GitHub", "Twitter", "Email"].map((social) => (
              <a
                key={social}
                href="#"
                className="text-sm text-slate-500 transition-colors duration-200 hover:text-white"
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
