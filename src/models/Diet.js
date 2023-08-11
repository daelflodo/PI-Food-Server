const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
    // defino el modelo
    sequelize.define(
        'diet',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true, 
                autoIncrement: true,
                // defaultValue: DataTypes.UUIDV4,// Es para que se genere solo el id
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            }
        },
        {
            timestamps: false   
        }
        );
};