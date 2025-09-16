import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "MSME ESG Compliance Portal",
  description: "Single-window ESG compliance & schemes for MSMEs (Goa, India)",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b">
          <nav className="container mx-auto flex items-center gap-4 py-3">
            <Link href="/" className="font-semibold">MSME-ESG</Link>
            <div className="ml-auto flex gap-3 text-sm">
              <Link href="/schemes" className="px-3 py-2 hover:underline">Schemes</Link>
              <Link href="/goa" className="px-3 py-2 hover:underline">Goa</Link>
              <Link href="/tools" className="px-3 py-2 hover:underline">Tools</Link>
              <Link href="/legal" className="px-3 py-2 hover:underline">Legal</Link>
            </div>
          </nav>
        </header>
        <main className="container mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}
