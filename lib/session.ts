import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/options"

export async function getSession() {
  return await getServerSession(authOptions)
}