import { Layout, OptionPage } from "@/components/organisms"

const BPJSPasienLama = () => (
  <Layout>
    <OptionPage
      title="Apakah Anda sudah booking?"
      tags={["BPJS", "Pasien Lama"]}
      options={[
        {
          redirect: "/bpjs/pasien-lama/belum-booking",
          imageSrc: "/icons/belum.svg",
          imageAlt: "belum",
          title: "Belum",
        },
        {
          redirect: "/bpjs/pasien-lama/sudah-booking",
          imageSrc: "/icons/sudah.svg",
          imageAlt: "sudah",
          title: "Sudah",
        },
      ]}
    />
  </Layout>
)

export default BPJSPasienLama