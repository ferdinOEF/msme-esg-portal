$SchemesPage = @'
import { prisma } from "@/lib/db";
import SchemesClient from "./schemes-client";

export const dynamic = "force-dynamic";

export default async function SchemesPage() {
  const schemes = await prisma.scheme.findMany({ orderBy: { name: "asc" } });
  return <SchemesClient schemes={schemes as any} />;
}
'@
Set-Content -Path "app\schemes\page.tsx" -Value $SchemesPage -Encoding utf8