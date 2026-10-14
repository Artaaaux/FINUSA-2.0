import React from "react";

export function SiteJsonLd() {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "FINUSA",
    alternateName: ["Finance Nusantara", "Finusa AI", "FINUSA Keuangan"],
    url: "https://finusa.web.id",
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "FINUSA - Finance Nusantara",
    applicationCategory: "FinanceApplication",
    operatingSystem: "All",
    url: "https://finusa.web.id",
    description:
      "Aplikasi pengelolaan keuangan pintar dengan fitur Struk Scan belanja otomatis, pencatatan kas, dan target tabungan terisolasi.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "IDR",
    },
    featureList: [
      "Struk Scan Belanja Otomatis (OCR)",
      "Pencatatan Pemasukan & Pengeluaran Kas",
      "Isolasi Pos Target Tabungan",
      "Integrasi Dua Arah Google Sheets",
      "Visualisasi Laporan Arus Kas",
    ],
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "FINUSA",
    alternateName: "Finance Nusantara",
    url: "https://finusa.web.id",
    logo: "https://finusa.web.id/Assets/logo-mark-80.webp",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Apakah FINUSA gratis digunakan?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Ya, FINUSA 100% gratis digunakan tanpa biaya langganan untuk membantu pelajar dan generasi muda Indonesia mengelola keuangan pribadi dengan cerdas.",
        },
      },
      {
        "@type": "Question",
        name: "Bagaimana cara kerja Struk Scan di FINUSA?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Cukup foto struk belanja fisik Anda (dari minimarket, kafe, atau toko ritel). Mesin OCR FINUSA akan membaca nama toko, tanggal, rincian barang, serta total belanja, lalu mencatatnya otomatis ke buku kas tanpa perlu mengetik manual.",
        },
      },
      {
        "@type": "Question",
        name: "Apakah data keuangan saya aman di FINUSA?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sangat aman. FINUSA menggunakan enkripsi SSL/TLS tingkat tinggi dan proteksi Row Level Security (RLS) pada database Supabase. FINUSA tidak pernah menjual data pribadi maupun data transaksi Anda kepada pihak ketiga.",
        },
      },
      {
        "@type": "Question",
        name: "Apakah FINUSA mendukung ekspor ke Google Sheets?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Ya, FINUSA menyediakan integrasi langsung ke Google Spreadsheet pribadi pengguna melalui Google OAuth resmi, sehingga seluruh data dapat dicadangkan dan diolah secara fleksibel.",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function ArticleJsonLd({
  title,
  description,
  url,
  datePublished = "2026-09-01",
}: {
  title: string;
  description: string;
  url: string;
  datePublished?: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: description,
    url: url,
    datePublished: datePublished,
    author: {
      "@type": "Organization",
      name: "FINUSA",
      url: "https://finusa.web.id",
    },
    publisher: {
      "@type": "Organization",
      name: "FINUSA",
      logo: {
        "@type": "ImageObject",
        url: "https://finusa.web.id/Assets/logo-mark-80.webp",
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
