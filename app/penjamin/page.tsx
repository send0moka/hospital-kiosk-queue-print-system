import { Layout, OptionPage } from "@/components/organisms"

const Penjamin = () => (
  <Layout>
    <OptionPage
      title="Pilih Penjamin"
      tags={[]}
      options={[
        {
          redirect: "/bpjs",
          imageSrc: "/icons/BPJS.svg",
          imageAlt: "BPJS",
          title: "BPJS",
        },
        {
          redirect: "/umum",
          imageSrc: "/icons/people.svg",
          imageAlt: "Umum",
          title: "Umum",
          className: "px-24",
        },
      ]}
    />
  </Layout>
)

export default Penjamin
