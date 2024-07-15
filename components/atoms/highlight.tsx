import React from "react"

interface HighlightProps {
  className?: string
  children: React.ReactNode
}

const Highlight: React.FC<HighlightProps> = ({ className, children }) => {
  return (
    <span className={`lg:text-[24px] font-bold bg-yellow-500/50 ${className || ""}`}>
      {children}
    </span>
  )
}

export default Highlight