@startuml
actor User
participant "Form Component" as Form
participant "NextAuth" as NextAuth
participant "BPJS Provider" as BPJSProvider
participant "Database" as DB

User -> Form : Memasukkan nomor BPJS
Form -> Form : Validasi input (validateBPJS)
alt Input tidak valid
    Form -> User : Tampilkan pesan error
else Input valid
    Form -> NextAuth : signIn("bpjs-credentials", {nomor_bpjs})
    NextAuth -> BPJSProvider : authorize(credentials)
    BPJSProvider -> DB : searchBPJSPatient(nomor_bpjs)
    DB --> BPJSProvider : Data pasien
    alt Pasien ditemukan
        BPJSProvider -> BPJSProvider : Cek fingerprint_status dan bpjs_status
        alt Fingerprint tidak terdaftar
            BPJSProvider --> NextAuth : Error FINGERPRINT_NOT_REGISTERED
            NextAuth --> Form : Error result
            Form -> User : Redirect ke /fingerprint
        else BPJS tidak aktif
            BPJSProvider --> NextAuth : Error BPJS_NOT_ACTIVE
            NextAuth --> Form : Error result
            Form -> User : Redirect ke /aktivasi
        else BPJS aktif dan fingerprint terdaftar
            BPJSProvider --> NextAuth : Data pasien
            NextAuth --> Form : Success result
            Form -> NextAuth : getSession()
            NextAuth --> Form : Session data
            alt BPJS status aktif
                Form -> User : Redirect ke halaman rujukan
            else BPJS status tidak aktif
                Form -> User : Redirect ke /aktivasi
            end
        end
    else Pasien tidak ditemukan
        BPJSProvider --> NextAuth : null
        NextAuth --> Form : Error result
        Form -> User : Tampilkan pesan "Nomor BPJS tidak valid"
    end
end
@enduml

Deskripsi:
Pada gambar 4 menunjukkan sequence diagram proses pencarian nomor BPJS untuk pasien yang belum booking, dimulai dari input user hingga validasi dan pencarian di database, serta menggambarkan alur keputusan berdasarkan status BPJS dan fingerprint pasien, yang berakhir dengan pengarahan user ke halaman yang sesuai atau menampilkan pesan error.

=======================================================

@startuml
actor User
participant "Form Component" as Form
participant "API Route" as API
participant "ServerUtils" as Utils
participant "Database" as DB

User -> Form : Memasukkan kode booking
Form -> Form : Validasi input
Form -> API : GET /api/bookings/search-bpjs?kode={kodeBooking}
API -> Utils : searchBPJSBooking(kodeBooking)
Utils -> DB : executeQuery(SELECT...)
DB --> Utils : Data booking
Utils --> API : Hasil pencarian
API -> API : Periksa status booking
alt Booking ditemukan
    alt Status selesai
        API --> Form : Error: Booking sudah selesai
    else Fingerprint terdaftar
        API --> Form : Data kode booking
    else Fingerprint tidak terdaftar
        API --> Form : Redirect ke /fingerprint
    end
else Booking tidak ditemukan
    API --> Form : Error: Booking tidak ditemukan
end
Form --> User : Tampilkan hasil atau error
@enduml

Deskripsi:
Pada gambar 5 menunjukkan sequence diagram proses pencarian kode booking pasien BPJS, dimulai dari input user, validasi, pencarian di database, hingga pengecekan status booking dan fingerprint, yang berakhir dengan menampilkan hasil pencarian, pesan error, atau mengarahkan user ke halaman yang sesuai berdasarkan status booking dan fingerprint.

=======================================================

@startuml
actor User
participant "Form Component" as Form
participant "NextAuth" as NextAuth
participant "Umum Provider" as UmumProvider
participant "ServerUtils" as Utils
participant "Database" as DB

User -> Form : Memasukkan nomor rekam medis
Form -> Form : Validasi input
Form -> NextAuth : signIn("umum-credentials", {nomor_rekam_medis})
NextAuth -> UmumProvider : authorize(credentials)
UmumProvider -> Utils : searchUmumPatient(nomor_rekam_medis)
Utils -> DB : executeQuery(SELECT...)
DB --> Utils : Data pasien
Utils --> UmumProvider : Hasil pencarian
alt Pasien ditemukan
    UmumProvider --> NextAuth : Data pasien
    NextAuth --> Form : Success result
    Form -> NextAuth : getSession()
    NextAuth --> Form : Session data
    Form -> User : Redirect ke halaman pilih poli
else Pasien tidak ditemukan
    UmumProvider --> NextAuth : null
    NextAuth --> Form : Error result
    Form -> User : Tampilkan pesan "Nomor rekam medis tidak valid"
end
@enduml

Deskripsi:
Pada gambar 6 menunjukkan sequence diagram proses pencarian nomor rekam medis pasien umum yang belum booking, dimulai dari input user, validasi, autentikasi melalui NextAuth, pencarian di database, hingga pengarahan user ke halaman pilih poli jika ditemukan atau menampilkan pesan error jika tidak ditemukan.

=======================================================

@startuml
actor User
participant "Form Component" as Form
participant "API Route" as API
participant "ServerUtils" as Utils
participant "Database" as DB

User -> Form : Memasukkan kode booking
Form -> Form : Validasi input
Form -> API : GET /api/bookings/search-umum?kode={kodeBooking}
API -> Utils : searchUmumBooking(kodeBooking)
Utils -> DB : executeQuery(SELECT...)
DB --> Utils : Data booking
Utils --> API : Hasil pencarian
API -> API : Periksa status booking
alt Booking ditemukan
    alt Status selesai
        API --> Form : Error: Booking sudah selesai
    else Status belum selesai
        API --> Form : Data booking
    end
else Booking tidak ditemukan
    API --> Form : Error: Booking tidak ditemukan
end
Form --> User : Tampilkan hasil atau error
@enduml

Deskripsi:
Pada gambar 7 menunjukkan sequence diagram proses pencarian kode booking pasien umum, dimulai dari input user, validasi, pencarian di database melalui API, hingga pengecekan status booking, yang berakhir dengan menampilkan data booking jika ditemukan dan belum selesai, atau menampilkan pesan error jika booking sudah selesai atau tidak ditemukan.

=======================================================

@startuml
actor User
participant "RujukanList Component" as RujukanList
participant "API Route (Rujukan)" as APIRujukan
participant "API Route (Booking)" as APIBooking
participant "Database" as DB
participant "Router" as Router

User -> RujukanList : Buka halaman rujukan
RujukanList -> APIRujukan : GET /api/rujukan?nomor_bpjs={nomorBPJS}
APIRujukan -> DB : Fetch rujukan data
DB --> APIRujukan : Return rujukan data
APIRujukan --> RujukanList : Return rujukan list
RujukanList -> User : Display rujukan list

User -> RujukanList : Pilih rujukan
RujukanList -> APIBooking : POST /api/bookings/create-bpjs
APIBooking -> DB : Create booking
DB --> APIBooking : Return booking ID
APIBooking --> RujukanList : Return booking details
RujukanList -> Router : Navigate to pilih-dokter page
Router -> User : Display pilih-dokter page
@enduml

Deskripsi:
Pada gambar 8 menunjukkan sequence diagram proses pemilihan rujukan dan pembuatan booking untuk pasien BPJS. Alur dimulai dengan user membuka halaman rujukan, sistem mengambil data rujukan dari database, menampilkan daftar rujukan, user memilih rujukan, sistem membuat booking baru, dan akhirnya mengarahkan user ke halaman pemilihan dokter. Diagram ini mengilustrasikan interaksi antara komponen frontend, API routes, database, dan navigasi dalam aplikasi.

=======================================================

@startuml
actor User
participant "PilihDokter Component" as PilihDokter
participant "API Route (Dokter)" as APIDokter
participant "API Route (Booking)" as APIBooking
participant "Database" as DB
participant "Router" as Router

User -> PilihDokter : Buka halaman pilih dokter
PilihDokter -> APIDokter : GET /api/dokter/list-by-poli?poli_id={poliId}
APIDokter -> DB : Fetch dokter data
DB --> APIDokter : Return dokter data
APIDokter --> PilihDokter : Return dokter list
PilihDokter -> User : Display dokter list

User -> PilihDokter : Pilih dokter
PilihDokter -> APIBooking : POST /api/bookings/update-doctor
APIBooking -> DB : Update booking with dokter_id
DB --> APIBooking : Confirm update
APIBooking --> PilihDokter : Return success status
PilihDokter -> Router : Navigate to pilih-jadwal page
Router -> User : Display pilih-jadwal page
@enduml

Deskripsi:
Pada gambar 9 menunjukkan sequence diagram proses pemilihan dokter untuk pasien BPJS. Alur dimulai dengan user membuka halaman pilih dokter, sistem mengambil daftar dokter dari database berdasarkan poli yang dipilih sebelumnya, menampilkan daftar dokter, user memilih dokter, sistem memperbarui booking dengan ID dokter yang dipilih, dan akhirnya mengarahkan user ke halaman pemilihan jadwal. Diagram ini mengilustrasikan interaksi antara komponen frontend, API routes untuk dokter dan booking, database, serta navigasi dalam aplikasi.

=======================================================

@startuml
actor User
participant "PilihJadwal Component" as PilihJadwal
participant "API Route (Jadwal)" as APIJadwal
participant "API Route (Booking Confirm)" as APIBookingConfirm
participant "API Route (Booking Cancel)" as APIBookingCancel
participant "Database" as DB
participant "Router" as Router

User -> PilihJadwal : Buka halaman pilih jadwal
PilihJadwal -> APIJadwal : GET /api/jadwal/list?dokter_id={dokterId}
APIJadwal -> DB : Fetch jadwal data
DB --> APIJadwal : Return jadwal data
APIJadwal --> PilihJadwal : Return jadwal list
PilihJadwal -> User : Display jadwal list

User -> PilihJadwal : Pilih jadwal
PilihJadwal -> User : Tampilkan modal konfirmasi

alt User konfirmasi booking
    User -> PilihJadwal : Konfirmasi booking
    PilihJadwal -> APIBookingConfirm : POST /api/bookings/confirm
    APIBookingConfirm -> DB : Update booking dan create/update antrian
    DB --> APIBookingConfirm : Confirm update
    APIBookingConfirm --> PilihJadwal : Return antrian details
    PilihJadwal -> Router : Navigate to cetak-antrian page
    Router -> User : Display cetak-antrian page
else User batal booking
    User -> PilihJadwal : Batal booking
    PilihJadwal -> APIBookingCancel : POST /api/bookings/cancel
    APIBookingCancel -> DB : Delete booking
    DB --> APIBookingCancel : Confirm deletion
    APIBookingCancel --> PilihJadwal : Return success status
    PilihJadwal -> Router : Navigate to belum-booking page
    Router -> User : Display belum-booking page
end
@enduml

Deskripsi:
Pada gambar 10 menunjukkan sequence diagram proses pemilihan jadwal untuk pasien BPJS. Alur dimulai dengan user membuka halaman pilih jadwal, sistem mengambil daftar jadwal dari database berdasarkan dokter yang dipilih sebelumnya, menampilkan daftar jadwal, user memilih jadwal, dan sistem menampilkan modal konfirmasi. Selanjutnya, user memiliki dua opsi:

Jika user mengkonfirmasi booking, sistem memperbarui booking, membuat atau memperbarui antrian, dan mengarahkan user ke halaman cetak antrian.
Jika user membatalkan booking, sistem menghapus booking dari database dan mengarahkan user kembali ke halaman belum booking.

Diagram ini mengilustrasikan interaksi antara komponen frontend, API routes untuk jadwal dan booking (konfirmasi dan pembatalan), database, serta navigasi dalam aplikasi.

=======================================================

@startuml
actor User
participant "CetakAntrianPage" as Page
participant "CetakAntrianClient" as Client
participant "API Route (Booking)" as APIBooking
participant "API Route (Print)" as APIPrint
participant "Database" as DB
participant "File System" as FS
participant "Router" as Router

User -> Page : Akses halaman cetak antrian
Page -> DB : getAntrianData(antrianId)
DB --> Page : Return data antrian
Page -> Client : Render dengan data antrian

Client -> APIBooking : POST /api/bookings/update-status
APIBooking -> DB : Update status booking menjadi 'Selesai'
DB --> APIBooking : Konfirmasi update
APIBooking --> Client : Return status sukses

User -> Client : Klik tombol 'Cetak'
Client -> APIPrint : POST /api/print
APIPrint -> APIPrint : Generate PDF
APIPrint -> FS : Simpan file PDF
FS --> APIPrint : Konfirmasi penyimpanan
APIPrint --> Client : Return PDF URL

Client -> Router : Navigasi ke halaman sukses
Router -> User : Tampilkan halaman sukses
@enduml

Deskripsi:
Pada gambar 11 menunjukkan sequence diagram proses pencetakan nomor antrian. Alur dimulai dari User mengakses halaman cetak antrian, sistem mengambil data dari database, memperbarui status booking, hingga proses pembuatan dan penyimpanan PDF. Diagram ini mengilustrasikan interaksi antara komponen frontend, API routes untuk booking dan pencetakan, database, sistem file, serta navigasi dalam aplikasi. Proses berakhir dengan mengarahkan User ke halaman sukses setelah PDF berhasil dibuat.

=======================================================

@startuml
actor User
participant "VerifikasiDataCheckIn" as VerifyComponent
participant "NextAuth" as NextAuth
participant "API Route (Confirm)" as APIConfirm
participant "Database" as DB
participant "Router" as Router

User -> VerifyComponent : Akses halaman verifikasi
VerifyComponent -> VerifyComponent : Tampilkan data pasien
User -> VerifyComponent : Klik "Konfirmasi"
VerifyComponent -> VerifyComponent : Buka modal konfirmasi
User -> VerifyComponent : Konfirmasi dalam modal

alt Existing Booking
    VerifyComponent -> APIConfirm : POST /api/bookings/confirm-existing
else New Booking
    VerifyComponent -> NextAuth : getServerSession()
    NextAuth --> VerifyComponent : Session data
    VerifyComponent -> APIConfirm : POST /api/bookings/confirm
end

APIConfirm -> DB : Cek antrian yang ada
DB --> APIConfirm : Data antrian (jika ada)

alt Antrian sudah ada
    APIConfirm -> DB : Update waktu antrian
else Antrian belum ada
    APIConfirm -> DB : Ambil nomor antrian terakhir
    DB --> APIConfirm : Nomor antrian terakhir
    APIConfirm -> APIConfirm : Generate nomor antrian baru
    APIConfirm -> DB : Buat antrian baru
end

APIConfirm -> DB : Update status booking
DB --> APIConfirm : Konfirmasi update

APIConfirm --> VerifyComponent : Response (antrianId, nomorAntrian)
VerifyComponent -> Router : Navigasi ke halaman cetak antrian
Router -> User : Tampilkan halaman cetak antrian
@enduml

Deskripsi:
Pada gambar 12 menunjukkan sequence diagram proses verifikasi dan check-in untuk pasien dalam sistem manajemen rumah sakit. Diagram ini menggambarkan interaksi antara User, komponen frontend, NextAuth, API, Database, dan Router. Proses dimulai dari User mengakses halaman verifikasi hingga konfirmasi check-in. Sistem kemudian memproses permintaan sesuai jenis booking (existing atau baru), memeriksa dan memperbarui data antrian di database, serta memperbarui status booking. Akhirnya, User diarahkan ke halaman cetak antrian.

=======================================================

@startuml
actor User
participant "PilihPoli Component" as PilihPoli
participant "NextAuth" as NextAuth
participant "API Route (Poli)" as APIPoli
participant "Database" as DB
participant "Router" as Router

User -> PilihPoli : Akses halaman pilih poli
PilihPoli -> NextAuth : useSession()
NextAuth --> PilihPoli : Session data
PilihPoli -> APIPoli : GET /api/poli/list
APIPoli -> DB : executeQuery (SELECT poli data)
DB --> APIPoli : Return poli data
APIPoli --> PilihPoli : Return poli list
PilihPoli -> PilihPoli : Render poli cards
PilihPoli -> User : Tampilkan daftar poli

User -> PilihPoli : Pilih poli
PilihPoli -> PilihPoli : handlePoliSelection()
PilihPoli -> Router : router.push(URL pilih dokter)
Router -> User : Navigasi ke halaman pilih dokter
@enduml

Deskripsi:
Pada gambar 13 menunjukkan sequence diagram proses pencetakan nomor antrian. Alur dimulai dari User mengakses halaman cetak antrian, sistem mengambil data dari database, memperbarui status booking, hingga proses pembuatan dan penyimpanan PDF. Diagram ini mengilustrasikan interaksi antara komponen frontend, API routes untuk booking dan pencetakan, database, sistem file, serta navigasi dalam aplikasi. Proses berakhir dengan mengarahkan User ke halaman sukses setelah PDF berhasil dibuat.

=======================================================

@startuml

class Pasien {
  -id: int
  -nomor_rekam_medis: string
  -nama: string
  -tanggal_lahir: date
  -jenis_kelamin: enum
  -alamat: string
  -nomor_telepon: string
  -nomor_bpjs: string
  -fingerprint_status: boolean
  -bpjs_status: boolean
}

class Poli {
  -id: int
  -nama: string
  -icon: string
}

class Dokter {
  -id: int
  -nama: string
  -spesialisasi: string
  -foto: string
}

class JadwalDokter {
  -id: int
  -dokter_id: int
  -poli_id: int
  -hari: enum
  -jam_mulai: time
  -jam_selesai: time
  -layanan: enum
}

class Rujukan {
  -id: int
  -pasien_id: int
  -nomor_rujukan: string
  -tanggal_rujukan: date
  -faskes_perujuk: string
  -diagnosis: string
  -poli_id: int
}

class Booking {
  -id: int
  -kode_booking: string
  -pasien_id: int
  -tanggal_booking: date
  -jam_booking: time
  -jenis_layanan: enum
  -poli_id: int
  -dokter_id: int
  -rujukan_id: int
  -jadwal_dokter_id: int
  -status: enum
}

class Antrian {
  -id: int
  -booking_id: int
  -nomor_antrian: string
  -created_at: datetime
  -jadwal_dokter_id: int
}

class ServerUtils {
  +searchUmumBooking(kodeBooking: string): Booking
  +searchBPJSBooking(kodeBooking: string): Booking
  +searchBPJSPatient(nomorBPJS: string): Pasien
  +searchUmumPatient(nomorRekamMedis: string): Pasien
  +getPatientDataByBooking(kodeBooking: string): Pasien
  +updateBookingStatus(bookingId: int, status: string): boolean
}

class NextAuth {
  +signIn(provider: string, credentials: object): Promise<Session>
  +getSession(): Session
}

class APIRoute {
  +handleRequest(req: Request, res: Response): Promise<void>
}

Pasien "1" -- "0..*" Booking
Pasien "1" -- "0..*" Rujukan
Poli "1" -- "0..*" JadwalDokter
Poli "1" -- "0..*" Booking
Dokter "1" -- "0..*" JadwalDokter
Dokter "1" -- "0..*" Booking
JadwalDokter "1" -- "0..*" Booking
JadwalDokter "1" -- "0..*" Antrian
Rujukan "0..1" -- "1" Booking
Booking "1" -- "0..1" Antrian

@enduml

=======================================================

4.2.3 perencanaan teknologi
a. Pemilihan Framework
Dalam proyek ini, Next.js dipilih sebagai framework utama untuk pengembangan sistem cetak antrian. Pemilihan ini didasarkan pada beberapa pertimbangan. Next.js menawarkan fitur server-side rendering (SSR) dan static site generation (SSG) yang dapat meningkatkan kecepatan loading dan performa aplikasi. Dengan SSR, Next.js memungkinkan konten halaman dapat diindeks dengan lebih baik oleh mesin pencari, meskipun hal ini mungkin kurang relevan untuk sistem internal rumah sakit. Next.js juga menyediakan sistem routing berbasis file yang intuitif, memudahkan pengembangan dan pengelolaan struktur aplikasi. Selain itu, Next.js memiliki dukungan bawaan untuk TypeScript, yang dapat meningkatkan keamanan tipe dan maintainability kode. Fitur API Routes memungkinkan pembuatan API endpoints dalam proyek yang sama, menyederhanakan arsitektur aplikasi. Terakhir, Next.js dibangun di atas React, memanfaatkan ekosistem komponen dan tools yang luas dari komunitas React.

b. Integrasi Database
Untuk manajemen data, MySQL dipilih sebagai sistem manajemen basis data. Integrasi MySQL dengan Next.js dilakukan melalui beberapa langkah. Pertama, menggunakan modul mysql2 untuk Node.js untuk membuat koneksi ke database MySQL. Implementasi connection pooling dilakukan untuk mengelola koneksi database secara efisien dan menghindari overhead pembuatan koneksi berulang. Pembuatan model data untuk setiap entitas utama (pasien, poli, dokter, jadwal, booking, antrian) memudahkan operasi CRUD. Pemanfaatan API routes Next.js digunakan untuk membuat endpoint yang menangani operasi database, memisahkan logika bisnis dari komponen UI. Implementasi strategi caching untuk data yang sering diakses namun jarang berubah menggunakan fitur SWR (stale-while-revalidate) dari Next.js. Penggunaan tools migrasi database dilakukan untuk mengelola struktur skema dan memudahkan deployment. Terakhir, penerapan praktik keamanan seperti prepared statements untuk mencegah SQL injection, dan enkripsi data sensitif. Integrasi ini memungkinkan sistem untuk mengelola data secara efisien, menjaga integritas data, dan mendukung operasi yang diperlukan dalam sistem cetak antrian rumah sakit.

4.2.4 Perencanaan Pengembangan
a. Timeline Pengembangan
b. Milestone Proyek
