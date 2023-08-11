const { Recipe, Diet } = require('../db')
const axios = require('axios')
const { API_KEY } = process.env;
const mapApi = require('../utils/getData')
const { Op } = require('sequelize')

const searchRecipesByName = async (name) => {
    // console.log('name->', name);
    let searchedRecipesDb = []
    const allBD = await Recipe.findAll()
    if (allBD) {
        const dbRecipes = await Recipe.findAll({
            where: {
                name: { [Op.iLike]: `%${name}%` }//% se utiliza como un comodín para permitir espacios antes o después del nombre.
            },
        })
        searchedRecipesDb = dbRecipes// si pasa por la base de dato se rompe la api
        //  searchedRecipesDb=dbRecipes[0].toJSON()// si pasa por la base de dato se rompe la api
        //  searchedRecipesDb=dbRecipes.map(recipe => recipe.toJSON())
    }
    //busca en la Api 
    let includesApiRecipes=[]
    const apiRecipes = await mapApi()
    if(apiRecipes){
        const allApiRecipes = await apiRecipes.filter((element) =>
        element.name.toLowerCase().includes(name.toString().toLowerCase())
        )
        includesApiRecipes=allApiRecipes
    }
    // console.log('includesApiRecipes->',includesApiRecipes);
    // console.log('searchedRecipesDb->', searchedRecipesDb);
    if(!includesApiRecipes[0] && !searchedRecipesDb[0]) return {error:'No hay concidencia en la busqueda'}
    console.log('llego al return');
    return [...searchedRecipesDb, ...includesApiRecipes]
    
}
module.exports = searchRecipesByName
