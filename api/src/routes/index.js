const { Router } = require("express");
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const axios = require("axios");
//const TipoDeDieta = require('../models/TipoDeDieta');
const { Recipe, TipoDeDieta } = require("../db");
const { API_KEY } = process.env;
const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

//c085770cf9ff44dda5ad0d72367fde38

//ee01ef64bf3d42fea8fa3dfb8884fd1b

const getApiInfo = async () => {
  const apiUrl = await axios.get(
    `https://api.spoonacular.com/recipes/complexSearch?number=100&offset=100&addRecipeInformation=true&diet&apiKey=${API_KEY}`
  );
  /*const apiUrl2 = await axios.get(
    `https://api.spoonacular.com/recipes/complexSearch?number=500&offset=2&addRecipeInformation=true&diet&apiKey=${API_KEY}`
  );*/

  //let apiUrl3=apiUrl.data.results.concat(apiUrl2.data.results)
  //const apiInfo = await apiUrl3.map((el) => {
    const apiInfo = await apiUrl.data.results.map((el) => {
      
    return {
      id: el.id,
      title: el.title,
      summary: el.summary.replace(/<[^>]*>?/g, ""),
      //puntuacion: el.spoonacularScore,
      healthScore: el.healthScore,
      instructions: el.analyzedInstructions[0]?.steps.map((each) => {
        return each.step.concat({number:each.number, step:each.step})
      }),
      image: el.image,
      diets: el.diets.map((diet) => ({ name: diet })),
      //pasoApaso: el.analyzedInstructions.map(el=>el===steps),
      createdInDb:false
    };

  } ) ;
  //console.log("apiInfo:",apiInfo[4])
  return apiInfo;
};


const getDataBaseInfo = async () => {
  const recipes = await Recipe.findAll({
    include: {
      model: TipoDeDieta,
      attributes: ["name"],
      through: {
        attributes: [],
      },
    },
  });
  returnRecipes = recipes.map((recipe) => {
    return {
      id: recipe.id,
      title: recipe.title,
      image: recipe.image,
      summary: recipe.summary,
      //puntuacion: recipe.puntuacion,
      healthScore: recipe.healthScore,
      //dieta: recipe.TipoDeDieta,
      diets: recipe.TipoDeDieta,
      instructions: recipe.instructions,
    };
  });

  return returnRecipes;
};

const getAllRecipes = async () => {
  const apiInfo = await getApiInfo();
  const dbInfo = await getDataBaseInfo();
  const infoTotal = apiInfo.concat(dbInfo);
  //console.log(infoTotal);
  return infoTotal;

};

const searchByIdAtApi = async (id) => {
  try {
    const recipe = await axios.get(
      `https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}`
    );
    const detail = recipe.data;
    return {
      id: detail.id,
      title: detail.title,
      image: detail.image,
      summary: detail.summary.replace(/<[^>]*>?/g, ""),
      //puntuacion: detail.spoonacularScore,
      healthScore: detail.healthScore,
      diets: detail.diets.map((diet) => ({ name: diet })),
      instructions: detail.instructions.replace(/<[^>]*>?/g, ""),
    };
  } catch {
    return undefined;
  }
};

const searchByIdAtDB = async (id) => {
  try {
    const recipe = await Recipe.findByPk(id, {
      include: {
        model: TipoDeDieta,
        attributes: ["name"],
        through: {
          attributes: [],
        }, 
      },
    });
    return {
      id: recipe.id,
      title: recipe.title,
      image: recipe.image,
      summary: recipe.summary,
     // puntuacion: recipe.puntuacion,
      healthScore: recipe.healthScore,
      diets: recipe.TipoDeDieta,
      instructions: recipe.instructions,
    };
  } catch {
    return undefined;
  }
};

const searchById = async (id) => {
  const apiRecipeProm = searchByIdAtApi(id);
  const dbRecipeProm = searchByIdAtDB(id);

  const [apiRecipe, dbRecipe] = await Promise.all([
    apiRecipeProm,
    dbRecipeProm,
  ]); // hace las promesas

  return apiRecipe || dbRecipe;
};



/*[ ] GET /recipes?name="...":
Buscar Receta por nombre que lleva a traves de query O TRAE TODAS las recetas
*/

router.get("/recipes", async (req, res) => {
  const name = req.query.name; //
  let recipeTotal = await getAllRecipes();
  if (name) {
    let recipeName = await recipeTotal.filter((el) =>el.title.toLowerCase().includes(name.toLowerCase())); 
    
    recipeName.length?
      res.status(200).send(recipeName)
    :
      res.status(404).send("no esta la receta");
  } else {
    //console.log('todas la recetas',recipeTotal)
   // console.log('ejemplo de nivel',recipeTotal)
    recipeTotal?.map((recipe) => {
      Recipe.findOrCreate({ where: { 
        title: recipe?.title,
        summary: recipe.summary,
        healthScore: recipe.healthScore       
      //  instructions: recipe.instructions,
        //image: recipe?.image
       // createdInDb: false
      } });
    });

    res.status(200).send(recipeTotal); //si no hay un name no entra al if y muestra todas las recetas
  }
});

/*
[ ] GET /recipes/{idReceta}:
Obtener el detalle de una receta en particular
Debe traer solo los datos pedidos en la ruta de detalle de receta
Incluir los tipos de dieta asociados
*/

router.get("/recipes/:idReceta", async (req, res, next) => {
  try {
    const id = req.params.idReceta;
    const detailById = await searchById(id);
    if (!detailById) {
      return res.status(404).send("Recipe by Id doesn´t exist");
    }
    res.status(200).send(detailById);
  } catch (error) {
    next(error);
  }
});

router.get("/types", async (req, res) => {
  try {
    const types = [];
    const recipesApi = await getApiInfo();
    const dietsApi = recipesApi.map((recipe) => recipe.diets);

    dietsApi.forEach((diet) =>
    diet.forEach((diet) => {
        if (!types.includes(diet.name)) {
          types.push(diet.name);
        }
      })
    );
    types.forEach((e) => {
      TipoDeDieta.findOrCreate({
        where: { name: e[0].toUpperCase()+e.substring(1) },
      });
    });
    const allresults = await TipoDeDieta.findAll({
      attributes: ["name"],
    });

    res.send(
      allresults.map((e) => {
        return { name: e.name };
      })
    );
    /*
    const dat = [
      { name: "gluten free" },
      { name: "dairy free" },
      { name: "lacto ovo vegetarian" },
      { name: "vegan" },
      { name: "paleolithic" },
      { name: "pescatarian" },
    ];
    res.send(dat);*/
    //res.send(types);
  } catch (error) {
    console.log(error);
  }
});

/*
[ ] POST /recipe:
Recibe los datos recolectados desde el formulario controlado de la ruta de creación de recetas por body
Crea una receta en la base de datos
*/

/* */

router.post("/recipe", async (req, res, next) => {
  //traigo los datos de la ereceta que vienen por body
  const {
    title,
    summary,
    healthScore,
    instructions,
    image,
    diets,
    createdInDb,
  } = req.body;

  //Cargo una variable con los datos de la receta
  let recipeCreated = await Recipe.create({ //no le paso tipo de dieta porque se hace la relacion aparte
    title,
    summary,
    healthScore,
    instructions,
    image,
    createdInDb,
  });
  //Guarda las diestas de la API en la BDD
  diets.map((tipoDieta) => {
    TipoDeDieta.findOrCreate({ where: { name: tipoDieta } });
  });

  //traigo todas las  dietas de la BDD
  let dietaDb = await TipoDeDieta.findAll({ where: { name: dieta } });//dieta llega por body
  
  //entiendo quecarga en la tabla que une recetas con dietas, las dietas con su numero de receta que corresponde
  dietaDb.map((unaDietaDb) => {
    recipeCreated.addTipoDeDieta(unaDietaDb); //agregale tipo de dieta que coinciden con el nombre de dieta
  });

  res.send("receta cargada con exito");
});

module.exports = router;
