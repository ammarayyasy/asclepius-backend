require('dotenv').config();
const { Firestore } = require('@google-cloud/firestore');

const db = new Firestore();
const collectionName = process.env.FIRESTORE_COLLECTION;

const savePrediction = async (data) => {
  try {
    console.log('Saving data to Firestore:', data);
    const docRef = db.collection(collectionName).doc(data.id);
    await docRef.set(data);
    console.log('Data saved successfully with ID:', data.id);
  } catch (error) {
    console.error('Error saving data to Firestore:', error);
    throw error;
  }
};

const fetchPredictions = async () => {
  try {
    console.log('Fetching predictions from Firestore');
    const snapshot = await db.collection(collectionName).get();
    const predictions = snapshot.docs.map(doc => doc.data());
    console.log('Predictions fetched:', predictions);
    return predictions;
  } catch (error) {
    console.error('Error fetching predictions from Firestore:', error);
    throw error;
  }
};

module.exports = { savePrediction, fetchPredictions };
