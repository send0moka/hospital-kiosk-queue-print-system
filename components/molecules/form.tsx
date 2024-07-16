"use client"
import React, { useState } from "react"
import { Button } from "@/components/atoms"
import { Search } from "lucide-react"

interface FormProps {
  type: "bpjs-belum-booking" | "bpjs-sudah-booking" | "umum-belum-booking" | "umum-sudah-booking"
}

const Form: React.FC<FormProps> = ({ type }) => {
  const [inputValues, setInputValues] = useState<string[]>([])

  const getConfig = () => {
    switch (type) {
      case "bpjs-belum-booking":
        return { 
          label: "Nomor BPJS", 
          length: 12, 
          type: "number",
          description: "12 digit angka"
        }
      case "bpjs-sudah-booking":
      case "umum-sudah-booking":
        return { 
          label: "Kode Booking", 
          length: 6, 
          type: "alphanumeric",
          description: "6 digit kombinasi angka dan huruf"
        }
      case "umum-belum-booking":
        return { 
          label: "Nomor Rekam Medis", 
          length: 6, 
          type: "number",
          description: "6 digit angka"
        }
      default:
        return { label: "", length: 0, type: "text", description: "" }
    }
  }

  const config = getConfig()

  const handleInputChange = (index: number, value: string) => {
    const newInputValues = [...inputValues]
    newInputValues[index] = value

    if (config.type === "number" && !/^\d*$/.test(value)) return

    setInputValues(newInputValues)

    if (value && index < config.length - 1) {
      const nextInput = document.getElementById(`input-${index + 1}`)
      if (nextInput) nextInput.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !inputValues[index] && index > 0) {
      const prevInput = document.getElementById(`input-${index - 1}`)
      if (prevInput) prevInput.focus()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log("Form submitted with value:", inputValues.join(''))
  }

  return (
    <form onSubmit={handleSubmit} className="flex-grow flex flex-col justify-center items-center gap-4">
      <label className="font-semibold text-4xl">Masukkan {config.label}</label>
      <div className="flex gap-2">
        {[...Array(config.length)].map((_, index) => (
          <input
            key={index}
            id={`input-${index}`}
            className="rounded-xl font-semibold text-5xl py-2 w-16 text-center text-black uppercase"
            type="text"
            maxLength={1}
            value={inputValues[index] || ""}
            onChange={(e) => handleInputChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
          />
        ))}
      </div>
      <p>{config.description}</p>
      <Button variant="primary" type="submit" className="py-8 px-10">
        <Search size={24} className="mr-2" />
        Cari
      </Button>
    </form>
  )
}

export default Form