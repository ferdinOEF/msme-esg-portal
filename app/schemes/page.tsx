New-Item -ItemType Directory -Force app/schemes | Out-Null
@'
import { prisma } from "@/lib/db";
import SchemesClient from "./schemes-client";

export const dynamic = "force-dynamic";

export default async function SchemesPage() {
  const schemes = await prisma.scheme.findMany({
    orderBy: { createdAt: "desc" },
  });

  // Convert DB CSV to display CSV (we keep tags as CSV for now)
  const normalized = schemes.map(s => ({
    ...s,
    tags: typeof (s as any).tags === "string" ? (s as any).tags : "",
  }));

  return <SchemesClient schemes={normalized as any} />;
}
'@ | Set-Content -NoNewline app/schemes/page.tsx
