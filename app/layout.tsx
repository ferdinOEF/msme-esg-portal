@'
import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "MSME ESG Compliance Portal",
  description: "Single-window ESG compliance & schemes for MSMEs (Goa, India)",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <nav className="border-b bg-white">
          <div className="container mx-auto px-4 h-14 flex items-center gap-4">
            <Link href="/" className="font-semibold">MSME-ESG</Link>
            <div className="ml-auto flex items-center gap-3 text-sm">
              <Link href="/schemes" className="px-3 py-2 hover:underline">Schemes</Link>
              <Link href="/legal" className="px-3 py-2 hover:underline">Legal</Link>
              <Link href="/tools" className="px-3 py-2 hover:underline">Tools</Link>
              <Link href="/goa" className="px-3 py-2 hover:underline">Goa</Link>
            </div>
          </div>
        </nav>
        <main className="container mx-auto px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
'@ | Set-Content -NoNewline app/layout.tsx
