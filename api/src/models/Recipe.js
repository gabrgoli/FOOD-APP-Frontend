const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo


   sequelize.define('Recipe', {
    

    id:{
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey:true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    summary: {
      type : DataTypes.TEXT,
      
    },
    // puntuacion: {
    //   type:DataTypes.INTEGER,
    // },
    healthScore: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    instructions: {
      type: DataTypes.TEXT,
    },
    image:{
      type: DataTypes.STRING(12345),
    },
    createdInDb: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    }
  });
};

