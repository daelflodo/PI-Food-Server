const { fetchRecipes } = require('../services/spoonacularService');

const mapApiRecipes = async () => {
  const results = await fetchRecipes();
  return results.map((element) => ({
    id: element.id,
    name: element.title,
    diets: element.diets,
    image: element.image,
    summary: element.summary,
    healthScore: element.healthScore,
    steps: element.analyzedInstructions?.[0]?.steps?.map((ste) => ste.step) || [],
    created: false,
  }));
};

module.exports = mapApiRecipes;