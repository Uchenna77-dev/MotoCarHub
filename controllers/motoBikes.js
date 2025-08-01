// controllers/contact.js
const { getDb } = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

const getAllMotoBikes = async (req, res) => {
  try {
    const db = getDb().db('vehicles');
    const motoBikes = await db.collection('motoBikes').find().toArray();
    res.status(200).json(motoBikes);
  } catch (err) {
    res.status(500).json({ message: 'Error getting motoBikes', error: err });
  }
};

const getMotoBikeById = async (req, res) => {
  try {
    const bikeId = req.params.id;

    // Validate MongoDB ObjectId
    if (!ObjectId.isValid(bikeId)) {
      return res.status(400).json({ message: 'Invalid MongoDB ObjectId format' });
    }

    const db = getDb().db('vehicles');
    const bike = await db.collection('motoBikes').findOne({ _id: new ObjectId(bikeId) });

    if (!bike) {
      return res.status(404).json({ message: 'MotoBike not found' });
    }

    res.status(200).json(bike);
  } 
  catch (err) {
    console.error('Error fetching MotoBike:', err);
    res.status(500).json({
      message: 'Error getting MotoBike',
      error: err.message || err.toString()
    });
  }
};

const createMotoBike = async (req, res) => {
  const { make, model, year, engineType, countryOfManufacture } = req.body;

  if (!make || !model || !year || !engineType || !countryOfManufacture) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const db = getDb().db('vehicles');
    const result = await db.collection('motoBikes').insertOne({
      make,
      model,
      year,
      engineType,
      countryOfManufacture
    });

    res.status(201).json({ message: 'MotoBike created', id: result.insertedId });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create MotoBike', error: err });
  }
};

const updateMotoBike = async (req, res) => {
  const { make, model, year, engineType, countryOfManufacture } = req.body;
  const bikeId = req.params.id;

  // Validate MongoDB ID
  if (!ObjectId.isValid(bikeId)) {
    return res.status(400).json({ message: 'Invalid MotoBike ID' });
  }

  // Validate fields
  if (!make || !model || !year || !engineType || !countryOfManufacture) {
    return res.status(400).json({ message: 'All fields are required for update' });
  }

  try {
    const db = getDb().db('vehicles');

    const update = {
      make,
      model,
      year,
      engineType,
      countryOfManufacture
    };

    const result = await db
      .collection('motoBikes')
      .updateOne({ _id: new ObjectId(bikeId) }, { $set: update });

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'MotoBike not found' });
    }

    res.status(200).json({ message: 'MotoBike updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update MotoBike', error: err.message });
  }
};


const deleteMotoBike = async (req, res) => {
  const bikeId = req.params.id;

  if (!ObjectId.isValid(bikeId)) {
    return res.status(400).json({ message: 'Invalid motoBike ID' });
  }

  try {
    const db = getDb().db('vehicles');
    const result = await db.collection('motoBikes').deleteOne({ _id: new ObjectId(bikeId) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'MotoBike not found' });
    }

    res.status(200).json({ message: 'MotoBike deleted successfully' });
  } 
  catch (err) {
    res.status(500).json({ message: 'Failed to delete MotoBike', error: err });
  }
};


module.exports = {
  getAllMotoBikes,
  getMotoBikeById,
  createMotoBike,
  updateMotoBike,
  deleteMotoBike
};
