const { Router } = require('express');
const recipesRouter = Router();

const { getRecipebyIdHandler, getRecipesHandler, createRecipesHandler, updateRecipesHandler, deleteRecipesHandler } = require('../handles/recipesHandlers');

/**
 * @swagger
 * /recipes:
 *   get:
 *     summary: List all recipes
 *     description: |
 *       Returns all recipes merged from the local PostgreSQL database and
 *       the **Spoonacular API** (up to 100 recipes). Falls back to cached
 *       local data if the Spoonacular quota is reached.
 *       Optionally filter by name using the `name` query parameter.
 *     tags: [Recipes]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Partial or full recipe name to search for (case-insensitive)
 *         example: pasta
 *     responses:
 *       200:
 *         description: An array of recipe objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Recipe'
 *       404:
 *         description: No recipes found matching the given name
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
recipesRouter.get('/', getRecipesHandler);

/**
 * @swagger
 * /recipes/{id}:
 *   get:
 *     summary: Get a recipe by ID
 *     description: |
 *       Fetches a single recipe by its ID.
 *       - If **`id` is a number** → queries the Spoonacular API directly.
 *       - If **`id` is a UUID** → queries the local PostgreSQL database.
 *     tags: [Recipes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Numeric Spoonacular ID or UUID of a local recipe
 *         example: 716429
 *     responses:
 *       200:
 *         description: Recipe found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recipe'
 *       404:
 *         description: Recipe not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
recipesRouter.get('/:id', getRecipebyIdHandler);

/**
 * @swagger
 * /recipes:
 *   post:
 *     summary: Create a new recipe
 *     description: |
 *       Creates a new recipe and persists it in the PostgreSQL database.
 *       The `image` field should be a Cloudinary URL obtained via the
 *       Cloudinary Upload Widget on the client side.
 *       At least one existing `diet` name must be provided.
 *     tags: [Recipes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RecipeInput'
 *     responses:
 *       201:
 *         description: Recipe created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recipe'
 *       400:
 *         description: Validation error (missing fields or invalid data)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: A recipe with the same name already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
recipesRouter.post('/', createRecipesHandler);

/**
 * @swagger
 * /recipes:
 *   put:
 *     summary: Update an existing recipe
 *     description: |
 *       Partially updates a locally stored recipe (UUID required in the body).
 *       Only the fields provided in the request body are updated.
 *       Note: only recipes created in the local DB (UUID) can be updated;
 *       Spoonacular recipes are read-only.
 *     tags: [Recipes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RecipeUpdate'
 *     responses:
 *       200:
 *         description: Recipe updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessMessage'
 *       400:
 *         description: Missing or invalid ID (must be a valid UUID)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Recipe not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
recipesRouter.put('/', updateRecipesHandler);

/**
 * @swagger
 * /recipes/{id}:
 *   delete:
 *     summary: Delete a recipe
 *     description: |
 *       Permanently deletes a recipe from the local database by its UUID.
 *       Only locally created recipes (UUID) can be deleted.
 *     tags: [Recipes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID of the recipe to delete
 *         example: a1b2c3d4-e5f6-7890-abcd-ef1234567890
 *     responses:
 *       200:
 *         description: Recipe deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessMessage'
 *       400:
 *         description: Invalid ID format (must be a valid UUID)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Recipe not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
recipesRouter.delete('/:id', deleteRecipesHandler);

module.exports = recipesRouter;
