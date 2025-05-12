require('dotenv').config();
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token tidak ditemukan.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    console.log("Token diterima:", token);
    console.log("JWT_SECRET saat ini:", process.env.JWT_SECRET);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token valid:", decoded); 

    req.user = decoded;
    next();
  } catch (err) {
    console.error("Token tidak valid:", err.message);
    return res.status(401).json({ message: 'Token tidak valid.' });
  }
};


module.exports = authMiddleware;
