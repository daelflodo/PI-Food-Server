
const { Diet } = require('../db');
const mapApi = require('../utils/getData')

const getDiet = async () => {

    let dietsDb = await Diet.findAll()
    if (!dietsDb.length) {
        const apiInfo = await mapApi();
        const diets = await apiInfo.map((element) => element.diets).flat();
        const allDiets = [];

        diets.forEach(diet => {
            if (!allDiets.some(el => el.name === diet)) {// verificar si algún elemento en allDiets tiene el mismo nombre 
                allDiets.push({ name: diet });//sino encuentra ninguna dieta en el array hace un push con la dieta nueva
            }
        });

        for (const diet of allDiets) {
            await Diet.findOrCreate({
                where: {
                    name: diet.name
                }
            });
        }
        dietsDb = await Diet.findAll()
    }


    return dietsDb;
}

module.exports = getDiet