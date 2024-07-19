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
  console.log("searchBPJSPatient called with:", nomorBPJS)
  try {
    const patient = await executeQuery(
      `SELECT *, fingerprint_status, bpjs_status FROM pasien WHERE nomor_bpjs = ? AND id NOT IN (SELECT pasien_id FROM booking WHERE jenis_layanan = 'BPJS')`,
      [nomorBPJS]
    )
    console.log("executeQuery result:", patient)

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

export async function getPatientDataByBPJS(nomorBpjs: string) {
  try {
    const result = await executeQuery(
      `SELECT p.*, b.tanggal_booking, b.jam_booking, po.nama AS poli_nama, d.nama AS dokter_nama
       FROM pasien p
       JOIN booking b ON p.id = b.pasien_id
       JOIN poli po ON b.poli_id = po.id
       JOIN jadwal_dokter jd ON b.poli_id = jd.poli_id
       JOIN dokter d ON jd.dokter_id = d.id
       WHERE p.nomor_bpjs = ? AND b.jenis_layanan = 'BPJS'
       ORDER BY b.tanggal_booking DESC, b.jam_booking DESC
       LIMIT 1`,
      [nomorBpjs]
    );

    if (Array.isArray(result) && result.length > 0) {
      const patientData = result[0];
      // Format tanggal_booking menjadi string YYYY-MM-DD
      patientData.tanggal_booking = new Date(patientData.tanggal_booking).toISOString().split('T')[0];
      // jam_booking sudah dalam format yang benar (HH:MM:SS)
      return patientData;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching patient data:", error);
    throw error;
  }
}