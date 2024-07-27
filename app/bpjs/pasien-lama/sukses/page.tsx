"use client"
import { Layout } from '@/components/organisms';
import Lottie from 'lottie-react';
import success from '@/components/atoms/success.json';

export default function SuksesPage() {
  return (
    <Layout>
      <div className="flex justify-between">
        <h1 className="text-4xl font-bold mb-4">Cetak Antrian Berhasil!</h1>
        <p className="bg-BPJS h-fit px-6 py-2 rounded-full font-bold tracking-wide">
          BPJS
        </p>
      </div>
      <div className="flex flex-col justify-center items-center flex-grow">
        <Lottie
          animationData={success}
          loop={true}
          autoPlay={true}
          style={{ width: 600, height: 600, marginTop: -250 }}
        />
        <p className="text-5xl font-medium uppercase leading-relaxed text-center -mt-28 ">
          Terima kasih telah menggunakan layanan kami
          <br />
          Silakan tunggu panggilan petugas
        </p>
      </div>
    </Layout>
  );
}