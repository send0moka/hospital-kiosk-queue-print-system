"use client"
import React, { useState } from "react"
import { Button } from "@/components/atoms"
import { Search, RefreshCcw } from "lucide-react"
import { BookingModal } from "@/components/molecules"
import { Spinner } from "@radix-ui/themes"

interface FormProps {
  type:
    | "bpjs-belum-booking"
    | "bpjs-sudah-booking"
    | "umum-belum-booking"
    | "umum-sudah-booking"
}

const Form: React.FC<FormProps> = ({ type }) => {
  const [inputValues, setInputValues] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [bookingData, setBookingData] = useState<any | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const getConfig = () => {
    switch (type) {
      case "bpjs-belum-booking":
        return {
          label: "Nomor BPJS",
          length: 13,
          type: "number",
          description: "13 digit angka",
        }
      case "bpjs-sudah-booking":
      case "umum-sudah-booking":
        return {
          label: "Kode Booking",
          length: 6,
          type: "alphanumeric",
          description: "6 digit kombinasi angka dan huruf",
        }
      case "umum-belum-booking":
        return {
          label: "Nomor Rekam Medis",
          length: 6,
          type: "number",
          description: "6 digit angka",
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

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !inputValues[index] && index > 0) {
      const prevInput = document.getElementById(`input-${index - 1}`)
      if (prevInput) prevInput.focus()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const inputValue = inputValues.join("")

    try {
      let endpoint
      switch (type) {
        case "bpjs-sudah-booking":
          endpoint = `/api/bookings/search-bpjs?kode=${inputValue}`
          break
        case "umum-sudah-booking":
          endpoint = `/api/bookings/search-umum?kode=${inputValue}`
          break
        case "bpjs-belum-booking":
          endpoint = `/api/patients/search-bpjs?nomor=${inputValue}`
          break
        case "umum-belum-booking":
          endpoint = `/api/patients/search-umum?nomor=${inputValue}`
          break
      }

      const response = await fetch(endpoint)
      if (!response.ok) {
        throw new Error(
          response.status === 404 ? "Data tidak ditemukan" : "Terjadi kesalahan"
        )
      }
      const data = await response.json()
      setBookingData(data)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Terjadi kesalahan")
    } finally {
      setIsLoading(false)
      setIsModalOpen(true)
    }
  }

  const handleReset = () => {
    window.location.reload()
  }

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault()
    const pastedText = event.clipboardData.getData("text")
    const sanitizedText = pastedText
      .replace(/[^a-zA-Z0-9]/g, "")
      .slice(0, config.length)

    const newInputValues = [...inputValues]
    for (let i = 0; i < sanitizedText.length; i++) {
      if (i < config.length) {
        newInputValues[i] = sanitizedText[i]
      }
    }
    setInputValues(newInputValues)

    // Focus on the next empty input or the last input
    const nextEmptyIndex = newInputValues.findIndex((value) => !value)
    const nextInputId =
      nextEmptyIndex !== -1
        ? `input-${nextEmptyIndex}`
        : `input-${config.length - 1}`
    const nextInput = document.getElementById(nextInputId) as HTMLInputElement
    if (nextInput) {
      nextInput.focus()
    }
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex-grow flex flex-col justify-center items-center gap-4"
      >
        <label className="font-semibold text-4xl">
          Masukkan {config.label}
        </label>
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
              onPaste={index === 0 ? handlePaste : undefined}
            />
          ))}
        </div>
        <p>{config.description}</p>
        <div className="flex gap-4">
          <Button
            variant="secondary"
            type="button"
            className="py-8 px-10"
            onClick={handleReset}
          >
            <RefreshCcw size={24} className="mr-2" />
            Reset
          </Button>
          <Button
            variant="primary"
            type="submit"
            className="py-8 px-10"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Spinner className="mr-2" />
                Mencari data pasien...
              </>
            ) : (
              <>
                <Search size={24} className="mr-2" />
                Cari
              </>
            )}
          </Button>
        </div>
      </form>
      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        booking={bookingData}
        error={error}
        type={type}
      />
    </>
  )
}

export default Form
