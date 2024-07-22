import { Layout, OptionPage } from "@/components/organisms"

const BPJS = () => (
  <Layout>
    <OptionPage
      title="Pilih Tipe Pasien"
      tags={["BPJS"]}
      options={[
        {
          redirect: "/bpjs/pasien-lama",
          imageSrc: "/icons/lama.svg",
          imageAlt: "lama",
          title: "Lama",
        },
        {
          redirect: "/loket",
          imageSrc: "/icons/baru.svg",
          imageAlt: "baru",
          title: "Baru",
        },
      ]}
    />
  </Layout>
)

export default BPJS