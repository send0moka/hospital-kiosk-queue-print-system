import React from "react"

interface H2Props {
  className?: string
  children: React.ReactNode
}

const H2: React.FC<H2Props> = ({ className, children }) => {
  return (
    <h1 className={`font-bold md:text-lg lg:text-[32px] tracking-tight  ${className || ""}`}>
      {children}
    </h1>
  )
}

export default H2