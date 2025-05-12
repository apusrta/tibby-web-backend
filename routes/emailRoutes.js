const express = require('express');
const router = express.Router();
const emailController = require('../controllers/emailController');

router.post('/kirim-email', emailController.kirimEmail);

module.exports = router;
