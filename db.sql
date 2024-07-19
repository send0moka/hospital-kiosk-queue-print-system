-- Membuat database
CREATE DATABASE IF NOT EXISTS rsuelisabethpwt;
USE rsuelisabethpwt;

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
    deskripsi TEXT
);

-- Tabel Dokter
CREATE TABLE IF NOT EXISTS dokter (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    spesialisasi VARCHAR(50),
    nomor_izin_praktik VARCHAR(20) UNIQUE NOT NULL
);

-- Tabel Jadwal Dokter
CREATE TABLE IF NOT EXISTS jadwal_dokter (
    id INT AUTO_INCREMENT PRIMARY KEY,
    dokter_id INT,
    poli_id INT,
    hari ENUM('Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'),
    jam_mulai TIME,
    jam_selesai TIME,
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
    rujukan_id INT,
    status ENUM('Menunggu', 'Selesai', 'Batal') DEFAULT 'Menunggu',
    FOREIGN KEY (pasien_id) REFERENCES pasien(id),
    FOREIGN KEY (poli_id) REFERENCES poli(id),
    FOREIGN KEY (rujukan_id) REFERENCES rujukan(id)
);

-- Insert data pasien
INSERT INTO pasien (nomor_rekam_medis, nama, tanggal_lahir, jenis_kelamin, alamat, nomor_telepon, nomor_bpjs, fingerprint_status, bpjs_status) VALUES
-- Pasien BPJS
('123456', 'John Doe', '1990-01-01', 'L', 'Jl. Contoh No. 123, Sokanegara, Kec. Purwokerto Timur, Kab. Banyumas, Jawa Tengah 53161', '081234567890', '0001234567890', TRUE, TRUE),
('234567', 'Jane Smith', '1995-05-05', 'P', 'Jl. Sample No. 456', '082345678901', '0002345678901', FALSE, TRUE),
('345678', 'Bob Johnson', '1985-03-15', 'L', 'Jl. Test No. 789', '083456789012', '0003456789012', TRUE, FALSE),
('456789', 'Alice Brown', '1992-07-20', 'P', 'Jl. Demo No. 101', '084567890123', '0004567890123', FALSE, FALSE),
('567890', 'Charlie Davis', '1988-11-30', 'L', 'Jl. Experiment No. 202', '085678901234', '0005678901234', TRUE, TRUE),
('678901', 'Diana Evans', '1993-09-25', 'P', 'Jl. Trial No. 303', '086789012345', '0006789012345', TRUE, FALSE),
('789012', 'Edward Foster', '1987-02-14', 'L', 'Jl. Example No. 404', '087890123456', '0007890123456', TRUE, TRUE),
('890123', 'Grace Harris', '1991-12-05', 'P', 'Jl. Instance No. 505', '088901234567', '0008901234567', FALSE, TRUE),
-- Pasien Umum (fingerprint_status selalu FALSE)
('901234', 'Frank White', '1989-08-18', 'L', 'Jl. Sample No. 606', '089012345678', NULL, FALSE, FALSE),
('012345', 'Helen Black', '1994-04-22', 'P', 'Jl. Example No. 707', '090123456789', NULL, FALSE, FALSE),
('123457', 'Ivan Gray', '1986-06-30', 'L', 'Jl. Test No. 808', '091234567890', NULL, FALSE, FALSE),
('234568', 'Julia Green', '1993-02-14', 'P', 'Jl. Demo No. 909', '092345678901', NULL, FALSE, FALSE),
('345679', 'Kevin Red', '1991-09-08', 'L', 'Jl. Experiment No. 1010', '093456789012', NULL, FALSE, FALSE),
('456780', 'Laura Blue', '1988-12-25', 'P', 'Jl. Trial No. 1111', '094567890123', NULL, FALSE, FALSE),
('567891', 'Michael Yellow', '1995-07-17', 'L', 'Jl. Sample No. 1212', '095678901234', NULL, FALSE, FALSE),
('678902', 'Nancy Purple', '1987-03-03', 'P', 'Jl. Instance No. 1313', '096789012345', NULL, FALSE, FALSE);

INSERT INTO poli (nama, deskripsi) VALUES
('Umum', 'Poli untuk pemeriksaan umum'),
('Gigi', 'Poli untuk pemeriksaan gigi'),
('Mata', 'Poli untuk pemeriksaan mata'),
('Jantung', 'Poli untuk pemeriksaan jantung'),
('Penyakit Dalam', 'Poli untuk pemeriksaan penyakit dalam'),
('Anak', 'Poli untuk pemeriksaan anak'),
('THT', 'Poli untuk pemeriksaan telinga, hidung, dan tenggorokan');

INSERT INTO dokter (nama, spesialisasi, nomor_izin_praktik) VALUES
('dr. Andi', 'Umum', 'NIP12345'),
('drg. Budi', 'Gigi', 'NIP23456'),
('dr. Citra, Sp.M', 'Mata', 'NIP34567'),
('dr. Dian, Sp.JP', 'Jantung', 'NIP45678'),
('dr. Eka, Sp.PD', 'Penyakit Dalam', 'NIP56789'),
('dr. Fajar, Sp.A', 'Anak', 'NIP67890'),
('dr. Gita, Sp.THT', 'THT', 'NIP78901');

INSERT INTO jadwal_dokter (dokter_id, poli_id, hari, jam_mulai, jam_selesai) VALUES
(1, 1, 'Senin', '08:00:00', '14:00:00'),
(2, 2, 'Selasa', '09:00:00', '15:00:00'),
(3, 3, 'Rabu', '10:00:00', '16:00:00'),
(4, 4, 'Kamis', '08:00:00', '14:00:00'),
(5, 5, 'Jumat', '09:00:00', '15:00:00'),
(6, 6, 'Sabtu', '08:00:00', '13:00:00'),
(7, 7, 'Senin', '10:00:00', '16:00:00');

-- Insert data rujukan untuk pasien BPJS dengan fingerprint_status true
INSERT INTO rujukan (pasien_id, nomor_rujukan, tanggal_rujukan, faskes_perujuk, diagnosis, poli_id) VALUES
(1, 'RJK001', '2024-07-15', 'Puskesmas Sejahtera', 'Hipertensi', 4),
(1, 'RJK002', '2024-07-20', 'Puskesmas Sejahtera', 'Diabetes Mellitus', 5),
(5, 'RJK003', '2024-07-16', 'Klinik Sehat', 'Asma', 5),
(5, 'RJK004', '2024-07-22', 'Klinik Sehat', 'Gangguan Penglihatan', 3),
(7, 'RJK005', '2024-07-18', 'Puskesmas Bahagia', 'Sakit Tenggorokan', 7),
(7, 'RJK006', '2024-07-25', 'Puskesmas Bahagia', 'Gangguan Pencernaan', 5);

INSERT INTO booking (kode_booking, pasien_id, tanggal_booking, jam_booking, jenis_layanan, poli_id, rujukan_id, status) VALUES
-- Pasien BPJS sudah booking
('ABC123', 1, '2024-07-20', '09:00:00', 'BPJS', 4, 1, 'Menunggu'),
('DEF456', 2, '2024-07-21', '10:00:00', 'BPJS', 5, NULL, 'Menunggu'),
('GHI789', 5, '2024-07-22', '11:00:00', 'BPJS', 3, 4, 'Menunggu'),
-- Pasien Umum sudah booking
('JKL012', 9, '2024-07-23', '13:00:00', 'Umum', 1, NULL, 'Menunggu'),
('MNO345', 10, '2024-07-24', '14:00:00', 'Umum', 2, NULL, 'Menunggu'),
('PQR678', 11, '2024-07-25', '09:00:00', 'Umum', 3, NULL, 'Menunggu'),
('STU901', 12, '2024-07-26', '10:30:00', 'Umum', 6, NULL, 'Menunggu'),
('VWX234', 13, '2024-07-27', '11:15:00', 'Umum', 7, NULL, 'Menunggu');