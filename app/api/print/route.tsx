import { NextResponse } from 'next/server'
import jsPDF from 'jspdf'
import fs from 'fs'
import path from 'path'

export async function POST(request: Request) {
  try {
    const { antrian } = await request.json()
    const doc = new jsPDF()
    const pdfPath = path.join(process.cwd(), 'public', 'receipts', `antrian_no${antrian.nomor_antrian}_booking${antrian.booking_id}.pdf`)
    const logoPath = path.join(process.cwd(), 'public', 'images', 'logo.png')
    const logoData = fs.readFileSync(logoPath)
    const logoBase64 = Buffer.from(logoData).toString('base64')
    doc.addImage(`data:image/png;base64,${logoBase64}`, 'PNG', 97, 10, 15, 15)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.text('Rumah Sakit Umum', 105, 30, { align: 'center' })
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.text('St. Elisabeth Purwokerto', 105, 35, { align: 'center' })
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.text('Jalan Dokter Angka No. 40 Purwokerto, 53116', 105, 39, { align: 'center' })
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(20)
    doc.text('SELAMAT DATANG', 105, 50, { align: 'center' })
    doc.text('NO. ANTRIAN ANDA', 105, 57, { align: 'center' })
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(50)
    doc.text(antrian.nomor_antrian, 105, 80, { align: 'center' })
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(14)
    doc.text(antrian.nama_pasien, 105, 90, { align: 'center' })
    doc.text(antrian.nama_poli, 105, 95, { align: 'center' })
    doc.text(antrian.nama_dokter, 105, 100, { align: 'center' })
    doc.text(`${antrian.hari}, ${antrian.jam_mulai} - ${antrian.jam_selesai}`, 105, 105, { align: 'center' })
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(20)
    doc.text('TERIMA KASIH', 105, 120, { align: 'center' })
    doc.text('ANDA TELAH MENUNGGU', 105, 127, { align: 'center' })
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    const currentDateTime = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })
    doc.text(currentDateTime, 105, 135, { align: 'center' })
    const pdfBuffer = doc.output('arraybuffer')
    await fs.promises.writeFile(pdfPath, Buffer.from(pdfBuffer))
    return NextResponse.json({ 
      success: true, 
      message: 'PDF berhasil dibuat', 
      pdfUrl: `/receipts/antrian_no${antrian.nomor_antrian}_booking${antrian.booking_id}.pdf` 
    })
  } catch (error) {
    console.error('Error saat membuat PDF:', error)
    return NextResponse.json({ success: false, message: 'Gagal membuat PDF' }, { status: 500 })
  }
}