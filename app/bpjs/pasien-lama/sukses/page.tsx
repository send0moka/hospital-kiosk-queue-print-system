"use client"
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function SuksesPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      window.print();
      router.push('/'); // ganti '/' dengan halaman tujuan setelah sukses dan print selesai
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">Sukses!</h1>
      <p>Anda akan segera diarahkan ke halaman utama setelah pencetakan selesai.</p>
    </div>
  );
}
