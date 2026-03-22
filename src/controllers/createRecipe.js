const { Recipe, Diet } = require('../db');
const AppError = require('../utils/AppError');

const createRecipe = async (name, image, summary, healthScore, steps, diets) => {
  if (!name) throw new AppError('Recipe name is required', 400);
  if (!diets || !diets.length) throw new AppError('Recipe must have at least one diet type', 400);

  const existing = await Recipe.findOne({ where: { name } });
  if (existing) throw new AppError('Recipe name already exists', 409);

  const newRecipe = await Recipe.create({ name, image, summary, healthScore, steps });

  const dietRecords = await Promise.all(
    diets.map((diet) => Diet.findOne({ where: { name: diet } }))
  );
  await newRecipe.addDiets(dietRecords.filter(Boolean));

  return newRecipe;
};

module.exports = createRecipe;
