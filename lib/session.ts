import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function getSession(req?: any, res?: any) {
  return await getServerSession(req, res, authOptions)
}