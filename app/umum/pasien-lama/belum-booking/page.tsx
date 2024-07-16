import { Layout } from "@/components/organisms"
import { Form } from "@/components/molecules"

const UmumBelumBooking = () => (
  <Layout>
    <div className="flex justify-end items-center gap-2">
      <p
        className="bg-Umum h-fit px-6 py-2 rounded-full font-bold tracking-wide"
      >
        Umum
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
    <Form type="umum-belum-booking" />
  </Layout>
)

export default UmumBelumBooking