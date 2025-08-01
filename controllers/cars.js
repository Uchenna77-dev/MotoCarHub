// controllers/contact.js
const { getDb } = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

const getAllCars = async (req, res) => {
  try {
    const db = getDb().db('vehicles');
    const cars = await db.collection('cars').find().toArray();
    res.status(200).json(cars);
  } catch (err) {
    res.status(500).json({ message: 'Error getting cars', error: err });
  }
};

const getCarById = async (req, res) => {
  try {
    const carsId = req.params.id;

    // Validate MongoDB ObjectId
    if (!ObjectId.isValid(carsId)) {
      return res.status(400).json({ message: 'Invalid MongoDB ObjectId format' });
    }

    const db = getDb().db('vehicles');
    const car = await db.collection('cars').findOne({ _id: new ObjectId(carsId) });

    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    res.status(200).json(car);
  } 
  catch (err) {
    console.error('Error fetching car:', err);
    res.status(500).json({
      message: 'Error getting car',
      error: err.message || err.toString()
    });
  }
};

const createCar = async (req, res) => {
  const { make, model, year, color, price, engineType, countryOfManufacture } = req.body;

  if (!make || !model || !year || !color || !price || !engineType || !countryOfManufacture) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const db = getDb().db('vehicles');
    const result = await db.collection('cars').insertOne({
      make,
      model,
      year,
      color,
      price,
      engineType,
      countryOfManufacture
    });

    res.status(201).json({ message: 'Car created', id: result.insertedId });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create car', error: err });
  }
};

const updateCar = async (req, res) => {
  const { make, model, year, color, price, engineType, countryOfManufacture } = req.body;
  const carId = req.params.id;

  // Validate MongoDB ID
  if (!ObjectId.isValid(carId)) {
    return res.status(400).json({ message: 'Invalid car ID' });
  }

  // Validate fields
  if (!make || !model || !year || !color || !price || !engineType || !countryOfManufacture) {
    return res.status(400).json({ message: 'All fields are required for update' });
  }

  try {
    const db = getDb().db('vehicles');

    const update = {
      make,
      model,
      year,
      color,
      price,
      engineType,
      countryOfManufacture
    };

    const result = await db
      .collection('cars')
      .updateOne({ _id: new ObjectId(carId) }, { $set: update });

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Car not found' });
    }

    res.status(200).json({ message: 'Car updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update car', error: err.message });
  }
};


const deleteCar = async (req, res) => {
  const carId = req.params.id;

  if (!ObjectId.isValid(carId)) {
    return res.status(400).json({ message: 'Invalid car ID' });
  }

  try {
    const db = getDb().db('vehicles');
    const result = await db.collection('cars').deleteOne({ _id: new ObjectId(carId) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Car not found' });
    }

    res.status(200).json({ message: 'Car deleted successfully' });
  } 
  catch (err) {
    res.status(500).json({ message: 'Failed to delete car', error: err });
  }
};


module.exports = {
  getAllCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar
};
