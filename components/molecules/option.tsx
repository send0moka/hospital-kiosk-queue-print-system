"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"

interface OptionProps {
  redirect: string
  imageSrc: string
  imageAlt: string
  title: string
  className?: string
}

const Option: React.FC<OptionProps> = ({
  redirect,
  imageSrc,
  imageAlt,
  title,
  className,
}) => {
  const router = useRouter()

  const handleClick = () => {
    router.push(redirect)
  }

  return (
    <div
      onClick={handleClick}
      className={`cursor-pointer w-1/2 flex flex-col justify-center items-center flex-grow bg-gradient-to-b from-white/70 to-blue-200/50 p-4 lg:px-10 lg:pt-10 rounded-3xl shadow-lg transform duration-200 hover:scale-105 ${className}`}
    >
      <Image
        src={imageSrc}
        width={500}
        height={200}
        alt={imageAlt}
        className="bg-white/50 flex-grow w-full px-32 rounded-xl"
      />
      <h2 className="font-bold text-5xl py-10">{title}</h2>
    </div>
  )
}

export default Option
