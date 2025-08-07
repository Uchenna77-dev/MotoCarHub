// controllers/user.js
const { getDb } = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

const getAllUsers = async (req, res) => {
  try {
    const db = getDb().db('vehicles');
    const users = await db.collection('users').find().toArray();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error getting users', error: err });
  }
};

const getUserById = async (req, res) => {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid MongoDB ObjectId format' });
  }

  try {
    const db = getDb().db('vehicles');
    const user = await db.collection('users').findOne({ _id: new ObjectId(id) });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error getting user', error: err });
  }
};

const createUser = async (req, res) => {
  const { username, password, email, role, phone } = req.body;
  if (!username || !password || !email || !role || !phone) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const db = getDb().db('vehicles');
    const result = await db.collection('users').insertOne({ username, password, email, role, phone });
    res.status(201).json({ message: 'User created', id: result.insertedId });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create user', error: err });
  }
};

const updateUser = async (req, res) => {
  const id = req.params.id;
  const { username, password, email, role, phone } = req.body;
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }
  if (!username || !password || !email || !role || !phone) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const db = getDb().db('vehicles');
    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(id) },
      { $set: {username, password, email, role, phone } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update user', error: err });
  }
};

const deleteUser = async (req, res) => {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  try {
    const db = getDb().db('vehicles');
    const result = await db.collection('users').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete user', error: err });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};
