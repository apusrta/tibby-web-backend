const express = require('express');
const router = express.Router();
const kelasController = require('../controllers/kelasController');
const authMiddleware = require('../middlewares/authMiddlewares');

router.get('/me', authMiddleware, kelasController.getKelasByUser);
router.patch('/', authMiddleware, kelasController.updateNamaKelas);
router.get('/nama', authMiddleware, kelasController.getKelasByUsername);

module.exports = router;
