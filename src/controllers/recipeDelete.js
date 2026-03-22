const { Recipe } = require('../db');
const { isValidUUID } = require('../utils/validators');
const AppError = require('../utils/AppError');

const recipeDelete = async (id) => {
  if (!isValidUUID(id)) throw new AppError('ID must be a valid UUID', 400);

  const recipe = await Recipe.findByPk(id);
  if (!recipe) throw new AppError('Recipe not found', 404);

  await recipe.destroy();
  return 'Recipe deleted successfully';
};

module.exports = recipeDelete;
