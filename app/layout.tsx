import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AgroNext - Akıllı Sera",
  description: "Teknofest Tarım Teknolojileri - Akıllı sera izleme prototipi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body>
        <header style={headerStyle}>
          <Link href="/" style={logoStyle}>AgroNext</Link>
          <nav style={navStyle}>
            <Link href="/">Dashboard</Link>
            <Link href="/karsilastirma">Veriler</Link>
          </nav>
        </header>
        <main style={mainStyle}>{children}</main>
      </body>
    </html>
  );
}

const headerStyle: React.CSSProperties = {
  background: "#1a5f2a",
  color: "#fff",
  padding: "0.75rem 1.5rem",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const logoStyle: React.CSSProperties = {
  fontWeight: 700,
  fontSize: "1.25rem",
};

const navStyle: React.CSSProperties = {
  display: "flex",
  gap: "1.5rem",
};

const mainStyle: React.CSSProperties = {
  padding: "1.5rem",
  maxWidth: 1200,
  margin: "0 auto",
};
