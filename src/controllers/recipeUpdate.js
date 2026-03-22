const { Recipe, Diet } = require('../db');
const { isValidUUID } = require('../utils/validators');
const AppError = require('../utils/AppError');

const recipeUpdate = async (id, name, image, summary, healthScore, steps, diets) => {
  if (!isValidUUID(id)) throw new AppError('ID must be a valid UUID', 400);

  const recipe = await Recipe.findByPk(id);
  if (!recipe) throw new AppError('Recipe not found', 404);

  if (name) recipe.name = name;
  if (image) recipe.image = image;
  if (summary) recipe.summary = summary;
  if (healthScore) recipe.healthScore = healthScore;
  if (steps) recipe.steps = steps;

  if (diets && diets.length) {
    const dietRecords = await Promise.all(
      diets.map((diet) => Diet.findOne({ where: { name: diet } }))
    );
    await recipe.addDiets(dietRecords.filter(Boolean));
  }

  await recipe.save();
  return 'Recipe updated successfully';
};

module.exports = recipeUpdate;
