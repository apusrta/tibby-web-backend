require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware CORS
const corsOptions = {
  origin: ['https://tibby-web-frontend.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

console.log("Mongo URI:", process.env.MONGO_URI);
console.log("ENV MONGO_URI:", process.env.MONGO_URI);

// Koneksi ke MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Terhubung ke MongoDB Atlas!'))
.catch((err) => {
  console.error('❌ Gagal terhubung ke MongoDB:', err.message);
});

// Import routes
const siswaRoutes = require('./routes/siswaRoutes'); 
const kelasRoutes = require('./routes/kelasRoutes');
const emailRoutes = require('./routes/emailRoutes');
const akunUserRoutes = require('./routes/akunUserRoutes'); 

// Gunakan routes
app.use('/api/siswa', siswaRoutes);
app.use('/api/kelas', kelasRoutes);
app.use('/api', emailRoutes);
app.use('/api/users', akunUserRoutes);

// Route default
app.get('/', (req, res) => {
  res.send('Halo dari backend Tibby!');
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
