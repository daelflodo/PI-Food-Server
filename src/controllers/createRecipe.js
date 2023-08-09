//esta funcion puede interactual con el modelo
//va ser una funcion async pq trabaja con los metodos del models y estos metodos manejan promesas
//los metodos de los modelos siempre dan una promesa   

const { Recipe, Diet } = require('../db')

// es llamada por createRecipesHandler
const createRecipe = async (name, image, summary, healthScore, steps, diets) => {
    if (!name) return {error:'The name undefined'}
    if (!diets[0]) return {error:'La receta debe tener al menos un tipo de dieta'}
    const recipeFound = await Recipe.findAll({
        where: {
          name: name
        }
      });
      if(!recipeFound[0]){
          const newRecipe = await Recipe.create ({ name, image, summary, healthScore, steps })
          for (let i = 0; i < diets.length; i++) {
              const dietdb = await Diet.findOne({
                  where: {
                      name: diets[i]
                  }
              })
              newRecipe.addDiet(dietdb)
          }
          return newRecipe;
      }
      return{error:'Recipe name already exists'}
}
module.exports = createRecipe ;
   