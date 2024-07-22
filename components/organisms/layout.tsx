import { Footer, Header } from "@/components/organisms"

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => (
  <div className="flex-grow m-4 lg:mx-60 lg:my-10 flex flex-col gap-2 md:gap-10">
    <Header />
    {children}
    <Footer />
  </div>
)

export default Layout
