"use client"
import { Layout } from '@/components/organisms';

export default function BantuanPage() {
  return (
    <Layout>
      <div className="flex flex-col justify-center items-center flex-grow">
        <p className="text-5xl font-medium uppercase leading-relaxed text-center -mt-28 ">
          Bantuan dan Dukungan Teknis
          <br />
          <span className="text-3xl font-normal">
            Panggil petugas jika Anda memerlukan bantuan teknis
          </span>
        </p>
      </div>
    </Layout>
  );
}