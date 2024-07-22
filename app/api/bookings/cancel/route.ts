import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/utils";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { bookingId } = await req.json();

    // Delete the booking
    await executeQuery(
      `DELETE FROM booking WHERE id = ? AND pasien_id = ?`,
      [bookingId, session.user.id]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}