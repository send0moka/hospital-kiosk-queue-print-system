import { Layout } from "@/components/organisms"
import { Form } from "@/components/molecules"

const BPJSBelumBooking = () => (
  <Layout>
    <div className="flex justify-end items-center gap-2">
      <p
        className="bg-BPJS h-fit px-6 py-2 rounded-full font-bold tracking-wide"
      >
        BPJS
      </p>
      |
      <p
        className="bg-Pasien Lama h-fit px-6 py-2 rounded-full font-bold tracking-wide"
      >
        Pasien Lama
      </p>
      |
      <p
        className="bg-Belum Booking h-fit px-6 py-2 rounded-full font-bold tracking-wide"
      >
        Belum Booking
      </p>
    </div>
    <Form type="bpjs-belum-booking" />
  </Layout>
)

export default BPJSBelumBooking