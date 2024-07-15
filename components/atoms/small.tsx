import React from "react"

interface SmallProps {
  className?: string
  children: React.ReactNode
}

const Small: React.FC<SmallProps> = ({ className, children }) => {
  return (
    <p
      className={`font-medium text-xs md:text-base lg:text-[18px] opacity-60 ${className || ""}`}
      style={{ lineHeight: "3" }}
    >
      {children}
    </p>
  )
}

export default Small