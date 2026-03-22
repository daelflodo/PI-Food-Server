const { Diet } = require('../db');
const mapApiRecipes = require('../utils/getData');

const getDiet = async () => {
  let dietsDb = await Diet.findAll();

  if (!dietsDb.length) {
    const apiRecipes = await mapApiRecipes();
    const uniqueDietNames = [...new Set(apiRecipes.flatMap((recipe) => recipe.diets))];

    await Promise.all(
      uniqueDietNames.map((name) => Diet.findOrCreate({ where: { name } }))
    );

    dietsDb = await Diet.findAll();
  }

  return dietsDb;
};

module.exports = getDiet;
