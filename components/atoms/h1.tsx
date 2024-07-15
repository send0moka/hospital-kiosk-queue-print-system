import React from "react"

interface H1Props {
  className?: string
  children: React.ReactNode
}

const H1: React.FC<H1Props> = ({ className, children }) => {
  return (
    <h1 className={`font-bold md:text-3xl lg:text-[48px] tracking-tight  ${className || ""}`}>
      {children}
    </h1>
  )
}

export default H1