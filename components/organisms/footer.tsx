"use client"
import React, { useState, useEffect } from "react"
import Text from "@/components/atoms/text"

const Footer = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date())
    }, 1000) // Update setiap 1 detik

    return () => {
      clearInterval(timer) // Membersihkan interval ketika komponen unmount
    }
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  }

  return (
    <div className="flex justify-between">
      <Text>{formatTime(currentDateTime)} | {formatDate(currentDateTime)}</Text>
      <Text>Self Service Application</Text>
      <a href="bantuan"><Text>Bantuan & Informasi</Text></a>
    </div>
  )
}

export default Footer