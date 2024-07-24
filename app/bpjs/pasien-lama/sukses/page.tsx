"use client"
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function SuksesPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/'); // ganti '/' dengan halaman tujuan setelah sukses
    }, 5000); // Menunggu 3 detik sebelum redirect
    
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">Sukses!</h1>
      <p>Antrian Anda telah dicetak. Anda akan diarahkan ke halaman utama dalam beberapa detik.</p>
    </div>
  );
}