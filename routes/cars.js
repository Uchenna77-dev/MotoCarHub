// routes/contacts.js
const express = require('express');
const router = express.Router();
const carsController = require('../controllers/cars');
const validation = require('../middleware/validate');
const { isAuthenticated } = require('../middleware/authenticator');
//const {isAuthenticated} = require('../middleware/authenticator');


// GET all cars
router.get('/', carsController.getAllCars);
/**
 * @swagger
 * /cars:
 *   get:
 *     summary: Get all cars
 *     responses:
 *       200:
 *         description: Success
 */

// GET one car by ID
router.get('/:id', carsController.getCarById);
/**
 * @swagger
 * /cars/{id}:
 *   get:
 *     summary: Get a car by ID
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
 *         description: Contact not found
 */

// POST - create new car
router.post('/', isAuthenticated, validation.saveCars, carsController.createCar);
/**
 * @swagger
 * /cars:
 *   post:
 *     summary: Create a new car
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
 *               - color
 *               - price
 *               - engineType
 *               - countryOfManufacture   
 *             properties:
 *               make:
 *                 type: string
 *               model:
 *                 type: string
 *               year:
 *                 type: numeric
 *               color:
 *                 type: string
 *               price:
 *                 type: numeric
 *               engineType:
 *                 type: string
 *               countryOfManufacture:
 *                 type: string
 *     responses:
 *       201:
 *         description: Car created
 */

// PUT - update car
router.put('/:id', isAuthenticated, validation.saveCars, carsController.updateCar);
/**
 * @swagger
 * /cars/{id}:
 *   put:
 *     summary: Update a car by ID
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
 *               color:
 *                 type: string
 *               price:
 *                 type: numeric
 *               engineType:
 *                 type: string
 *               countryOfManufacture:
 *                 type: sring
 *     responses:
 *       200:
 *         description: Car updated
 *       404:
 *         description: Car not found
 */

// DELETE - delete car
router.delete('/:id', isAuthenticated, carsController.deleteCar);
/**
 * @swagger
 * /cars/{id}:
 *   delete:
 *     summary: Delete a car by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Car deleted
 *       404:
 *         description: Car not found
 */

module.exports = router;
