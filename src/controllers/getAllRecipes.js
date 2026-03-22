const { Recipe, Diet } = require('../db');
const mapApiRecipes = require('../utils/getData');

const getAllRecipes = async () => {
  const [dbRecipes, apiRecipes] = await Promise.all([
    Recipe.findAll({
      include: { model: Diet, attributes: ['name'], through: { attributes: [] } },
    }),
    mapApiRecipes(),
  ]);

  const formattedRecipes = dbRecipes.map((recipe) => ({
    ...recipe.toJSON(),
    diets: recipe.diets.map((diet) => diet.name),
  }));

  return [...formattedRecipes, ...apiRecipes];
};

module.exports = getAllRecipes;
