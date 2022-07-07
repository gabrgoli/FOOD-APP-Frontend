const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo


   sequelize.define('Recipe', {
    /*
    https://api.spoonacular.com/recipes/complexSearch?apiKey=ee01ef64bf3d42fea8fa3dfb8884fd1b&addRecipeInformation=true%27

    https://api.spoonacular.com/recipes/complexSearch?apiKey=ee01ef64bf3d42fea8fa3dfb8884fd1b&addRecipeInformation=true
    */

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
    resumen: {
      type : DataTypes.TEXT,
      defaultValue: "no hay info",
    },
    // puntuacion: {
    //   type:DataTypes.INTEGER,
    // },
    nivel: {
      type: DataTypes.STRING,
      defaultValue: "0",
    },
    pasoApaso: {
      type: DataTypes.TEXT,
      defaultValue: "no hay info",
    },
    imagen:{
      type: DataTypes.STRING(12345),
    },
    createdInDb: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    }
  });
};

