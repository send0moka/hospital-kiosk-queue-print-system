-- Membuat database
CREATE DATABASE IF NOT EXISTS db;
USE db;

-- Tabel Pasien
CREATE TABLE IF NOT EXISTS pasien (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nomor_rekam_medis VARCHAR(6) UNIQUE NOT NULL,
    nama VARCHAR(100) NOT NULL,
    tanggal_lahir DATE NOT NULL,
    jenis_kelamin ENUM('L', 'P') NOT NULL,
    alamat TEXT,
    nomor_telepon VARCHAR(15),
    nomor_bpjs VARCHAR(13), 
    fingerprint_status BOOLEAN DEFAULT FALSE,
    bpjs_status BOOLEAN DEFAULT FALSE
);

-- Tabel Poli
CREATE TABLE IF NOT EXISTS poli (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(50) NOT NULL,
    icon VARCHAR(50) NOT NULL
);

-- Tabel Dokter
CREATE TABLE IF NOT EXISTS dokter (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(200) NOT NULL,
    spesialisasi VARCHAR(100),
    foto VARCHAR(100)
);

-- Tabel Jadwal Dokter
CREATE TABLE IF NOT EXISTS jadwal_dokter (
    id INT AUTO_INCREMENT PRIMARY KEY,
    dokter_id INT,
    poli_id INT,
    hari ENUM('Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'),
    jam_mulai TIME,
    jam_selesai TIME,
    layanan ENUM('Semua', 'BPJS', 'Umum') DEFAULT 'Semua',
    FOREIGN KEY (dokter_id) REFERENCES dokter(id),
    FOREIGN KEY (poli_id) REFERENCES poli(id)
);

-- Tabel Rujukan
CREATE TABLE IF NOT EXISTS rujukan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pasien_id INT,
    nomor_rujukan VARCHAR(20) UNIQUE NOT NULL,
    tanggal_rujukan DATE NOT NULL,
    faskes_perujuk VARCHAR(100) NOT NULL,
    diagnosis VARCHAR(200) NOT NULL,
    poli_id INT,
    FOREIGN KEY (pasien_id) REFERENCES pasien(id),
    FOREIGN KEY (poli_id) REFERENCES poli(id)
);

-- Tabel Booking
CREATE TABLE IF NOT EXISTS booking (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kode_booking VARCHAR(6) UNIQUE NOT NULL,
    pasien_id INT,
    tanggal_booking DATE NOT NULL,
    jam_booking TIME NOT NULL,
    jenis_layanan ENUM('BPJS', 'Umum') NOT NULL,
    poli_id INT,
    dokter_id INT,
    rujukan_id INT,
    jadwal_dokter_id INT,
    status ENUM('Menunggu', 'Selesai') DEFAULT 'Menunggu',
    FOREIGN KEY (pasien_id) REFERENCES pasien(id),
    FOREIGN KEY (poli_id) REFERENCES poli(id),
    FOREIGN KEY (dokter_id) REFERENCES dokter(id),
    FOREIGN KEY (rujukan_id) REFERENCES rujukan(id),
    FOREIGN KEY (jadwal_dokter_id) REFERENCES jadwal_dokter(id)
);

-- Tabel Antrian
CREATE TABLE IF NOT EXISTS antrian (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT,
    nomor_antrian VARCHAR(3) NOT NULL,
    created_at DATETIME DEFAULT (CURRENT_TIMESTAMP),
    jadwal_dokter_id INT,
    FOREIGN KEY (booking_id) REFERENCES booking(id),
    FOREIGN KEY (jadwal_dokter_id) REFERENCES jadwal_dokter(id),
    UNIQUE KEY (created_at, nomor_antrian)
);

-- Insert data pasien
INSERT INTO pasien (nomor_rekam_medis, nama, tanggal_lahir, jenis_kelamin, alamat, nomor_telepon, nomor_bpjs, fingerprint_status, bpjs_status) VALUES
-- Pasien BPJS Benar | Sudah Booking | 1-5
('123456', 'John Doe', '1990-01-01', 'L', 'Jl. Contoh No. 123, Sokanegara, Kec. Purwokerto Timur, Kab. Banyumas, Jawa Tengah 53161', '081234567890', '0001234567890', TRUE, TRUE),
('234567', 'Jane Smith', '1995-05-05', 'P', 'Jl. Sample No. 456', '082345678901', '0002345678901', TRUE, TRUE),
('345678', 'Bob Johnson', '1985-03-15', 'L', 'Jl. Test No. 789', '083456789012', '0003456789012', TRUE, TRUE),
('456789', 'Alice Brown', '1992-07-20', 'P', 'Jl. Demo No. 101', '084567890123', '0004567890123', TRUE, TRUE),
('567890', 'Charlie Davis', '1988-11-30', 'L', 'Jl. Experiment No. 202', '085678901234', '0005678901234', TRUE, TRUE),
-- Pasien BPJS Salah | Sudah Booking | 6-10
('678901', 'Diana Evans', '1993-09-25', 'P', 'Jl. Trial No. 303', '086789012345', '0006789012345', TRUE, FALSE),
('789012', 'Edward Foster', '1987-02-14', 'L', 'Jl. Example No. 404', '087890123456', '0007890123456', FALSE, TRUE),
('890123', 'Grace Harris', '1991-12-05', 'P', 'Jl. Instance No. 505', '088901234567', '0008901234567', FALSE, FALSE),
('901234', 'Frank White', '1989-08-18', 'L', 'Jl. Sample No. 606', '089012345678', '0009012345678', TRUE, FALSE),
('012345', 'Helen Black', '1994-04-22', 'P', 'Jl. Example No. 707', '090123456789', '0012345678901', FALSE, TRUE),
-- Pasien BPJS Benar | Belum Booking | 11-15
('123457', 'Ivan Gray', '1986-06-30', 'L', 'Jl. Test No. 808', '091234567890', '0001234578901', TRUE, TRUE),
('234568', 'Julia Green', '1993-02-14', 'P', 'Jl. Demo No. 909', '092345678901', '0002345689012', TRUE, TRUE),
('345679', 'Kevin Red', '1991-09-08', 'L', 'Jl. Experiment No. 1010', '093456789012', '0003456790123', TRUE, TRUE),
('456780', 'Laura Blue', '1988-12-25', 'P', 'Jl. Trial No. 1111', '094567890123', '0004567801234', TRUE, TRUE),
('567891', 'Michael Yellow', '1995-07-17', 'L', 'Jl. Sample No. 1212', '095678901234', '0005678912345', TRUE, TRUE),
-- Pasien BPJS Salah | Belum Booking | 16-20
('678902', 'Nancy Purple', '1987-03-03', 'P', 'Jl. Instance No. 1313', '096789012345', '0006789023456', TRUE, FALSE),
('789013', 'Oscar Orange', '1992-11-11', 'L', 'Jl. Example No. 1414', '097890123456', '0007890134567', FALSE, TRUE),
('890124', 'Patricia Pink', '1989-05-27', 'P', 'Jl. Sample No. 1515', '098901234567', '0008901245678', FALSE, FALSE),
('901235', 'Quincy Brown', '1994-01-01', 'L', 'Jl. Test No. 1616', '099012345678', '0009012356789', TRUE, FALSE),
('012346', 'Rachel Gray', '1986-08-15', 'P', 'Jl. Demo No. 1717', '100123456789', '0012345678901', FALSE, TRUE),
-- Pasien Umum | Sudah Booking | 21-25
('123458', 'Samuel White', '1993-04-10', 'L', 'Jl. Experiment No. 1818', '101234567890', NULL, FALSE, FALSE),
('234569', 'Tina Black', '1987-10-20', 'P', 'Jl. Trial No. 1919', '102345678901', NULL, FALSE, FALSE),
('345680', 'Ursula Gray', '1992-06-05', 'P', 'Jl. Sample No. 2020', '103456789012', NULL, FALSE, FALSE),
('456791', 'Victor White', '1989-12-15', 'L', 'Jl. Example No. 2121', '104567890123', NULL, FALSE, FALSE),
('567892', 'Wendy Black', '1994-08-30', 'P', 'Jl. Instance No. 2222', '105678901234', NULL, FALSE, FALSE),
-- Pasien Umum | Belum Booking | 26-30
('678903', 'Xander Gray', '1986-03-25', 'L', 'Jl. Test No. 2323', '106789012345', NULL, FALSE, FALSE),
('789014', 'Yvonne Black', '1991-11-05', 'P', 'Jl. Demo No. 2424', '107890123456', NULL, FALSE, FALSE),
('890125', 'Zack Gray', '1989-09-18', 'L', 'Jl. Experiment No. 2525', '108901234567', NULL, FALSE, FALSE),
('901236', 'Alice Black', '1994-05-22', 'P', 'Jl. Trial No. 2626', '109012345678', NULL, FALSE, FALSE),
('012347', 'Bob Gray', '1987-12-15', 'L', 'Jl. Sample No. 2727', '110123456789', NULL, FALSE, FALSE);

INSERT INTO poli (nama, icon) VALUES
-- 1-5
('Poliklinik Umum', 'umum'),
('Klinik Gigi', 'gigi'),
('Sp. Patologi Klinik', 'patologi'),
('Sp. Radiologi', 'radiologi'),
('Sp. Penyakit Dalam', 'dalam'),
-- 6-10
('Sp. Kandungan', 'kandungan'),
('Sp. Anak', 'anak'),
('Sp. Bedah', 'bedah'),
('Sp. Saraf', 'saraf'),
('Sp. Mata', 'mata'),
-- 11-15
('Sp. Kulit & Kelamin', 'kulit'),
('Sp. Paru', 'paru'),
('Sp. Kedokteran Jiwa', 'jiwa'),
('Sp. THT', 'tht'),
('Sp. Orthopedi', 'ortophedi'),
-- 16-17
('Sp. Jantung', 'jantung'),
('Sp. Rehabilitasi', 'rehabilitasi');

INSERT INTO dokter (nama, spesialisasi, foto) VALUES
-- Dokter Umum 11
('dr. Aster Primandani', 'Dokter Umum', 'aster'),
('dr. Rudianto, M.H., M.M', 'Dokter Umum', 'rudi'),
('dr. Junaedi Purwanto', 'Dokter Umum', 'juna'),
('dr. Diaga', 'Dokter Umum', 'diaga'),
('dr. Gizella Amanangapa', 'Dokter Umum', 'gizel'),
('dr. Nathasya Fernanda', 'Dokter Umum', 'nata'),
('dr. Dwi Retno Setijati', 'Dokter Umum', 'dwi'),
('dr. Hendrawan Ariwibowo', 'Dokter Umum', 'hendra'),
('dr. Ivan Selig Stianto', 'Dokter Umum', 'ivan'),
('dr. Patrice Yuandita', 'Dokter Umum', 'patrice'),
('dr. Irine Atanasia', 'Dokter Umum', 'irine'),
-- Dokter Gigi 3
('drg. Sri Sumarsih', 'Dokter Gigi', 'sri'),
('drg. Veronica Yuriria C', 'Dokter Gigi', 'vero'),
('drg. Amanda Netlos Tabeel', 'Dokter Gigi', 'amanda'),
-- Dokter Patologi 1
('dr. Anthon Wijayanto P., Sp. PK, MH. Kes., M.M.', 'Dokter Spesialis Patologi Klinik', 'anthon'),
-- Dokter Radiologi 1
('dr. Candra Sari Kusumaningrum, Sp. Rad', 'Dokter Spesialis Radiologi', 'candra'),
-- Dokter Penyakit Dalam 4
('dr. Joko R. Pambudi, Sp. PD-KR, FINASIM', 'Dokter Spesialis Penyakit Dalam', 'joko'),
('dr. Suyadi, Sp. PD', 'Dokter Spesialis Penyakit Dalam', 'suyadi'),
('dr. Andreas, Sp. PD, FINASIM, AIFO-K', 'Dokter Spesialis Penyakit Dalam', 'andreas'),
('dr. Alvin Aditya S., M.Sc, Sp. PD', 'Dokter Spesialis Penyakit Dalam', 'alvin'),
-- Dokter Kandungan 4
('dr. Yelly Yuliati, Sp. OG', 'Dokter Spesialis Kebidanan & Kandungan', 'yelly'),
('dr. Amin Nurakhim, Sp. OG', 'Dokter Spesialis Kebidanan & Kandungan', 'amin'),
('dr. Marta Isyana D., Sp. OG', 'Dokter Spesialis Kebidanan & Kandungan', 'marta'),
('dr. Yosiana Wijaya, Sp. OG', 'Dokter Spesialis Kebidanan & Kandungan', 'yosi'),
-- Dokter Anak 2
('dr. Florence Alexandra, Sp. A', 'Dokter Spesialis Anak', 'flore'),
('dr. Ariadne TH, Sp. A, Subsp. Neo (K)', 'Dokter Spesialis Anak', 'aria'),
-- Dokter Bedah 1
('dr. Johny Hendrik Silalahi, Sp. B', 'Dokter Spesialis Bedah', 'johny'),
-- Dokter Saraf 1
('dr. William Prasetiyo, Sp. N, FIN, AIFU-K', 'Dokter Spesialis Neurologi Interveral Nyeri, Ahli Ilmu Saraf Olahraga Kliniks', 'william'),
-- Dokter Mata 2
('dr. Dyah Ratnaningsih AW, Sp. M', 'Dokter Spesialis Mata', 'dyah'),
('dr. Benedicta Wayan SW, Sp. M', 'Dokter Spesialis Mata', 'benedicta'),
-- Dokter Kulit 2
('dr. Thianti Sylviningrum, Sp. DVE', 'Dokter Spesialis Kulit & Kelamin', 'thianti'),
('dr. Fresa Nathania R, M. Biomed, Sp. DVE', 'Dokter Spesialis Kulit & Kelamin', 'fresa'),
-- Dokter Paru 1
('dr. Inge Cahya Ramadhani, Sp. P', 'Dokter Spesialis Paru', 'inge'),
-- Dokter Jiwa 2
('dr. Nonny Putri Intansari, Sp. KJ', 'Dokter Spesialis Kedokteran Jiwa', 'nonny'),
('dr. Dian Ekawati Setiawan, Sp. KJ', 'Dokter Spesialis Kedokteran Jiwa', 'dian'),
-- Dokter THT 1
('dr. Ratnasari, Sp. THT-KL', 'Dokter Spesialis THT', 'ratna'),
-- Dokter Orthopedi 1
('dr. Nursuandy, Sp. OT', 'Dokter Spesialis Orthopedi', 'nursu'),
-- Dokter Jantung 1
('dr. Rio Probo K, Sp. JP, FIHA, FAsCC', 'Dokter Spesialis Jantung', 'rio'),
-- Dokter Rehabilitasi 1
('dr. Wati, Sp. KFR', 'Dokter Spesialis Rehabilitasi Medik & Fisioterapi', 'wati');

INSERT INTO jadwal_dokter (dokter_id, poli_id, hari, jam_mulai, jam_selesai, layanan) VALUES
(1, 1, 'Senin', '08:00:00', '21:00:00', 'Semua'),
(1, 1, 'Selasa', '08:00:00', '21:00:00', 'Semua'),
(1, 1, 'Rabu', '08:00:00', '21:00:00', 'Semua'),
(1, 1, 'Kamis', '08:00:00', '21:00:00', 'Semua'),
(1, 1, 'Jumat', '08:00:00', '21:00:00', 'Semua'),
(1, 1, 'Sabtu', '08:00:00', '21:00:00', 'Semua'),
(1, 1, 'Minggu', '08:00:00', '21:00:00', 'Semua'),

(2, 1, 'Senin', '08:00:00', '21:00:00', 'Semua'),
(2, 1, 'Selasa', '08:00:00', '21:00:00', 'Semua'),
(2, 1, 'Rabu', '08:00:00', '21:00:00', 'Semua'),
(2, 1, 'Kamis', '08:00:00', '21:00:00', 'Semua'),
(2, 1, 'Jumat', '08:00:00', '21:00:00', 'Semua'),
(2, 1, 'Sabtu', '08:00:00', '21:00:00', 'Semua'),
(2, 1, 'Minggu', '08:00:00', '21:00:00', 'Semua'),

(3, 1, 'Senin', '08:00:00', '21:00:00', 'Semua'),
(3, 1, 'Selasa', '08:00:00', '21:00:00', 'Semua'),
(3, 1, 'Rabu', '08:00:00', '21:00:00', 'Semua'),
(3, 1, 'Kamis', '08:00:00', '21:00:00', 'Semua'),
(3, 1, 'Jumat', '08:00:00', '21:00:00', 'Semua'),
(3, 1, 'Sabtu', '08:00:00', '21:00:00', 'Semua'),
(3, 1, 'Minggu', '08:00:00', '21:00:00', 'Semua'),

(4, 1, 'Senin', '08:00:00', '21:00:00', 'Semua'),
(4, 1, 'Selasa', '08:00:00', '21:00:00', 'Semua'),
(4, 1, 'Rabu', '08:00:00', '21:00:00', 'Semua'),
(4, 1, 'Kamis', '08:00:00', '21:00:00', 'Semua'),
(4, 1, 'Jumat', '08:00:00', '21:00:00', 'Semua'),
(4, 1, 'Sabtu', '08:00:00', '21:00:00', 'Semua'),
(4, 1, 'Minggu', '08:00:00', '21:00:00', 'Semua'),

(5, 1, 'Senin', '08:00:00', '21:00:00', 'Semua'),
(5, 1, 'Selasa', '08:00:00', '21:00:00', 'Semua'),
(5, 1, 'Rabu', '08:00:00', '21:00:00', 'Semua'),
(5, 1, 'Kamis', '08:00:00', '21:00:00', 'Semua'),
(5, 1, 'Jumat', '08:00:00', '21:00:00', 'Semua'),
(5, 1, 'Sabtu', '08:00:00', '21:00:00', 'Semua'),
(5, 1, 'Minggu', '08:00:00', '21:00:00', 'Semua'),

(6, 1, 'Senin', '08:00:00', '21:00:00', 'Semua'),
(6, 1, 'Selasa', '08:00:00', '21:00:00', 'Semua'),
(6, 1, 'Rabu', '08:00:00', '21:00:00', 'Semua'),
(6, 1, 'Kamis', '08:00:00', '21:00:00', 'Semua'),
(6, 1, 'Jumat', '08:00:00', '21:00:00', 'Semua'),
(6, 1, 'Sabtu', '08:00:00', '21:00:00', 'Semua'),
(6, 1, 'Minggu', '08:00:00', '21:00:00', 'Semua'),

(7, 1, 'Senin', '08:00:00', '21:00:00', 'Semua'),
(7, 1, 'Selasa', '08:00:00', '21:00:00', 'Semua'),
(7, 1, 'Rabu', '08:00:00', '21:00:00', 'Semua'),
(7, 1, 'Kamis', '08:00:00', '21:00:00', 'Semua'),
(7, 1, 'Jumat', '08:00:00', '21:00:00', 'Semua'),
(7, 1, 'Sabtu', '08:00:00', '21:00:00', 'Semua'),
(7, 1, 'Minggu', '08:00:00', '21:00:00', 'Semua'),

(8, 1, 'Senin', '08:00:00', '21:00:00', 'Semua'),
(8, 1, 'Selasa', '08:00:00', '21:00:00', 'Semua'),
(8, 1, 'Rabu', '08:00:00', '21:00:00', 'Semua'),
(8, 1, 'Kamis', '08:00:00', '21:00:00', 'Semua'),
(8, 1, 'Jumat', '08:00:00', '21:00:00', 'Semua'),
(8, 1, 'Sabtu', '08:00:00', '21:00:00', 'Semua'),
(8, 1, 'Minggu', '08:00:00', '21:00:00', 'Semua'),

(9, 1, 'Senin', '08:00:00', '21:00:00', 'Semua'),
(9, 1, 'Selasa', '08:00:00', '21:00:00', 'Semua'),
(9, 1, 'Rabu', '08:00:00', '21:00:00', 'Semua'),
(9, 1, 'Kamis', '08:00:00', '21:00:00', 'Semua'),
(9, 1, 'Jumat', '08:00:00', '21:00:00', 'Semua'),
(9, 1, 'Sabtu', '08:00:00', '21:00:00', 'Semua'),
(9, 1, 'Minggu', '08:00:00', '21:00:00', 'Semua'),

(10, 1, 'Senin', '08:00:00', '21:00:00', 'Semua'),
(10, 1, 'Selasa', '08:00:00', '21:00:00', 'Semua'),
(10, 1, 'Rabu', '08:00:00', '21:00:00', 'Semua'),
(10, 1, 'Kamis', '08:00:00', '21:00:00', 'Semua'),
(10, 1, 'Jumat', '08:00:00', '21:00:00', 'Semua'),
(10, 1, 'Sabtu', '08:00:00', '21:00:00', 'Semua'),
(10, 1, 'Minggu', '08:00:00', '21:00:00', 'Semua'),

(11, 1, 'Senin', '08:00:00', '21:00:00', 'Semua'),
(11, 1, 'Selasa', '08:00:00', '21:00:00', 'Semua'),
(11, 1, 'Rabu', '08:00:00', '21:00:00', 'Semua'),
(11, 1, 'Kamis', '08:00:00', '21:00:00', 'Semua'),
(11, 1, 'Jumat', '08:00:00', '21:00:00', 'Semua'),
(11, 1, 'Sabtu', '08:00:00', '21:00:00', 'Semua'),
(11, 1, 'Minggu', '08:00:00', '21:00:00', 'Semua'),

(12, 2, 'Senin', '17:00:00', '20:00:00', 'Semua'),
(12, 2, 'Selasa', '08:00:00', '13:00:00', 'Semua'),
(12, 2, 'Rabu', '08:00:00', '13:00:00', 'Semua'),
(12, 2, 'Kamis', '08:00:00', '13:00:00', 'Semua'),
(12, 2, 'Sabtu', '08:00:00', '13:00:00', 'Semua'),
(12, 2, 'Jumat', '14:00:00', '17:00:00', 'Semua'),

(13, 2, 'Selasa', '14:00:00', '17:00:00', 'Semua'),
(13, 2, 'Kamis', '14:00:00', '17:00:00', 'Semua'),

(14, 2, 'Senin', '08:00:00', '13:00:00', 'Semua'),
(14, 2, 'Jumat', '08:00:00', '13:00:00', 'Semua'),
(14, 2, 'Selasa', '17:00:00', '20:00:00', 'Semua'),
(14, 2, 'Kamis', '17:00:00', '20:00:00', 'Semua'),
(14, 2, 'Rabu', '14:00:00', '20:00:00', 'Semua'),
(14, 2, 'Sabtu', '14:00:00', '20:00:00', 'Semua'),

(15, 3, 'Selasa', '12:00:00', '14:00:00', 'Semua'),
-- dummy
(15, 3, 'Sabtu', '11:00:00', '14:00:00', 'Semua'),
(15, 3, 'Kamis', '11:00:00', '14:00:00', 'Semua'),

(16, 4, 'Senin', '15:30:00', '17:30:00', 'Semua'),
(16, 4, 'Selasa', '15:30:00', '17:30:00', 'Semua'),
(16, 4, 'Rabu', '15:30:00', '17:30:00', 'Semua'),
(16, 4, 'Kamis', '15:30:00', '17:30:00', 'Semua'),
(16, 4, 'Jumat', '15:30:00', '17:30:00', 'Semua'),
(16, 4, 'Sabtu', '15:30:00', '17:30:00', 'Semua'),

(17, 5, 'Senin', '14:00:00', '16:00:00', 'Semua'),
(17, 5, 'Rabu', '14:00:00', '16:00:00', 'Semua'),
(17, 5, 'Jumat', '14:00:00', '16:00:00', 'Semua'),
(17, 5, 'Selasa', '10:00:00', '12:00:00', 'Semua'),
(17, 5, 'Kamis', '10:00:00', '12:00:00', 'Semua'),
(17, 5, 'Sabtu', '10:00:00', '12:00:00', 'Umum'),

(18, 5, 'Senin', '10:00:00', '13:00:00', 'Semua'),
(18, 5, 'Selasa', '10:00:00', '13:00:00', 'Semua'),
(18, 5, 'Rabu', '10:00:00', '13:00:00', 'Semua'),
(18, 5, 'Kamis', '10:00:00', '13:00:00', 'Semua'),
(18, 5, 'Sabtu', '10:00:00', '13:00:00', 'Semua'),
(18, 5, 'Jumat', '10:00:00', '11:00:00', 'Semua'),

(19, 5, 'Senin', '16:30:00', '18:00:00', 'Semua'),
(19, 5, 'Selasa', '16:30:00', '18:00:00', 'Semua'),
-- dummy
(19, 5, 'Sabtu', '16:30:00', '18:00:00', 'Semua'),
(19, 5, 'Kamis', '16:30:00', '18:00:00', 'Semua'),
(19, 5, 'Jumat', '11:30:00', '12:30:00', 'Semua'),
(19, 5, 'Jumat', '17:00:00', '17:45:00', 'Semua'),

(20, 5, 'Rabu', '14:30:00', '16:00:00', 'Semua'),
(20, 5, 'Jumat', '14:30:00', '17:00:00', 'Semua'),

(21, 6, 'Senin', '09:00:00', '13:00:00', 'Semua'),
(21, 6, 'Selasa', '09:00:00', '13:00:00', 'Semua'),
-- dummy
(21, 6, 'Sabtu', '09:00:00', '13:00:00', 'Semua'),
(21, 6, 'Kamis', '09:00:00', '13:00:00', 'Semua'),
(21, 6, 'Jumat', '09:00:00', '13:00:00', 'Semua'),
(21, 6, 'Sabtu', '09:00:00', '14:00:00', 'Semua'),

(22, 6, 'Senin', '18:00:00', '22:00:00', 'Semua'),
(22, 6, 'Selasa', '10:00:00', '14:00:00', 'Semua'),
(22, 6, 'Selasa', '16:00:00', '22:00:00', 'Semua'),
(22, 6, 'Kamis', '16:00:00', '22:00:00', 'Semua'),
(22, 6, 'Sabtu', '10:00:00', '13:00:00', 'Semua'),

(23, 6, 'Senin', '18:00:00', '20:00:00', 'Semua'),
(23, 6, 'Selasa', '18:00:00', '20:00:00', 'Semua'),
(23, 6, 'Rabu', '18:00:00', '20:00:00', 'Semua'),
(23, 6, 'Kamis', '18:00:00', '20:00:00', 'Semua'),
(23, 6, 'Jumat', '16:00:00', '18:00:00', 'Semua'),
(23, 6, 'Sabtu', '14:00:00', '16:30:00', 'Semua'),

(24, 6, 'Senin', '07:00:00', '09:00:00', 'Semua'),
(24, 6, 'Kamis', '07:00:00', '09:00:00', 'Semua'),
(24, 6, 'Sabtu', '07:00:00', '09:00:00', 'Semua'),
(24, 6, 'Rabu', '19:00:00', '21:00:00', 'Semua'),
(24, 6, 'Jumat', '14:00:00', '16:00:00', 'Semua'),

(25, 7, 'Senin', '16:00:00', '19:00:00', 'Semua'),
-- dummy
(25, 7, 'Sabtu', '16:00:00', '19:00:00', 'Semua'),
(25, 7, 'Kamis', '16:00:00', '19:00:00', 'Semua'),

(26, 7, 'Selasa', '16:00:00', '18:00:00', 'Semua'),

(27, 8, 'Senin', '09:00:00', '12:30:00', 'Semua'),
(27, 8, 'Selasa', '12:00:00', '14:00:00', 'Semua'),
(27, 8, 'Rabu', '12:00:00', '14:00:00', 'Semua'),
(27, 8, 'Kamis', '12:00:00', '14:00:00', 'Semua'),
(27, 8, 'Jumat', '11:00:00', '12:00:00', 'Semua'),

(28, 9, 'Senin', '08:30:00', '12:30:00', 'Semua'),
(28, 9, 'Selasa', '08:30:00', '12:30:00', 'Semua'),
(28, 9, 'Rabu', '08:30:00', '12:30:00', 'Semua'),
(28, 9, 'Kamis', '08:30:00', '12:30:00', 'Semua'),
(28, 9, 'Jumat', '08:30:00', '12:30:00', 'Semua'),
(28, 9, 'Sabtu', '08:30:00', '12:30:00', 'Semua'),
(28, 9, 'Senin', '17:30:00', '19:00:00', 'Semua'),
(28, 9, 'Selasa', '17:30:00', '19:00:00', 'Semua'),
(28, 9, 'Rabu', '17:30:00', '19:00:00', 'Semua'),
(28, 9, 'Kamis', '17:30:00', '19:00:00', 'Semua'),
(28, 9, 'Jumat', '17:30:00', '19:00:00', 'Semua'),

(29, 10, 'Senin', '16:00:00', '18:00:00', 'Semua'),
(29, 10, 'Kamis', '16:00:00', '18:00:00', 'Semua'),

(30, 10, 'Senin', '08:00:00', '13:00:00', 'Semua'),
(30, 10, 'Selasa', '08:00:00', '13:00:00', 'Semua'),
(30, 10, 'Rabu', '08:00:00', '13:00:00', 'Semua'),
(30, 10, 'Kamis', '08:00:00', '13:00:00', 'Semua'),
(30, 10, 'Jumat', '08:00:00', '13:00:00', 'Semua'),
(30, 10, 'Sabtu', '08:00:00', '13:00:00', 'Semua'),

(31, 11, 'Senin', '13:00:00', '15:00:00', 'Semua'),
(31, 11, 'Kamis', '15:00:00', '17:00:00', 'Semua'),
(31, 11, 'Sabtu', '08:00:00', '11:00:00', 'Semua'),

(32, 11, 'Senin', '10:00:00', '12:00:00', 'Semua'),
(32, 11, 'Selasa', '08:30:00', '10:00:00', 'Semua'),
(32, 11, 'Rabu', '08:30:00', '10:00:00', 'Semua'),
(32, 11, 'Kamis', '08:30:00', '10:00:00', 'Semua'),
(32, 11, 'Jumat', '08:30:00', '10:00:00', 'Semua'),
(32, 11, 'Sabtu', '11:00:00', '12:00:00', 'Semua'),

(33, 12, 'Senin', '14:30:00', '16:00:00', 'Semua'),
(33, 12, 'Rabu', '14:30:00', '16:00:00', 'Semua'),
(33, 12, 'Jumat', '12:30:00', '14:00:00', 'Semua'),

(34, 13, 'Senin', '14:30:00', '19:30:00', 'Semua'),
(34, 13, 'Rabu', '14:30:00', '19:30:00', 'Semua'),

(35, 13, 'Senin', '08:00:00', '10:00:00', 'Semua'),
(35, 13, 'Kamis', '08:00:00', '10:00:00', 'Semua'),
(35, 13, 'Jumat', '15:00:00', '17:00:00', 'Semua'),

(36, 14, 'Selasa', '10:00:00', '12:00:00', 'Semua'),
(36, 14, 'Kamis', '10:00:00', '12:00:00', 'Semua'),
(36, 14, 'Jumat', '13:00:00', '15:00:00', 'Umum'),

(37, 15, 'Senin', '09:00:00', '12:00:00', 'BPJS'),
(37, 15, 'Jumat', '09:00:00', '12:00:00', 'BPJS'),
(37, 15, 'Senin', '16:00:00', '18:00:00', 'Umum'),
(37, 15, 'Selasa', '16:00:00', '18:00:00', 'Umum'),
-- dummy
(37, 15, 'Sabtu', '16:00:00', '18:00:00', 'Umum'),
(37, 15, 'Kamis', '16:00:00', '18:00:00', 'Umum'),
(37, 15, 'Jumat', '16:00:00', '18:00:00', 'Umum'),

(38, 16, 'Senin', '19:00:00', '21:00:00', 'Semua'),
(38, 16, 'Selasa', '16:00:00', '19:00:00', 'Semua'),
(38, 16, 'Kamis', '16:00:00', '19:00:00', 'Semua'),

(39, 17, 'Senin', '18:00:00', '20:00:00', 'Semua'),
(39, 17, 'Selasa', '12:30:00', '14:30:00', 'Semua'),
(39, 17, 'Rabu', '12:30:00', '14:30:00', 'Semua'),
(39, 17, 'Kamis', '12:30:00', '14:30:00', 'Semua'),
(39, 17, 'Jumat', '12:30:00', '14:30:00', 'Semua');

-- Insert data rujukan untuk pasien BPJS
INSERT INTO rujukan (pasien_id, nomor_rujukan, tanggal_rujukan, faskes_perujuk, diagnosis, poli_id) VALUES
-- Sudah Booking
(1, 'RJK001', '2024-07-10', 'Puskesmas Bahagia', 'Demam', 1),
(1, 'RJK002', '2024-07-15', 'Puskesmas Bahagia', 'Jamur Kelamin', 11),
(2, 'RJK003', '2024-07-11', 'Puskesmas Sejahtera', 'Karang Gigi', 2),
(2, 'RJK004', '2024-07-16', 'Puskesmas Sejahtera', 'Batuk', 1),
(3, 'RJK005', '2024-07-12', 'Klinik Sentosa', 'Batu Ginjal', 3),
(3, 'RJK006', '2024-07-17', 'Klinik Sentosa', 'Gangguan Pencernaan', 7),
(4, 'RJK007', '2024-07-13', 'Puskesmas Bahagia', 'Sakit Tenggorokan', 14),
(4, 'RJK008', '2024-07-18', 'Puskesmas Bahagia', 'Melahirkan', 6),
(5, 'RJK009', '2024-07-14', 'Klinik Sehat', 'Patah Tulang Kaki', 15),
(5, 'RJK010', '2024-07-19', 'Klinik Sehat', 'Dermatitis', 11),
-- Belum Booking
(11, 'RJK011', '2024-07-15', 'Puskesmas Sejahtera', 'Hipertensi', 5),
(11, 'RJK012', '2024-07-20', 'Puskesmas Sejahtera', 'Diabetes Mellitus', 5),
(12, 'RJK013', '2024-07-16', 'Klinik Sehat', 'Asma', 12),
(12, 'RJK014', '2024-07-22', 'Klinik Sehat', 'Gangguan Penglihatan', 10),
(13, 'RJK015', '2024-07-18', 'Puskesmas Bahagia', 'Sakit Tenggorokan', 14),
(13, 'RJK016', '2024-07-25', 'Puskesmas Bahagia', 'Gangguan Pencernaan', 5),
(14, 'RJK017', '2024-07-19', 'Klinik Sentosa', 'Demam', 1),
(14, 'RJK018', '2024-07-26', 'Klinik Sentosa', 'Epilepsi', 9),
(15, 'RJK019', '2024-07-20', 'Puskesmas Sejahtera', 'Katup Jantung', 16),
(15, 'RJK020', '2024-07-27', 'Puskesmas Sejahtera', 'Kelumpuhan', 17);

INSERT INTO booking (kode_booking, pasien_id, tanggal_booking, jam_booking, jenis_layanan, poli_id, dokter_id, rujukan_id, jadwal_dokter_id, status) VALUES
-- Pasien BPJS Selesai
('ABC123', 1, '2024-07-21', '11:46:43', 'BPJS', 1, 1, 1, 7, 'Selesai'),
('DEF456', 2, '2024-07-22', '18:12:50', 'BPJS', 2, 12, 3, 78, 'Selesai'),
-- Pasien Umum Selesai
('GHI789', 21, '2024-07-23', '11:54:54', 'Umum', 10, 30, NULL, 166, 'Selesai'),
('JKL012', 22, '2024-07-23', '17:23:41', 'Umum', 9, 28, NULL, 159, 'Selesai'),
-- Pasien BPJS Menunggu bisa aja dummy
('MNO345', 3, '2024-07-24', '11:04:05', 'BPJS', 3, 15, 5, 93, 'Menunggu'),
('PQR678', 4, '2024-07-24', '12:34:52', 'BPJS', 6, 23, 8, 137, 'Menunggu'),
('STU901', 5, '2024-07-24', '16:30:04', 'BPJS', 15, 37, 9, 195, 'Menunggu'),
-- Pasien Umum Menunggu bisa aja dummy
('VWX234', 23, '2024-07-25', '11:15:32', 'Umum', 7, 25, NULL, 144, 'Menunggu'),
('YZA567', 24, '2024-07-25', '17:45:00', 'Umum', 6, 23, NULL, 137, 'Menunggu'),
('BCD890', 25, '2024-07-26', '17:52:12', 'Umum', 5, 19, NULL, 115, 'Menunggu');

-- pasti dummy karena harus fetch api dari luar sistem seperti booking via WA/web regist
INSERT INTO antrian (booking_id, nomor_antrian, created_at, jadwal_dokter_id) VALUES
-- Pasien BPJS Menunggu Sudah Booking
(5, '001', NULL, 93),
(6, '001', NULL, 137),
(7, '001', NULL, 195),
-- Pasien Umum Menunggu Sudah Booking
(8, '001', NULL, 144),
(9, '001', NULL, 137),
(10, '001', NULL, 115);