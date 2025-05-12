// controllers/akunUserController.js
const AkunUser = require('../models/AkunUser');
const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/jwt');

exports.registerUser = async (req, res) => {
  const { nama, username, password, gender, tanggalLahir, usernameKelas, passwordKelas } = req.body;

  if (!nama || !username || !password || !gender || !tanggalLahir || !usernameKelas || !passwordKelas) {
    return res.status(400).json({ message: 'Semua field harus diisi.' });
  }

  try {
    const existingUser = await AkunUser.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username sudah digunakan.' });
    }

    const hashedPasswordKelas = await bcrypt.hash(passwordKelas, 10);

    const newUser = new AkunUser({
      nama,
      username,
      password,
      gender,
      tanggalLahir,
      usernameKelas,
      passwordKelas: hashedPasswordKelas
    });

    await newUser.save();

    // Tambahan: buat data Kelas default
    const Kelas = require('../models/Kelas');
    await Kelas.create({
      nama: 'Kelas Baru',
      userId: newUser._id,
      usernameKelas: newUser.usernameKelas
    });

    console.log('User baru:', newUser);

    res.status(201).json({ message: 'Akun berhasil didaftarkan.' });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
};


exports.loginUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username dan password wajib diisi.' });
  }

  try {
    const user = await AkunUser.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Username atau password salah.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Username atau password salah.' });
    }

    const generateToken = (user) => {
      return jwt.sign(
        {
          id: user._id,
          usernameKelas: user.usernameKelas 
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
    };

    const token = generateToken(user);

    res.status(200).json({
      message: 'Login berhasil.',
      token,
      user: {
        id: user._id,
        nama: user.nama,
        username: user.username,
        usernameKelas: user.usernameKelas
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
};

exports.getGuruByUsername = async (req, res) => {
  try {
    const username = req.query.username; 
    const user = await AkunUser.findOne({ username });
    if (!user) return res.status(404).json({ message: "Guru tidak ditemukan" });

    res.json({
      nama: user.nama,
      gender: user.gender,
      tanggalLahir: user.tanggalLahir,
      foto: user.foto,
      namaKelas: user.namaKelas,
      username: user.username,          
      usernameKelas: user.usernameKelas
    });

  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan", error });
  }
};

exports.updateGuruByUsername = async (req, res) => {
  const usernameParam = req.query.username;
  const { nama, gender, tanggalLahir, foto, username, usernameKelas, passwordKelas } = req.body;

  if (!usernameParam) return res.status(400).json({ message: 'Username wajib disertakan.' });

  if (username && username !== usernameParam) {
    const existing = await AkunUser.findOne({ username });
    if (existing) {
      return res.status(400).json({ message: 'Username sudah digunakan.' });
    }
  }

  const updateFields = {};
  if (nama) updateFields.nama = nama;
  if (gender) updateFields.gender = gender;
  if (tanggalLahir) updateFields.tanggalLahir = tanggalLahir;
  if (foto) updateFields.foto = foto;
  if (username) updateFields.username = username;
  if (usernameKelas) updateFields.usernameKelas = usernameKelas;
  if (passwordKelas) {
    const hashedPasswordKelas = await bcrypt.hash(passwordKelas, 10);
    updateFields.passwordKelas = hashedPasswordKelas;
  }

  try {
    const updated = await AkunUser.findOneAndUpdate(
      { username: usernameParam },
      updateFields,
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Guru tidak ditemukan.' });

    res.json({ message: 'Profil berhasil diperbarui.', user: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan saat update.' });
  }
};

const jwt = require('jsonwebtoken'); 

exports.verifikasiKelas = async (req, res) => {
  const { usernameKelas, passwordKelas } = req.body;

  try {
    const user = await AkunUser.findOne({ usernameKelas });
    
    if (!user) return res.status(404).json({ message: 'Username kelas tidak ditemukan' });

    if (!user.passwordKelas) return res.status(500).json({ message: 'Password kelas tidak tersedia.' });
    const match = await bcrypt.compare(passwordKelas, user.passwordKelas);
    if (!match) return res.status(401).json({ message: 'Kode kelas salah' });

    const token = jwt.sign(
      { id: user._id, usernameKelas: user.usernameKelas }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    res.status(200).json({ 
      message: 'Verifikasi berhasil',
      token,
      namaKelas: user.namaKelas
    });

    console.log("usernameKelas dari frontend:", usernameKelas);
    console.log("Data user ditemukan:", user);
    console.log("passwordKelas dari frontend:", passwordKelas);
    console.log("passwordKelas dari database:", user.passwordKelas);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan' });
  }
};

exports.checkUsernameAvailability = async (req, res) => {
  const { username, excludeId } = req.query;

  try {
    const existingUser = await AkunUser.findOne({ username });

    if (existingUser && existingUser._id.toString() !== excludeId) {
      return res.json({ available: false });
    }

    res.json({ available: true });
  } catch (err) {
    res.status(500).json({ message: "Gagal memeriksa username." });
  }
};
