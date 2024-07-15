import React from "react"
import Image from "next/image"

const Logo = () => {
  return (
    <div className="flex items-center gap-3 mb-12">
      <Image
        src="/logo.png"
        alt="Logo"
        width={1309}
        height={1309}
        className="h-16 w-fit"
      />
      <div className="leading-tight">
        <p className="font-semibold">Rumah Sakit Umum</p>
        <h1 className="text-24-bold">St. Elisabeth Purwokerto</h1>
      </div>
    </div>
  )
}

export default Logo