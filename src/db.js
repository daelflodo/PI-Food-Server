require('dotenv').config();
const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');

const { DATA_BASE_URL } = process.env;

const sequelize = new Sequelize(DATA_BASE_URL, {
  logging: false,
  native: false,
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
});

const basename = path.basename(__filename);

// Load and register all model files from /models
fs.readdirSync(path.join(__dirname, '/models'))
  .filter((file) => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js')
  .forEach((file) => require(path.join(__dirname, '/models', file))(sequelize));

// Capitalize model names: recipe → Recipe, diet → Diet
sequelize.models = Object.fromEntries(
  Object.entries(sequelize.models).map(([key, value]) => [
    key[0].toUpperCase() + key.slice(1),
    value,
  ])
);

const { Recipe, Diet } = sequelize.models;

Recipe.belongsToMany(Diet, { through: 'recipe_diet' });
Diet.belongsToMany(Recipe, { through: 'recipe_diet' });

module.exports = {
  ...sequelize.models,
  conn: sequelize,
};
