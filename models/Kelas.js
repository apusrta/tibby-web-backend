const mongoose = require('mongoose');

const kelasSchema = new mongoose.Schema({
  nama: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'AkunUser', required: true },
  usernameKelas: { type: String },
  namaKelas: { type: String } 
});


module.exports = mongoose.model('Kelas', kelasSchema);
