import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/utils";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');

  if (!slug) {
    return NextResponse.json({ error: "Slug is required" }, { status: 400 });
  }

  try {
    const poli = await executeQuery(
      "SELECT id FROM poli WHERE LOWER(REPLACE(nama, ' ', '-')) = ?",
      [slug.toLowerCase()]
    );

    if (Array.isArray(poli) && poli.length > 0) {
      return NextResponse.json({ id: poli[0].id });
    } else {
      return NextResponse.json({ error: "Poli not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error fetching poli ID:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}