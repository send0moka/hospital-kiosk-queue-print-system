import { executeQuery } from "./utils"

export async function searchUmumBooking(kodeBooking: string) {
  try {
    const booking = await executeQuery(
      `SELECT b.*, p.nama, p.nomor_rekam_medis 
       FROM booking b 
       JOIN pasien p ON b.pasien_id = p.id 
       WHERE b.kode_booking = ? AND b.jenis_layanan = 'Umum'`,
      [kodeBooking]
    )

    if (Array.isArray(booking) && booking.length > 0) {
      return booking[0]
    } else {
      return null
    }
  } catch (error) {
    console.error("Error searching Umum booking:", error)
    throw error
  }
}

export async function searchBPJSBooking(kodeBooking: string) {
  try {
    const booking = await executeQuery(
      `SELECT b.*, p.nama, p.nomor_bpjs, p.fingerprint_status 
       FROM booking b 
       JOIN pasien p ON b.pasien_id = p.id 
       WHERE b.kode_booking = ? AND b.jenis_layanan = 'BPJS'`,
      [kodeBooking]
    )

    if (Array.isArray(booking) && booking.length > 0) {
      return booking[0]
    } else {
      return null
    }
  } catch (error) {
    console.error("Error searching BPJS booking:", error)
    throw error
  }
}

export async function searchBPJSPatient(nomorBPJS: string) {
  console.log("searchBPJSPatient called with:", nomorBPJS);
  try {
    const patient = await executeQuery(
      `SELECT *, fingerprint_status, bpjs_status FROM pasien WHERE nomor_bpjs = ? AND id NOT IN (SELECT pasien_id FROM booking WHERE jenis_layanan = 'BPJS')`,
      [nomorBPJS]
    )
    console.log("executeQuery result:", patient);

    if (Array.isArray(patient) && patient.length > 0) {
      return patient[0]
    } else {
      return null
    }
  } catch (error) {
    console.error("Error searching BPJS patient:", error)
    throw error
  }
}

export async function searchUmumPatient(nomorRekamMedis: string) {
  try {
    const patient = await executeQuery(
      `SELECT * FROM pasien WHERE nomor_rekam_medis = ? AND id NOT IN (SELECT pasien_id FROM booking WHERE jenis_layanan = 'Umum')`,
      [nomorRekamMedis]
    )

    if (Array.isArray(patient) && patient.length > 0) {
      return patient[0]
    } else {
      return null
    }
  } catch (error) {
    console.error("Error searching Umum patient:", error)
    throw error
  }
}