// routes/contacts.js
const express = require('express');
const router = express.Router();
const motoBikesController = require('../controllers/motoBikes');
const validation = require('../middleware/validate');
const { isAuthenticated } = require('../middleware/authenticator');

// GET all MotoBikes
router.get('/', motoBikesController.getAllMotoBikes);
/**
 * @swagger
 * /motoBikes:
 *   get:
 *     summary: Get all MotoBikes
 *     responses:
 *       200:
 *         description: Success
 */

// GET one MotoBike by ID
router.get('/:id', motoBikesController.getMotoBikeById);
/**
 * @swagger
 * /motoBikes/{id}:
 *   get:
 *     summary: Get a MotoBike by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: MotoBike not found
 */

// POST - create new MotoBike
router.post('/', isAuthenticated, validation.saveMotoBikes, motoBikesController.createMotoBike);
/**
 * @swagger
 * /motoBikes:
 *   post:
 *     summary: Create a new MotoBike
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - make
 *               - model
 *               - year
 *               - engineType
 *               - countryOfManufacture   
 *             properties:
 *               make:
 *                 type: string
 *               model:
 *                 type: string
 *               year:
 *                 type: numeric
 *               engineType:
 *                 type: string
 *               countryOfManufacture:
 *                 type: sring
 *     responses:
 *       201:
 *         description: MotoBike created
 */

// PUT - update motoBike
router.put('/:id', isAuthenticated, validation.saveMotoBikes, motoBikesController.updateMotoBike);
/**
 * @swagger
 * /motoBikes/{id}:
 *   put:
 *     summary: Update a MotoBike by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               make:
 *                 type: string
 *               model:
 *                 type: string
 *               year:
 *                 type: numeric
 *               engineType:
 *                 type: string
 *               countryOfManufacture:
 *                 type: string
 *     responses:
 *       200:
 *         description: MotoBike updated
 *       404:
 *         description: MotoBike not found
 */

// DELETE - delete MotoBike
router.delete('/:id', isAuthenticated, motoBikesController.deleteMotoBike);
/**
 * @swagger
 * /motoBikes/{id}:
 *   delete:
 *     summary: Delete a MotoBike by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: MotoBike deleted
 *       404:
 *         description: MotoBike not found
 */

module.exports = router;
