const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const apiRoutes = require('./routes/apiRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Konfigurasi Multer (untuk menangani file image)
const upload = multer({
  limits: { fileSize: 1000000 }, // Batas ukuran file 1MB
  fileFilter: (req, file, cb) => {
    // Validasi tipe file (hanya menerima gambar)
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Invalid file type, only images are allowed'));
    }
    cb(null, true);
  },
});

// logging atau debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});


// Middleware global
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware khusus untuk route predict (file upload)
app.use('/predict', upload.single('image'), apiRoutes);

// Middleware untuk error dari Multer
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Penanganan error Multer (misalnya ukuran file terlalu besar)
    return res.status(413).json({
      status: 'fail',
      message: `Payload content length greater than maximum allowed: 1000000`,
    });
  } else if (err.message === 'Invalid file type, only images are allowed') {
    // Penanganan error tipe file
    return res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
  next(err); // Lanjutkan ke error handler berikutnya
});

// Error handler umum
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ status: 'fail', message: 'Internal Server Error' });
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
