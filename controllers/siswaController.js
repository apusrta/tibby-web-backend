const Siswa = require('../models/Siswa');

exports.getSiswaByKelas = async (req, res) => {
  const { namaKelas } = req.params;
  try {
    const userId = req.user?.id;

    const siswa = await Siswa.find({ kelas: namaKelas, userId }); 

    res.json(siswa);
  } catch (err) {
    console.error("ERROR getSiswaByKelas:", err);
    res.status(500).json({ message: err.message });
  }
};


// Tambah satu siswa baru
exports.tambahSiswa = async (req, res) => {
  const { nama, foto, kelas } = req.body;

  const userId = req.user?.id;

  if (!userId) {
    return res.status(403).json({ message: "User tidak terautentikasi!" });
  }

  try {
    const siswaBaru = new Siswa({
      nama,
      foto,
      kelas,
      poin: 0,
      riwayatPelanggaran: [],
      userId: userId 
    });
    await siswaBaru.save();
    res.status(201).json(siswaBaru);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }

  console.log('Data diterima:', req.body);
  console.log('User ID:', req.user?.id);
};


// Update foto profil siswa
exports.updateFotoSiswa = async (req, res) => {
  const { id } = req.params;
  const { foto } = req.body;
  try {
    const siswa = await Siswa.findByIdAndUpdate(id, { foto }, { new: true });
    if (!siswa) {
      return res.status(404).json({ error: 'Siswa tidak ditemukan' });
    }
    res.json(siswa);
  } catch (err) {
    res.status(500).json({ error: 'Gagal update foto siswa' });
  }
};

// Update nama siswa
exports.updateNamaSiswa = async (req, res) => {
  const { id } = req.params;
  const { nama } = req.body;
  try {
  const siswa = await Siswa.findOneAndUpdate(
    { _id: id, userId: req.user.id },
    { nama },
    { new: true }
  );
    if (!siswa) {
      return res.status(404).json({ message: 'Siswa tidak ditemukan' });
    }
    res.status(200).json(siswa);
  } catch (error) {
    res.status(500).json({ message: 'Gagal memperbarui nama siswa', error });
  }
};

// Hapus siswa berdasarkan ID
exports.hapusSiswa = async (req, res) => {
  try {
    const deleted = await Siswa.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Siswa tidak ditemukan' });
    }
    res.json({ message: 'Siswa berhasil dihapus', siswa: deleted });
  } catch (err) {
    res.status(500).json({ message: 'Gagal menghapus siswa', error: err.message });
  }
};

// Update nama kelas hanya untuk kelas milik user yang login
exports.updateNamaKelas = async (req, res) => {
  const { kelasLama, kelasBaru } = req.body;  
  const userId = req.user?.id; 

  try {
    const result = await Siswa.updateMany(
      { kelas: kelasLama, userId: userId }, 
      { $set: { kelas: kelasBaru } }
    );

    if (result.nModified === 0) {
      return res.status(404).json({ message: 'Tidak ada kelas yang ditemukan untuk diupdate.' });
    }

    res.json({ message: 'Nama kelas berhasil diperbarui', result });
  } catch (err) {
    res.status(500).json({ message: 'Gagal update nama kelas', error: err.message });
  }
};


// Update NISN siswa
exports.updateNISNSiswa = async (req, res) => {
  const { id } = req.params;
  const { nisn } = req.body;

  if (!nisn || typeof nisn !== 'string') {
    return res.status(400).json({ message: 'NISN tidak valid' });
  }

  try {
    const siswa = await Siswa.findByIdAndUpdate(id, { nisn }, { new: true });
    if (!siswa) {
      return res.status(404).json({ message: 'Siswa tidak ditemukan' });
    }
    res.status(200).json(siswa);
  } catch (error) {
    res.status(500).json({ message: 'Gagal memperbarui NISN siswa', error: error.message });
  }
};


// Hapus satu pelanggaran dari siswa
exports.hapusPelanggaranSiswa = async (req, res) => {
  const { idSiswa, indexPelanggaran } = req.params;
  
  try {
    const siswa = await Siswa.findById(idSiswa);
    if (!siswa) {
      return res.status(404).json({ message: 'Siswa tidak ditemukan' });
    }

    const poinPelanggaran = siswa.riwayatPelanggaran[indexPelanggaran]?.poin || 0;

    siswa.riwayatPelanggaran.splice(indexPelanggaran, 1);

    siswa.poin -= poinPelanggaran;
    if (siswa.poin < 0) siswa.poin = 0; 

    await siswa.save();

    res.json({ message: 'Pelanggaran dihapus', siswa });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update poin siswa , tambahkan di riwayat pelanggaran
exports.tambahPoin = async (req, res) => {
  const { id } = req.params;
  const { poin, alasan } = req.body;
  try {
    const siswa = await Siswa.findById(id);
    if (!siswa) {
      return res.status(404).json({ message: 'Siswa tidak ditemukan' });
    }

    siswa.riwayatPelanggaran.push({
      tanggal: new Date(),
      nama: alasan || 'Pelanggaran tanpa keterangan',
      poin: poin
    });

    siswa.poin += poin;
    await siswa.save();

    res.json({ message: 'Poin dan pelanggaran berhasil ditambahkan', siswa });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get detail 1 siswa
exports.getDetailSiswa = async (req, res) => {
  const { id } = req.params;
  try {
    const siswa = await Siswa.findById(id);
    if (!siswa) {
      return res.status(404).json({ message: 'Siswa tidak ditemukan' });
    }
    res.json(siswa);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
 
// Update kontak siswa dan orangtua
exports.updateKontakSiswa = async (req, res) => {
  const { id } = req.params;
  const {
    nama, nisn, noTelp, email, alamat,
    namaAyah, telpAyah, emailAyah,
    namaIbu, telpIbu, emailIbu,
    namaWali, telpWali, emailWali
  } = req.body;

  try {
    const siswa = await Siswa.findByIdAndUpdate(
      id,
      {
        nama, nisn, noTelp, email, alamat,
        namaAyah, telpAyah, emailAyah,
        namaIbu, telpIbu, emailIbu,
        namaWali, telpWali, emailWali
      },
      { new: true }
    );
    if (!siswa) {
      return res.status(404).json({ message: 'Siswa tidak ditemukan' });
    }
    res.json(siswa);
  } catch (err) {
    res.status(500).json({ message: 'Gagal update kontak siswa', error: err.message });
  }
};

exports.getSiswaByUserLogin = async (req, res) => {
const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const siswa = await Siswa.findOne({ userId: userId });
    if (!siswa) {
      return res.status(404).json({ message: 'Data siswa tidak ditemukan' });
    }
    res.json(siswa);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};