const { Recipe, Diet } = require('../db');
const { Op } = require('sequelize');
const mapApiRecipes = require('../utils/getData');
const AppError = require('../utils/AppError');

const searchRecipesByName = async (name) => {
  const [dbRecipes, apiRecipes] = await Promise.all([
    Recipe.findAll({
      where: { name: { [Op.iLike]: `%${name}%` } },
      include: { model: Diet, attributes: ['name'], through: { attributes: [] } },
    }),
    mapApiRecipes(),
  ]);

  const matchingApiRecipes = apiRecipes.filter((el) =>
    el.name.toLowerCase().includes(name.toLowerCase())
  );

  if (!dbRecipes.length && !matchingApiRecipes.length) {
    throw new AppError('No recipes found matching that name', 404);
  }

  return [...dbRecipes, ...matchingApiRecipes];
};

module.exports = searchRecipesByName;
