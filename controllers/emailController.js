const nodemailer = require('nodemailer');
const Siswa = require('../models/Siswa');

exports.kirimEmail = async (req, res) => {
  const { email, pesan, idSiswa } = req.body;

  try {
    const siswa = await Siswa.findById(idSiswa);
    if (!siswa) {
      return res.status(404).json({ success: false, message: 'Siswa tidak ditemukan.' });
    }
    console.log('Email tujuan:', email);
    console.log('Data siswa:', siswa);

    const namaSiswa = siswa?.nama || '';
    const namaFrom = namaSiswa ? `Sekolah ananda ${namaSiswa}` : 'Sekolah';

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'tibby.website.2025@gmail.com',
        pass: 'qizw sdfq ushr jkbx'
      },
    });

    await transporter.sendMail({
      from: `"${namaFrom}" <apusrta.23@gmail.com>`,
      to: email,
      subject: 'Pesan dari Sekolah',
      text: pesan,
    });

    res.json({ success: true, message: 'Email berhasil dikirim.' });
  } catch (err) {
    console.error('Gagal kirim email:', err);
    res.status(500).json({ success: false, message: 'Gagal mengirim email.', error: err.message });
  }
};
