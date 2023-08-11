const { Router } = require('express')
const recipesRouter = Router();

const {getRecipebyIdHandler, getRecipesHandler, createRecipesHandler,updateRecipesHandler,deleteRecipesHandler} = require('../handles/recipesHandlers')


recipesRouter.get('/:id', getRecipebyIdHandler)
recipesRouter.get('/', getRecipesHandler)
recipesRouter.post('/', createRecipesHandler)
recipesRouter.put('/', updateRecipesHandler)
recipesRouter.delete('/:id', deleteRecipesHandler)

module.exports = recipesRouter