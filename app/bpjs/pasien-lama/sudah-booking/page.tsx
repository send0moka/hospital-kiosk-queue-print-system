import { Layout } from "@/components/organisms"
import { Form } from "@/components/molecules"

const BPJSSudahBooking = () => (
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
        className="bg-Sudah Booking h-fit px-6 py-2 rounded-full font-bold tracking-wide"
      >
        Sudah Booking
      </p>
    </div>
    <Form type="bpjs-sudah-booking" />
  </Layout>
)

export default BPJSSudahBooking