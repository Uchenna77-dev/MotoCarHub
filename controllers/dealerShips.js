// controllers/dealership.js
//const { getDb } = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;
const connect = require('../db/connect');

const getAllDealerShips = async (req, res) => {
  try {
    const db = connect.getDb().db('vehicles');
    const dealerships = await db.collection('dealerShips').find().toArray();
    res.status(200).json(dealerships);
  } catch (err) {
    res.status(500).json({ message: 'Error getting dealerShips', error: err });
  }
};

const getDealerShipById = async (req, res) => {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid MongoDB ObjectId format' });
  }

  try {
    const db = connect.getDb().db('vehicles');
    const dealerShip = await db.collection('dealerShips').findOne({ _id: new ObjectId(id) });
    if (!dealerShip) {
      return res.status(404).json({ message: 'DealerShip not found' });
    }
    res.status(200).json(dealerShip);
  } catch (err) {
    res.status(500).json({ message: 'Error getting dealership', error: err });
  }
};

const createDealerShip = async (req, res) => {
  const { name, location, contact, manager, inventoryCapacity } = req.body;
  if (!name || !location || !contact || !manager || !inventoryCapacity) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const db = connect.getDb().db('vehicles');
    const result = await db.collection('dealerShips').insertOne({ name, location, contact, manager, inventoryCapacity });
    res.status(201).json({ message: 'Dealership created', id: result.insertedId });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create dealerShip', error: err });
  }
};

const updateDealerShip = async (req, res) => {
  const id = req.params.id;
  const { name, location, contact, manager, inventoryCapacity } = req.body;
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid dealerShip ID' });
  }
  if (!name || !location || !contact || !manager || !inventoryCapacity) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const db = connect.getDb().db('vehicles');
    const result = await db.collection('dealerShips').updateOne(
      { _id: new ObjectId(id) },
      { $set: { name, location, contact, manager, inventoryCapacity } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'DealerShip not found' });
    }

    res.status(200).json({ message: 'DealerShip updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update dealerShip', error: err });
  }
};

const deleteDealerShip = async (req, res) => {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid dealerShip ID' });
  }

  try {
    const db = connect.getDb().db('vehicles');
    const result = await db.collection('dealerShips').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'DealerShip not found' });
    }

    res.status(200).json({ message: 'DealerShip deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete dealerShip', error: err });
  }
};

module.exports = {
  getAllDealerShips,
  getDealerShipById,
  createDealerShip,
  updateDealerShip,
  deleteDealerShip
};
