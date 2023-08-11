const { Diet } = require('../db');
const getDiet = require('../controllers/DietController')
const getDietHandler = async (req, res) => {

    try {
        const allDiet = await getDiet();
        res.status(200).json(allDiet);
      } catch (error) {
        res.status(401).json({error:error.message});
      }

}

// const getDietByIdHandler =(req, res)=>{
//     res.send('NIY: Esta ruta trae la informacion una dieta por id')
// }

module.exports = {
    getDietHandler,
    // getDietByIdHandler
}