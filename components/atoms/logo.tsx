import React from "react"
import Image from "next/image"

interface LogoProps {
  className?: string
}

const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <Image
      src="/images/logo.png"
      alt="Logo"
      width={1309}
      height={1309}
      className={`w-fit ${className || ""}`}
    />
  )
}

export default Logo