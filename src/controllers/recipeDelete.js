const { Recipe } = require('../db')
const recipeDelete = async(id)=>{
    
    console.log('id->', id);
    const uuidRegex = /^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$/;
    if(!uuidRegex.test(id)) return {error:'Enter an id in UUID format'}//valida que el id tenga formato UUID
    const recipe = await Recipe.findByPk(id)
    if(!recipe) return {error:'Recipe Not Found'}
    await recipe.destroy()
    return {msg:'Deleted recipe'}

}
module.exports = recipeDelete