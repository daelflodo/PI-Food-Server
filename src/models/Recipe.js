const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define(
    'recipe',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        // allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      image: {
        type: DataTypes.STRING,
        // allowNull: false
      },
      summary: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      healthScore: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      steps: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
       created: {
        type: DataTypes.BOOLEAN,// funciona a modo de flat para saber q lo cree yo
        // allowNull: false,
        defaultValue: true,
      },
    },
    {
      timestamps: false
    }
  );
};
