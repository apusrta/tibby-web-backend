const mongoose = require('mongoose');

const pelanggaranSchema = new mongoose.Schema({
  nama: { type: String, required: true },
  nisn: { type: String, default: '' },
  poin: { type: Number, required: true },
  tanggal: { type: Date, default: Date.now } 
}, { _id: false });

const siswaSchema = new mongoose.Schema({
  nama: { type: String, default: '-' },
  nisn: { type: String, default: '' }, 
  foto: { type: String, default: '' },
  kelas: { type: String, required: true },
  poin: { type: Number, default: 0 },
  riwayatPelanggaran: { type: [pelanggaranSchema], default: [] },

  noTelp: { type: String, default: '' },
  email: { type: String, default: '' },
  alamat: { type: String, default: '' },

  namaAyah: { type: String, default: '' }, 
  telpAyah: { type: String, default: '' },
  emailAyah: { type: String, default: '' },

  namaIbu: { type: String, default: '' },  
  telpIbu: { type: String, default: '' },
  emailIbu: { type: String, default: '' },

  namaWali: { type: String, default: '' }, 
  telpWali: { type: String, default: '' },
  emailWali: { type: String, default: '' },

  emailBK: { type: String, default: '' },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AkunUser',  
    required: true
  }

});

module.exports = mongoose.model('Siswa', siswaSchema);
