import { Layout } from "@/components/organisms"
import { Form } from "@/components/molecules"

const UmumSudahBooking = () => (
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
        className="bg-Sudah Booking h-fit px-6 py-2 rounded-full font-bold tracking-wide"
      >
        Sudah Booking
      </p>
    </div>
    <Form type="umum-sudah-booking" />
  </Layout>
)

export default UmumSudahBooking
