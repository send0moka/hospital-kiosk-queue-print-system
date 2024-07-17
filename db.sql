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
    fingerprint_status BOOLEAN DEFAULT FALSE
);

-- Tabel Booking
CREATE TABLE IF NOT EXISTS booking (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kode_booking VARCHAR(6) UNIQUE NOT NULL,
    pasien_id INT,
    tanggal_booking DATE NOT NULL,
    jam_booking TIME NOT NULL,
    jenis_layanan ENUM('BPJS', 'Umum') NOT NULL,
    status ENUM('Menunggu', 'Selesai', 'Batal') DEFAULT 'Menunggu',
    FOREIGN KEY (pasien_id) REFERENCES pasien(id)
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

-- Insert beberapa data contoh dengan kolom fingerprint_status
INSERT INTO pasien (nomor_rekam_medis, nama, tanggal_lahir, jenis_kelamin, alamat, nomor_telepon, nomor_bpjs, fingerprint_status) VALUES
-- Pasien BPJS
('123456', 'John Doe', '1990-01-01', 'L', 'Jl. Contoh No. 123', '081234567890', '0001234567890', TRUE),
('234567', 'Jane Smith', '1995-05-05', 'P', 'Jl. Sample No. 456', '082345678901', '0002345678901', FALSE),
('345678', 'Bob Johnson', '1985-03-15', 'L', 'Jl. Test No. 789', '083456789012', '0003456789012', TRUE),
('456789', 'Alice Brown', '1992-07-20', 'P', 'Jl. Demo No. 101', '084567890123', '0004567890123', FALSE),
-- Pasien Umum
('567890', 'Charlie Davis', '1988-11-30', 'L', 'Jl. Experiment No. 202', '085678901234', NULL, TRUE),
('678901', 'Diana Evans', '1993-09-25', 'P', 'Jl. Trial No. 303', '086789012345', NULL, FALSE),
('789012', 'Edward Foster', '1987-02-14', 'L', 'Jl. Example No. 404', '087890123456', NULL, TRUE),
('890123', 'Grace Harris', '1991-12-05', 'P', 'Jl. Instance No. 505', '088901234567', NULL, FALSE);

INSERT INTO poli (nama, deskripsi) VALUES
('Umum', 'Poli untuk pemeriksaan umum'),
('Gigi', 'Poli untuk pemeriksaan gigi'),
('Mata', 'Poli untuk pemeriksaan mata');

INSERT INTO dokter (nama, spesialisasi, nomor_izin_praktik) VALUES
('dr. Andi', 'Umum', 'NIP12345'),
('drg. Budi', 'Gigi', 'NIP23456'),
('dr. Citra, Sp.M', 'Mata', 'NIP34567');

INSERT INTO jadwal_dokter (dokter_id, poli_id, hari, jam_mulai, jam_selesai) VALUES
(1, 1, 'Senin', '08:00:00', '14:00:00'),
(2, 2, 'Selasa', '09:00:00', '15:00:00'),
(3, 3, 'Rabu', '10:00:00', '16:00:00');

INSERT INTO booking (kode_booking, pasien_id, tanggal_booking, jam_booking, jenis_layanan) VALUES
-- Pasien BPJS sudah booking
('ABC123', 1, '2024-07-20', '09:00:00', 'BPJS'),
('DEF456', 2, '2024-07-21', '10:00:00', 'BPJS'),
-- Pasien Umum sudah booking
('GHI789', 5, '2024-07-22', '11:00:00', 'Umum'),
('JKL012', 6, '2024-07-23', '13:00:00', 'Umum');