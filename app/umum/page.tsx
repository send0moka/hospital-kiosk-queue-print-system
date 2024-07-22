import { Layout, OptionPage } from "@/components/organisms"

const Umum = () => (
  <Layout>
    <OptionPage
      title="Pilih Tipe Pasien"
      tags={["Umum"]}
      options={[
        {
          redirect: "/umum/pasien-lama",
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

export default Umum