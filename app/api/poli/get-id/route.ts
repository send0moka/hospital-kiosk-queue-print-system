import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/utils";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');
  if (!slug) {
    return NextResponse.json({ error: "Slug is required" }, { status: 400 });
  }
  console.log("Received slug:", slug);
  try {
    const query = "SELECT id FROM poli WHERE LOWER(REPLACE(REPLACE(nama, ' ', ''), '.', '')) = ?";
    const formattedSlug = slug.replace(/-/g, '').toLowerCase();
    const params = [formattedSlug];
    console.log("Executing query:", query, "with params:", params);
    const poli = await executeQuery(query, params);
    if (Array.isArray(poli) && poli.length > 0) {
      console.log("Found poli:", poli[0]);
      return NextResponse.json({ id: poli[0].id });
    } else {
      console.log("Poli not found for slug:", slug);
      return NextResponse.json({ error: "Poli not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error fetching poli ID:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}