const { loadModel, predict } = require('../utils/imageProcessor');
const { savePrediction, fetchPredictions } = require('../utils/firestore');

const predictImage = async (req, res) => {
  try {
    const image = req.file;
    // Debug ukuran file
    if (image) {
      console.log(`File size: ${image.size} bytes`);
    } else {
      console.log('No file uploaded');
    }
    if (!image || image.size > 1000000) {
      return res.status(413).json({
        status: 'fail',
        message: 'Payload content length greater than maximum allowed: 1000000',
      });
    }

    const result = await predict(image.buffer);
    const suggestion = result === 'Cancer' ? 'Segera periksa ke dokter!' : 'Penyakit kanker tidak terdeteksi.';
    const data = {
      id: require('uuid').v4(),
      result,
      suggestion,
      createdAt: new Date().toISOString()
    };

    await savePrediction(data);

    res.status(201).json({ status: 'success', message: 'Model is predicted successfully', data });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: 'Terjadi kesalahan dalam melakukan prediksi' });
  }
};

const getPredictionHistories = async (req, res) => {
  try {
    const predictions = await fetchPredictions();
    res.status(200).json({ status: 'success', data: predictions });
  } catch (error) {
    res.status(500).json({ status: 'fail', message: 'Failed to fetch prediction histories' });
  }
};

module.exports = { predictImage, getPredictionHistories };
