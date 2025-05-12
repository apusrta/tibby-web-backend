const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const akunUserSchema = new mongoose.Schema({
  nama: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  gender: { type: String, enum: ['Laki-laki', 'Perempuan'], required: true },
  tanggalLahir: { type: Date, required: true },
  foto: { type: String, default: "" },
  usernameKelas: { type: String, default: "" },
  passwordKelas: { type: String, default: "" }
});

// Hash password sebelum disimpan
akunUserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('AkunUser', akunUserSchema);
