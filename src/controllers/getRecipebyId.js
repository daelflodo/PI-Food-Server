const { Recipe, Diet } = require('../db');
const { fetchRecipeById } = require('../services/spoonacularService');
const AppError = require('../utils/AppError');

const getRecipebyId = async (id, sourceId) => {
  if (sourceId === 'API') {
    const result = await fetchRecipeById(id);
    return {
      id: result.id,
      name: result.title,
      image: result.image,
      summary: result.summary,
      healthScore: result.healthScore,
      steps: result.analyzedInstructions?.[0]?.steps?.map((ste) => ste.step) || [],
      diets: result.diets,
    };
  }

  const data = await Recipe.findOne({
    where: { id },
    include: { model: Diet, attributes: ['name'], through: { attributes: [] } },
  });

  if (!data) throw new AppError('Recipe not found', 404);

  const result = data.toJSON();
  return {
    id: result.id,
    name: result.name,
    image: result.image,
    summary: result.summary,
    healthScore: result.healthScore,
    steps: result.steps,
    diets: result.diets?.map((ele) => ele.name),
  };
};

module.exports = getRecipebyId;
