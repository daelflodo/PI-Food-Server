const { Router } = require('express');
const dietRouter = Router();
const { getDietHandler } = require('../handles/dietHandlers');

/**
 * @swagger
 * /diet:
 *   get:
 *     summary: List all diet types
 *     description: |
 *       Returns all dietary categories seeded in the database
 *       (e.g. *Vegan*, *Vegetarian*, *Ketogenic*, *Gluten Free*, etc.).
 *       These names are used when creating or filtering recipes.
 *     tags: [Diets]
 *     responses:
 *       200:
 *         description: An array of diet objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Diet'
 *             example:
 *               - id: 1
 *                 name: Vegan
 *               - id: 2
 *                 name: Vegetarian
 *               - id: 3
 *                 name: Ketogenic
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
dietRouter.get('/', getDietHandler);

module.exports = dietRouter;
