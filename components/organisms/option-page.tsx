import { Option } from "@/components/molecules"
import React from "react"

interface OptionPageProps {
  title: string
  tags: string[]
  options: {
    redirect: string
    imageSrc: string
    imageAlt: string
    title: string
    className?: string
  }[]
}

const OptionPage: React.FC<OptionPageProps> = ({ title, tags, options }) => (
  <div className="flex flex-col gap-6 flex-grow w-full">
    <div className="flex justify-between">
      <h1 className="text-5xl font-bold text-center">{title}</h1>
      <div className="flex items-center gap-2">
        {tags.map((tag, index) => (
          <React.Fragment key={tag}>
            {index > 0 && "|"}
            <p className={`bg-${tag} h-fit px-6 py-2 rounded-full font-bold tracking-wide`}>
              {tag}
            </p>
          </React.Fragment>
        ))}
      </div>
    </div>
    <div className="flex flex-grow gap-10">
      {options.map((option) => (
        <Option key={option.redirect} {...option} />
      ))}
    </div>
  </div>
)

export default OptionPage