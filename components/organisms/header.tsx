import React from "react"
import Logo from "@/components/atoms/logo"
import Text from "@/components/atoms/text"
import H1 from "@/components/atoms/h1"

const Header = () => {
  return (
    <div>
      {/* ketika di awal dan page terimakasih */}
      <div className="flex gap-4 items-center">
        <Logo className="h-10 md:h-12 lg:h-24" />
        <div>
          <Text>Rumah Sakit Umum</Text>
          <H1 className="-mt-1 lg:mt-2">St. Elisabeth Purwokerto</H1>
        </div>
      </div>

      {/* ketika di page konten */}
    </div>
  )
}

export default Header