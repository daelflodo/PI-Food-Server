const  axios  = require("axios");
const { Recipe, Diet } = require('../db')
const { API_KEY } = process.env;

const getRecipebyId = async (id, sourceId) => {
    let result, recipeById;
    if (sourceId === 'API') {
        result = (await axios.get(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}`)).data
        // result = (await axios.get(`http://localhost:8080/recipes/${id}/information?apiKey=${API_KEY}`)).data
         recipeById = {
            id: result.id,
            name: result.title,//API
            image: result.image,
            summary: result.summary,
            healthScore: result.healthScore,
            steps: result.analyzedInstructions[0]?.steps?.map((ste) => ste.step ) || [],//API 
            diets: result.diets,
        }
    } else {
        const data = await Recipe.findOne({where:{id},
            include: {
              model: Diet,
              attributes: ["name"],
              through: {
                attributes: []
              }
            }})

            result = await data.toJSON();//
            recipeById = {
            id: result.id,
            name: result.name,//DB
            image: result.image,
            summary: result.summary,
            healthScore: result.healthScore,
            steps: result.steps,//DB
            diets:result.diets?.map(ele=>ele.name) 
        }
    }
    return recipeById
}
// const getRecipebyId = async (id, sourceId) => { 
//      console.log('id de control',id);
//      console.log('Source Id control:', sourceId);
//     const result = sourceId === 'API'
//         ? (await axios.get(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}`)).data
//         : await Recipe.findByPk(id)
//         console.log('result control:' ,result.dataValues);
//     const recipeById = {
//         id: result.id,
//         name: result.name,//DB
//         name: result.title,//API
//         image: result.image,
//         summary: result.summary,
//         healthScore: result.healthScore,
//         steps: result.steps,//DB
//         steps: result.analyzedInstructions[0]?.steps?.map(ste=>ste.step) || [],//API
//         diets: result.diets,
//         // diets: result.diets

//     }
//     // console.log(recipeById);
//     return recipeById
// }
module.exports = getRecipebyId