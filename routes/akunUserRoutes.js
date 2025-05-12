// routes/akunUserRoutes.js
const express = require('express');
const router = express.Router();
const akunUserController = require('../controllers/akunUserController');


router.post('/register', akunUserController.registerUser);
router.post('/login', akunUserController.loginUser);
router.get('/guru', akunUserController.getGuruByUsername);
router.patch('/guru', akunUserController.updateGuruByUsername);
router.post('/verifikasi-kelas', akunUserController.verifikasiKelas);
router.get('/check-username', akunUserController.checkUsernameAvailability);

module.exports = router;
