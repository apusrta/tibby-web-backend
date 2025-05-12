const express = require('express');
const router = express.Router();
const siswaController = require('../controllers/siswaController');
const authMiddleware = require('../middlewares/authMiddlewares');

router.get('/me', authMiddleware, siswaController.getSiswaByUserLogin);
router.get('/detail/:id', siswaController.getDetailSiswa);
router.get('/kelas/:namaKelas', authMiddleware, siswaController.getSiswaByKelas);
router.post('/', authMiddleware, siswaController.tambahSiswa);
router.patch('/:id/poin', siswaController.tambahPoin);
router.patch('/:id/foto', siswaController.updateFotoSiswa);
router.patch('/:id/nama', siswaController.updateNamaSiswa);
router.patch('/:id/nisn', siswaController.updateNISNSiswa);
router.patch('/update-kelas/:kelasLama', siswaController.updateNamaKelas);
router.put('/:id/kontak', siswaController.updateKontakSiswa);
router.delete('/:id', siswaController.hapusSiswa);
router.delete('/:idSiswa/pelanggaran/:indexPelanggaran', siswaController.hapusPelanggaranSiswa);

module.exports = router;
