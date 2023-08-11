const  {Recipe, Diet}  = require('../db');

const recipeUpdate = async(id,name, image, summary, healthScore, steps, diets) =>{
    const uuidRegex = /^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$/;
    if(!uuidRegex.test(id)) return {error:'Enter an id in UUID format'}//valida que el id tenga formato UUID
    const recipeUpd =await Recipe.findByPk(id)
    if(!recipeUpd) return {error:'Recipe not Found'}
    if(name) recipeUpd.name = name;
    if(image) recipeUpd.image = image;
    if(summary)recipeUpd.summary=summary;
    if(healthScore)recipeUpd.healthScore=healthScore; 
    if(steps)recipeUpd.steps=steps;
    if(diets){
        for (let i = 0; i < diets.length; i++) {
            const dietdb = await Diet.findOne({
                where: {
                    name: diets[i]
                }
            })
            recipeUpd.addDiet(dietdb)
        }
    }
    await recipeUpd.save();
    return {msg:'Successfully modified recipe'};
}
module.exports = recipeUpdate