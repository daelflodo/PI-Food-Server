const { Recipe, Diet } = require('../db')
const mapApi = require('../utils/getData')


const getAllRecipes = async () => {
    // buscar en db
    //buscar en api
    //unificar
    // console.log("algo ");
    const dbRecipes = await Recipe.findAll(
        {
            include: {
                model: Diet,
                attributes: ["name"],
                through: {
                    attributes: []
                }
            }
        }
    )

    const formattedRecipe = dbRecipes.map(recipe => ({
        ...recipe.toJSON(),//...recipe.toJSON(),
        diets: recipe.diets.map(diet => diet.name)
    }));
    const apiRecipes = await mapApi() //hago el llamado de la funcion q mapea la data de la api
    return [...formattedRecipe, ...apiRecipes]
}
module.exports = getAllRecipes