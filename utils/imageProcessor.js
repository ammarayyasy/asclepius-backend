const tf = require('@tensorflow/tfjs-node');
const { loadCloudStorageModel } = require('./cloudStorage');

let model;

const loadModel = async () => {
  if (!model) {
    console.log('Loading model...');
    model = await loadCloudStorageModel();
    console.log('Model loaded successfully');
  }
};

const predict = async (imageBuffer) => {
  try {
    await loadModel();

    console.log('Processing image...');
    const tensor = tf.node.decodeImage(imageBuffer)
      .resizeNearestNeighbor([224, 224])
      .toFloat()
      .expandDims();
    console.log('Tensor shape:', tensor.shape);

    const prediction = await model.predict(tensor).data();
    console.log('Prediction result:', prediction);

    return prediction[0] > 0.5 ? 'Cancer' : 'Non-cancer';
  } catch (error) {
    console.error('Error during prediction:', error);
    throw error;
  }
};

module.exports = { loadModel, predict };
