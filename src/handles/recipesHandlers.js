const createRecipe = require('../controllers/createRecipe');
const getRecipebyId = require('../controllers/getRecipebyId');
const getAllRecipes = require('../controllers/getAllRecipes');
const searchRecipesByName = require('../controllers/searchRecipesByName');
const recipeUpdate = require('../controllers/recipeUpdate');
const recipeDelete = require('../controllers/recipeDelete');

const handleError = (res, error) => {
  const status = error.statusCode || 500;
  res.status(status).json({ error: error.message });
};

const getRecipebyIdHandler = async (req, res) => {
  const { id } = req.params;
  const sourceId = isNaN(id) ? 'DB' : 'API';
  try {
    const recipe = await getRecipebyId(id, sourceId);
    res.status(200).json(recipe);
  } catch (error) {
    handleError(res, error);
  }
};

const getRecipesHandler = async (req, res) => {
  const { name } = req.query;
  try {
    const recipes = name ? await searchRecipesByName(name) : await getAllRecipes();
    res.status(200).json(recipes);
  } catch (error) {
    handleError(res, error);
  }
};

const createRecipesHandler = async (req, res) => {
  const { name, image, summary, healthScore, steps, diets } = req.body;
  try {
    const newRecipe = await createRecipe(name, image, summary, healthScore, steps, diets);
    res.status(201).json(newRecipe);
  } catch (error) {
    handleError(res, error);
  }
};

const updateRecipesHandler = async (req, res) => {
  const { id, name, image, summary, healthScore, steps, diets } = req.body;
  try {
    if (!id) return res.status(400).json({ error: 'Missing recipe ID' });
    const message = await recipeUpdate(id, name, image, summary, healthScore, steps, diets);
    res.status(200).json({ message });
  } catch (error) {
    handleError(res, error);
  }
};

const deleteRecipesHandler = async (req, res) => {
  const { id } = req.params;
  try {
    const message = await recipeDelete(id);
    res.status(200).json({ message });
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = {
  getRecipebyIdHandler,
  getRecipesHandler,
  createRecipesHandler,
  updateRecipesHandler,
  deleteRecipesHandler,
};
