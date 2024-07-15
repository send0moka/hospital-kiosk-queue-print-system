import React from "react"

interface TextLowProps {
  className?: string
  children: React.ReactNode
}

const TextLow: React.FC<TextLowProps> = ({ className, children }) => {
  return (
    <p
      className={`font-medium text-xs md:text-base lg:text-[24px] opacity-60  ${className || ""}`}
      style={{ lineHeight: "2" }}
    >
      {children}
    </p>
  )
}

export default TextLow