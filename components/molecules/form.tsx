"use client"
import React, { useRef, useState, useEffect } from "react"
import { Button } from "@/components/atoms"
import { Search, RefreshCcw } from "lucide-react"
import { BookingModal } from "@/components/molecules"
import { Spinner } from "@radix-ui/themes"
import { useRouter } from "next/navigation"
import { getSession, signIn, useSession } from "next-auth/react"
import { z } from "zod"
import { Session } from "next-auth"
import Keyboard, { KeyboardReactInterface } from "react-simple-keyboard"
import "react-simple-keyboard/build/css/index.css"

interface FormProps {
  type:
    | "bpjs-belum-booking"
    | "bpjs-sudah-booking"
    | "umum-belum-booking"
    | "umum-sudah-booking"
}

const Form: React.FC<FormProps> = ({ type }) => {
  const router = useRouter()
  const { data: session } = useSession()
  const [layoutName, setLayoutName] = useState("default")
  const [currentInputIndex, setCurrentInputIndex] = useState(0)
  const keyboard = useRef<KeyboardReactInterface | null>(null)
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
  const [inputValues, setInputValues] = useState<string[]>(Array(config.length).fill(''))
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [bookingData, setBookingData] = useState<any | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  useEffect(() => {
    const activeInput = document.getElementById(`input-${currentInputIndex}`)
    if (activeInput) {
      activeInput.focus()
    }
  }, [currentInputIndex])
  const onKeyPress = (button: string) => {
    if (button === "{shift}" || button === "{lock}") {
      setLayoutName(layoutName === "default" ? "shift" : "default")
    } else {
      const newInputValues = [...inputValues]
      if (button === "{bksp}") {
        newInputValues[currentInputIndex] = ""
        if (currentInputIndex > 0) {
          setCurrentInputIndex(currentInputIndex - 1)
        }
      } else if (button.length === 1) {
        newInputValues[currentInputIndex] = button
        if (currentInputIndex < config.length - 1) {
          setCurrentInputIndex(currentInputIndex + 1)
        }
      }
      setInputValues(newInputValues)
    }
  }
  const handleInputFocus = (index: number) => {
    if (keyboard.current) {
      keyboard.current.setOptions({
        inputName: `input-${index}`
      })
    }
  }
  const keyboardStyle = {
    backgroundColor: 'white',
    padding: '10px',
    borderRadius: '5px',
    boxShadow: '0px 0px 10px rgba(0,0,0,0.1)'
  }
  const validateBPJS = (inputValue: string) => {
    const bpjsSchema = z
      .string()
      .length(13)
      .regex(/^\d+$/, "Nomor BPJS harus berupa 13 digit angka")
    return bpjsSchema.safeParse(inputValue)
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    const inputValue = inputValues.join("")
    if (type === "bpjs-belum-booking") {
      const validationResult = validateBPJS(inputValue)
      if (!validationResult.success) {
        setError(validationResult.error.errors[0].message)
        setIsLoading(false)
        return
      }
      try {
        console.log("Attempting to sign in with BPJS number:", inputValue)
        const result = await signIn("bpjs-credentials", {
          nomor_bpjs: inputValue,
          redirect: false,
        })
        console.log("Sign in result:", result)
        if (result?.error) {
          if (result.error === "FINGERPRINT_NOT_REGISTERED") {
            router.push("/fingerprint")
          } else if (result.error === "BPJS_NOT_ACTIVE") {
            router.push("/aktivasi")
          } else {
            setError("Nomor BPJS tidak valid")
          }
        } else if (result?.ok) {
          const session = (await getSession()) as Session | null
          console.log("Session after sign in:", session)
          if (session?.user?.bpjs_status === true) {
            router.push(`/bpjs/pasien-lama/belum-booking/${inputValue}/rujukan`)
          } else {
            router.push("/aktivasi")
          }
        }
      } catch (error) {
        console.error("Error during sign in:", error)
        setError("Terjadi kesalahan saat verifikasi")
      } finally {
        setIsLoading(false)
      }
      return
    } else if (type === "umum-belum-booking") {
      try {
        console.log("Attempting to sign in with nomor rekam medis:", inputValue)
        const result = await signIn("umum-credentials", {
          nomor_rekam_medis: inputValue,
          redirect: false,
        })
        console.log("Sign in result:", result)
        if (result?.error) {
          setError("Nomor rekam medis tidak valid")
        } else {
          const session = await getSession()
          console.log("Session after sign in:", session)
          router.push(
            `/umum/pasien-lama/belum-booking/${inputValue}/pilih-poli`
          )
        }
      } catch (error) {
        setError("Terjadi kesalahan saat verifikasi")
      } finally {
        setIsLoading(false)
      }
      return
    }
    try {
      let endpoint
      switch (type) {
        case "bpjs-sudah-booking":
          endpoint = `/api/bookings/search-bpjs?kode=${inputValue}`
          break
        case "umum-sudah-booking":
          endpoint = `/api/bookings/search-umum?kode=${inputValue}`
          break
      }
      const response = await fetch(endpoint)
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || "Terjadi kesalahan")
      }
      if (data.redirect) {
        return router.push(data.redirect)
      } else if (type === "bpjs-sudah-booking") {
        console.log("Data received:", data)
        if (data && data.kode_booking) {
          const url = `/bpjs/pasien-lama/sudah-booking/${data.kode_booking}`
          console.log("Navigating to:", url)
          router.push(url)
        } else {
          console.error("kode_booking is undefined in the response")
          setError("Kode booking tidak ditemukan dalam respons")
        }
      } else if (type === "umum-sudah-booking") {
        setBookingData(data)
        setIsModalOpen(true)
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Terjadi kesalahan")
      setBookingData(null)
      setIsModalOpen(true)
    } finally {
      setIsLoading(false)
    }
  }
  const handleReset = () => {
    window.location.reload()
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
          {inputValues.map((value, index) => (
            <input
              key={index}
              id={`input-${index}`}
              className="rounded-xl font-semibold text-5xl py-2 w-16 text-center text-black uppercase"
              type="text"
              maxLength={1}
              value={value}
              onFocus={() => handleInputFocus(index)}
              readOnly
            />
          ))}
        </div>
        {error && <p className="text-red-500">{error}</p>}
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
      <div className="mt-4" style={keyboardStyle}>
        <Keyboard
          keyboardRef={(r: KeyboardReactInterface) => (keyboard.current = r)}
          layoutName={layoutName}
          onKeyPress={onKeyPress}
          buttonTheme={[
            {
              class: "custom-btn",
              buttons: "Q W E R T Y U I O P A S D F G H J K L Z X C V B N M 1 2 3 4 5 6 7 8 9 0"
            }
          ]}
          theme={"hg-theme-default hg-layout-default custom-keyboard"}
        />
      </div>
      <style jsx global>{`
        .custom-keyboard .hg-button {
          background-color: #f0f0f0;
          color: black;
          font-size: 16px;
        }
      `}</style>
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
