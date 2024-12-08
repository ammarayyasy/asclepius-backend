const express = require('express');
const { predictImage, getPredictionHistories } = require('../controllers/predictionController');
const router = express.Router();

router.post('/', predictImage);
router.get('/histories', getPredictionHistories);

module.exports = router;
