const Kelas = require('../models/Kelas');

exports.getKelasByUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const kelas = await Kelas.findOne({ userId });

    if (!kelas) {
      return res.status(404).json({ message: 'Kelas tidak ditemukan' });
    }

    res.json(kelas);
  } catch (err) {
    res.status(500).json({ message: 'Gagal ambil data kelas', error: err.message });
  }
};

exports.updateNamaKelas = async (req, res) => {
  try {
    const userId = req.user.id;
    const { nama } = req.body;

    const kelas = await Kelas.findOne({ userId });

    if (!kelas) {
      return res.status(404).json({ message: 'Kelas tidak ditemukan' });
    }

    console.log('Kelas sebelum update:', kelas); 

    kelas.nama = nama;
    await kelas.save(); 

    res.json(kelas);
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ message: 'Gagal update nama kelas', error: err.message });
  }
};

exports.getKelasByUsername = async (req, res) => {
  try {
    const { usernameKelas } = req.user;

    if (!usernameKelas) {
      return res.status(400).json({ message: 'Username kelas tidak tersedia' });
    }

    const kelas = await Kelas.findOne({ usernameKelas });

    if (!kelas) {
      return res.status(404).json({ message: 'Kelas tidak ditemukan' });
    }

    res.json({ namaKelas: kelas.nama });
  } catch (err) {
    res.status(500).json({ message: 'Gagal ambil nama kelas', error: err.message });
  }
};
