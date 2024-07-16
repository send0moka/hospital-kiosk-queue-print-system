import { Layout, OptionPage } from "@/components/organisms"

const UmumPasienLama = () => (
  <Layout>
    <OptionPage
      title="Apakah Anda sudah booking?"
      tags={["Umum", "Pasien Lama"]}
      options={[
        {
          redirect: "/umum/pasien-lama/belum-booking",
          imageSrc: "/icons/belum.svg",
          imageAlt: "belum",
          title: "Belum",
        },
        {
          redirect: "/umum/pasien-lama/sudah-booking",
          imageSrc: "/icons/sudah.svg",
          imageAlt: "sudah",
          title: "Sudah",
        },
      ]}
    />
  </Layout>
)

export default UmumPasienLama