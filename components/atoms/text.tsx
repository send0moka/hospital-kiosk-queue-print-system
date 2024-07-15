import React from "react"

interface TextProps {
  className?: string
  children: React.ReactNode
}

const Text: React.FC<TextProps> = ({ className, children }) => {
  return (
    <p className={`font-medium text-xs md:text-base lg:text-[24px] ${className || ""}`}>
      {children}
    </p>
  )
}

export default Text