import React from "react"

interface TextHighProps {
  className?: string
  children: React.ReactNode
}

const TextHigh: React.FC<TextHighProps> = ({ className, children }) => {
  return (
    <p className={`font-bold text-xs md:text-base lg:text-[24px] ${className || ""}`}>
      {children}
    </p>
  )
}

export default TextHigh