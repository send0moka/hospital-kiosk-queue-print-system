import { executeQuery } from "./utils"

export async function searchUmumBooking(kodeBooking: string) {
  try {
    const booking = await executeQuery(
      `SELECT b.*, p.nama, p.nomor_rekam_medis, b.status
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
      `SELECT b.*, p.nama, p.nomor_bpjs, p.fingerprint_status, b.status 
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
    console.log("Raw patient data:", patient)
    console.log("executeQuery result:", patient)
    if (Array.isArray(patient) && patient.length > 0) {
      const result = {
        ...patient[0],
        bpjs_status: patient[0].bpjs_status === 1 || patient[0].bpjs_status === true,
        fingerprint_status: patient[0].fingerprint_status === 1 || patient[0].fingerprint_status === true
      };
      console.log("Processed patient data:", result);
      return result;
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

export async function getPatientDataByBooking(kodeBooking: string) {
  console.log("getPatientDataByBooking called with:", kodeBooking);
  if (!kodeBooking) {
    console.error("kodeBooking is undefined in getPatientDataByBooking");
    return null;
  }

  try {
    const result = await executeQuery(
      `SELECT p.*, b.tanggal_booking, b.jam_booking, po.nama AS poli_nama, 
              b.id AS booking_id, b.kode_booking,
              jd.id AS jadwal_dokter_id, d.nama AS dokter_nama
       FROM booking b 
       JOIN pasien p ON b.pasien_id = p.id
       JOIN poli po ON b.poli_id = po.id
       LEFT JOIN jadwal_dokter jd ON b.jadwal_dokter_id = jd.id
       LEFT JOIN dokter d ON jd.dokter_id = d.id
       WHERE b.kode_booking = ? AND b.jenis_layanan = 'BPJS'
       LIMIT 1`,
      [kodeBooking]
    );
    console.log("Query result:", result);
    if (Array.isArray(result) && result.length > 0) {
      const patientData = result[0];
      patientData.tanggal_booking = new Date(patientData.tanggal_booking).toISOString().split('T')[0];
      return patientData;
    } else {
      console.log("No patient data found for kodeBooking:", kodeBooking);
      return null;
    }
  } catch (error) {
    console.error("Error fetching patient data:", error);
    throw error;
  }
}

export async function updateBookingStatus(bookingId: number, status: 'Menunggu' | 'Selesai') {
  try {
    await executeQuery(
      'UPDATE booking SET status = ? WHERE id = ?',
      [status, bookingId]
    );
    return true;
  } catch (error) {
    console.error("Error updating booking status:", error);
    throw error;
  }
}