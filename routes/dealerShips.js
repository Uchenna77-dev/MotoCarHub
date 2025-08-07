const express = require('express');
const router = express.Router();
const dealerShipsController = require('../controllers/dealerShips');
const validation = require('../middleware/validate');
const { isAuthenticated } = require('../middleware/authenticator');

// GET all dealerships
router.get('/', dealerShipsController.getAllDealerShips);
/**
 * @swagger
 * /dealerships:
 *   get:
 *     summary: Get all dealerships
 *     responses:
 *       200:
 *         description: Success
 */

// GET dealership by ID
router.get('/:id', dealerShipsController.getDealerShipById);
/**
 * @swagger
 * /dealerships/{id}:
 *   get:
 *     summary: Get a dealership by ID
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
 *         description: Dealership not found
 */

// POST - create dealership
router.post('/', isAuthenticated, validation.saveDealerShips, dealerShipsController.createDealerShip);
/**
 * @swagger
 * /dealerships:
 *   post:
 *     summary: Create a new dealership
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - location
 *             properties:
 *               name:
 *                 type: string
 *               location:
 *                 type: string
 *     responses:
 *       201:
 *         description: Dealership created
 */

// PUT - update dealership
router.put('/:id', isAuthenticated, validation.saveDealerShips, dealerShipsController.updateDealerShip);
/**
 * @swagger
 * /dealerships/{id}:
 *   put:
 *     summary: Update a dealership by ID
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
 *               name:
 *                 type: string
 *               location:
 *                 type: string
 *     responses:
 *       200:
 *         description: Dealership updated
 *       404:
 *         description: Dealership not found
 */

// DELETE - delete dealership
router.delete('/:id', isAuthenticated, dealerShipsController.deleteDealerShip);
/**
 * @swagger
 * /dealerships/{id}:
 *   delete:
 *     summary: Delete a dealership by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dealership deleted
 *       404:
 *         description: Dealership not found
 */

module.exports = router;
