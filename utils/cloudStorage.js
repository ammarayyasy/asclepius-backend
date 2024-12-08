require('dotenv').config();
const { Storage } = require('@google-cloud/storage');
const tf = require('@tensorflow/tfjs-node');

const storage = new Storage();
// const bucketName = process.env.CLOUD_STORAGE_BUCKET_NAME;

const loadCloudStorageModel = async () => {
  try {
    const modelUrl = `https://storage.googleapis.com/cancer-bucker-ade/model/model.json`;
    console.log(`Loading model from URL: ${modelUrl}`);
    const model = await tf.loadGraphModel(modelUrl);
    console.log('Model loaded successfully');
    return model;
  } catch (error) {
    console.error('Error loading model:', error);
    throw error;
  }
};

module.exports = { loadCloudStorageModel };
