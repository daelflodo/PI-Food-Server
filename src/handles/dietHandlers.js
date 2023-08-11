const getDiet = require('../controllers/DietController')
const getDietHandler = async (req, res) => {

    try {
        const allDiet = await getDiet();
        res.status(200).json(allDiet);
      } catch (error) {
        res.status(401).json({error:error.message});
      }

}

module.exports = {
    getDietHandler,
}