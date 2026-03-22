const getDiet = require('../controllers/DietController');

const getDietHandler = async (req, res) => {
  try {
    const diets = await getDiet();
    res.status(200).json(diets);
  } catch (error) {
    const status = error.statusCode || 500;
    res.status(status).json({ error: error.message });
  }
};

module.exports = { getDietHandler };
