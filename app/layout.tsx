$Layout = @'
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
        <nav className="border-b">
          <div className="container mx-auto flex flex-wrap gap-4 items-center py-3">
            <Link href="/" className="font-semibold">MSME ESG Portal</Link>
            <div className="flex gap-4 text-sm">
              <Link href="/schemes" className="hover:underline">Schemes</Link>
              <Link href="/tools" className="hover:underline">Tools</Link>
              <Link href="/legal" className="hover:underline">Legal</Link>
              <Link href="/goa" className="hover:underline">Goa</Link>
              <Link href="/graph" className="hover:underline">Graph</Link>
            </div>
          </div>
        </nav>
        <main className="container mx-auto p-4 md:p-6">{children}</main>
      </body>
    </html>
  );
}
'@
Set-Content -Path "app\layout.tsx" -Value $Layout -Encoding utf8