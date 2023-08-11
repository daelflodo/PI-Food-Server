const createRecipe = require('../controllers/createRecipe')
const getRecipebyId = require('../controllers/getRecipebyId')
const getAllRecipes = require('../controllers/getAllRecipes')
const searchRecipesByName = require('../controllers/searchRecipesByName')
const recipeUpdate = require('../controllers/recipeUpdate')
const recipeDelete = require('../controllers/recipeDelete')

const getRecipebyIdHandler = async (req, res) => {
    const { id } = req.params//GKUYGJGV-54GHGFG-GDFG
    const sourceId = isNaN(id) ? 'DB' : 'API'
    try {
        const recipe = await getRecipebyId(id, sourceId);
        res.status(200).json(recipe)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }

    // res.send(`Dael: Esta ruta obtiene el detalle de la receta con id: ${id}`)
}
const getRecipesHandler = async (req, res) => {
    const { name } = req.query;
    // console.log('name handle->');
    try {
        const resultRecipes = name ? await searchRecipesByName(name) : await getAllRecipes();
        if (resultRecipes.error) return res.status(404).send(resultRecipes.error)
        return res.status(200).json(resultRecipes)
    } catch (error) {
        return res.status(405).send(error.message)
    }
}

//ruta post para crear recipes recibe body del formulario
const createRecipesHandler = async (req, res) => {
    const { name, image, summary, healthScore, steps, diets } = req.body
    //colocamos un try catch en esta pocicion y resuelve el error q podria retornar el controller
    try {
        const newRecipe = await createRecipe(name, image, summary, healthScore, steps, diets)
        console.log(newRecipe.error);
        if (!diets[0]) return res.status(404).send(newRecipe.error)
        if (newRecipe.error) return res.status(404).send(newRecipe.error)// responde con el error q viene del controlador
        return res.status(201).send(newRecipe)
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
}

const updateRecipesHandler = async (req, res) => {
    const { id, name, image, summary, healthScore, steps, diets } = req.body
    console.log('put->', req.body);
    try {
        if (!id) return res.status(404).send('Missing ID data')
        const update = await recipeUpdate(id, name, image, summary, healthScore, steps, diets)

        if (update.error) return res.status(404).send(update.error)
        if(update.msg) return res.status(200).send(update.msg )
    } catch (error) {
        return res.status(401).json(error)
    }
}
const deleteRecipesHandler = async(req, res) => {
    const { id } = req.params
    try {
        const resultDelete = await recipeDelete(id)
        if(resultDelete.error) return res.status(400).send(resultDelete.error)
        if(resultDelete.msg) return res.status(200).send(resultDelete.msg)
    } catch (error) {
        return res.status(401).json(error)
    }
}
module.exports = {
    getRecipebyIdHandler,
    getRecipesHandler,
    createRecipesHandler,
    updateRecipesHandler,
    deleteRecipesHandler
}