import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import pool from "@/config/db"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function executeQuery<T>(
  query: string,
  values: any[] = []
): Promise<T> {
  if (typeof window !== "undefined") {
    throw new Error("Database queries can only be executed on the server side")
  }
  if (!pool) {
    throw new Error("Database connection not initialized")
  }
  try {
    const [results] = (await pool.query(query, values)) as unknown as [T, any]
    console.log("Database connection successful")
    return results
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

export function createSlug(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}