import mysql from "mysql2/promise"

let pool: mysql.Pool | null = null

if (typeof window === "undefined") {
  console.log("Attempting to create database pool with:")
  console.log("Host:", process.env.DB_HOST)
  console.log("User:", process.env.DB_USER)
  console.log("Database:", process.env.DB_NAME)
  pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  })
}

export default pool
