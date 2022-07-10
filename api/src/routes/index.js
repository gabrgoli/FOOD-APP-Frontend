const { Router } = require("express");
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const axios = require("axios");
//const TipoDeDieta = require('../models/TipoDeDieta');
const { Recipe, TipoDeDieta, Ingredient } = require("../db");
const { API_KEY } = process.env;
const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

let trabajarConAPI=false;
let guardarApiEnBDD=false;

const getInstructions = (recipe) =>{
  let texto=''
    recipe.analyzedInstructions[0]?.steps.map((e)=>{
      texto=`${texto} Step ${e.number}) ${e.step}`
    })   
    return texto                                                                          
}

const getIngredients = (recipe) =>{
  let ingredientes=[]
    recipe.analyzedInstructions[0]?.steps.map((step)=>{
      step.ingredients.map((ingredient)=>{
        ingredientes.push(ingredient.name)
      })
    })   
    return ingredientes                                                                          
}

//FUNCION QUE GUARDA LOS DATOS EN LA BDD, RECIBE UN ARRAY DE RECETAS QUE VIENEN DE LA API
const saveDataFromApiInBDD = (recipesInApi) =>{
    // GUARDAR DATOS DE LA API EN LA BASE DE DATOS
    recipesInApi?.map(async(recipe) => {
      let [recipeCreated,booleanCreated] = await Recipe.findOrCreate({ where: { 
        title: recipe?.title,
        summary: recipe?.summary,
        healthScore: recipe?.healthScore ,       
        instructions: recipe?.instructions,
        image: recipe?.image,
        //diets: recipe?.diets,
        //ingredients: recipe?.ingredients
      }});
     // GUARDA TODAS LAS DIETAS QUE VIENEN EN LA FUNCION getAllRecipes
     recipe?.dietsParaBDD.map((tipoDieta) => {
      TipoDeDieta.findOrCreate({ where: { name: tipoDieta } });
    });
    //traigo todas las  dietas de la BDD
    let dietsDb = await TipoDeDieta.findAll({ where: { name: recipe.dietsParaBDD } });//
    //entiendo quecarga en la tabla que une recetas con dietas, las dietas con su numero de receta que corresponde
    dietsDb.map((dietaDb) => {
      recipeCreated.addTipoDeDieta(dietaDb); //agregale tipo de dieta que coinciden con el nombre de dieta
    });
  
  
    // GUARDA LOS INGREDIENTES QUE VIENEN POR PARAMETRO EN LA BDD
    recipe?.ingredients.map((ingredient) => {
      Ingredient.findOrCreate({ where: { name: ingredient } });
    });
    
    let ingredientsDb = await Ingredient.findAll({ where: { name: recipe.ingredients } });//traigo todos los ingredientes de la BDD
    
    ingredientsDb.map((ingredientDb) => {
      recipeCreated.addIngredient(ingredientDb); //CREA LA RELACION ENTRE TABLA INGREDIENTES Y RECETAS
    });

  }); 
}

//TRAE DATOS DE LA API Y LOS GUARDA EN LA BASE DE EDATOS
const getApiInfo = async () => {
  const apiUrl = await axios.get(
    `https://api.spoonacular.com/recipes/complexSearch?number=500&offset=102&addRecipeInformation=true&diet&apiKey=${API_KEY}`
  );
  const apiUrl2 = await axios.get(
    `https://api.spoonacular.com/recipes/complexSearch?number=500&offset=2&addRecipeInformation=true&diet&apiKey=${API_KEY}`
  );

  let apiUrl3=apiUrl.data.results.concat(apiUrl2.data.results)
  const apiInfo = await apiUrl3.map((el) => {
    //const apiInfo = await apiUrl.data.results.map((el) => {
    
    return {
      id: el.id,
      title: el?.title,
      summary: el.summary.replace(/<[^>]*>?/g, ""),
      healthScore: el.healthScore,
      instructions: getInstructions(el),
      ingredients: getIngredients(el),
      image: el.image,
      diets: el.diets.map((diet) => ({ name: diet })),
      dietsParaBDD:el.diets.map((diet) => (diet)),
    };
  } );
  //console.log("dietsParaBDD",apiInfo[4].dietsParaBDD) //dietsParaBDD [ 'gluten free', 'dairy free', 'fodmap friendly', 'pescatarian' ]
  guardarApiEnBDD && saveDataFromApiInBDD(apiInfo);
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

  const recipes2 = await Recipe.findAll({
    include: {
      model: Ingredient,
      attributes: ["name"],
      through: {
        attributes: [],
      },
    },
  });
let returnRecipes=[]

  recipes.map((recipe) => {
    recipes2.map((recipe2)=>{
      if(recipe2.id===recipe.id){
        returnRecipes.push({
          id: recipe.id,
          title: recipe.title,
          image: recipe.image,
          summary: recipe.summary,
          healthScore: recipe.healthScore,
          diets: recipe.TipoDeDieta,
          ingredients:recipe2.Ingredients,
          instructions: recipe.instructions,
        });
      }
    })
  });

  return returnRecipes;
};

const getAllRecipes = async () => {
  const apiInfo = trabajarConAPI ?await getApiInfo():null;
  const dbInfo = await getDataBaseInfo();
  const infoTotal = trabajarConAPI ? apiInfo.concat(dbInfo):dbInfo;

  // FUNCION QUE ELIMINAR LOS ELEMNTOS REPETIDOS
  let arrayRecipesNoRepeatElement = infoTotal.filter((recipe,index)=>{
    return infoTotal.indexOf(recipe) === index;
})
  return arrayRecipesNoRepeatElement;

};

// BUSCA UNA RECETA POR ID EN LA API
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
      ingredients: getIngredients(detail),
      healthScore: detail.healthScore,
      diets: detail.diets.map((diet) => ({ name: diet })),
      instructions: detail.instructions.replace(/<[^>]*>?/g, ""),
    };
  } catch {
    return undefined;
  }
};

//BUSCA UNA RECETA POR EL ID EN LA BDD
const searchByIdAtDB = async (id) => {
  try {
    
    const recipe2 = await Recipe.findByPk(id, {
      include: {
        model: Ingredient,
        attributes: ["name"],
        through: {
          attributes: [],
        }, 
      },
    });
    
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
      id: recipe2.id,
      title: recipe2.title,
      image: recipe2.image,
      summary: recipe2.summary,
      healthScore: recipe2.healthScore,
      diets: recipe.TipoDeDieta,
      ingredients:recipe2?.Ingredients,
      instructions: recipe2.instructions,
    };

  } catch {
    return undefined;
  }
};

//BUSCA UNA RECETA EN LA API Y BDD SEGUN EL ID
const searchById = async (id) => {
  const apiRecipeProm = trabajarConAPI? searchByIdAtApi(id) : '';
  const dbRecipeProm = searchByIdAtDB(id);

  const [apiRecipe, dbRecipe] = await Promise.all([
    apiRecipeProm,
    dbRecipeProm,
  ]); 

  return apiRecipe || dbRecipe;
};

// RUTA QUE BUSCA RECETA SEGUN EL QUERY, O TRAE TODAS LAS RECETAS SI ES QUE NO VIENE QUERY
router.get("/recipes", async (req, res) => {
 
  const name = req.query.name;  //GUARDA EN VARIABLE name LO QUE VIENE POR QUERY
  let allRecipes = await getAllRecipes();// TRAE TODAS LAS RECETAS
  if (name) { //SI VIENE name POR QUERY REALIZA UN FILTRO DE LAS RECETAS PARA BUSCAR RECETAS CON NOMBRE QUE INCLUYAN A name
    let recipeName = await allRecipes.filter((el) =>el.title.toLowerCase().includes(name.toLowerCase())); 
    recipeName.length? //SI SE ENCONTRO ALGO, DEVUELVE EL RESULTADO DEL FILTRADO
      res.status(200).send(recipeName)
    :
      res.status(404).send("no esta la receta"); // SI NO SE ENCONTRO RECETA QUE INCLUYA AL NOMBRE name, ENTONCES NO ENCONTRO LA RECETA
  } else { // SI NO SE RECIBE NADA POR QUERY ENTONCES
    res.status(200).send(allRecipes); // DEVUELVE TODAS LAS RECETAS
  }
});


// RUTA QUE TRAE UNA RECETA SEGUN EL ID 
router.get("/recipes/:idReceta", async (req, res, next) => {
  try {
    const id = req.params.idReceta;
    const recipeById = await searchById(id);
    if (!recipeById) {
      return res.status(404).send("Recipe by Id doesn´t exist");
    }
    res.status(200).send(recipeById);
  } catch (error) {
    next(error);
  }
});


// RUTA QUE TRAE TODOS LOS TIPOS DE DIETA SIN REPETIR
router.get("/types", async (req, res) => {
  try {
    const types = [];
    //const recipesApi = await getApiInfo();
    const recipesApi = await getAllRecipes();
    const dietsApi = recipesApi.map((recipe) => recipe?.diets);

    //GUARDA EN EL ARRAY TYPES TODOS LOS TIPOS DE DIETA QUE HAY EN LA API, PERO SIN REPETIR
    dietsApi?.forEach((diet) =>
    diet?.forEach((diet) => {
        if (!types.includes(diet.name)) {
          types.push(diet.name);
        }
      })
    );

    //GUARDA LAS DIETAS EN LA BDD QUE VIENEN DE LA API SIN REPETIR
    types.forEach((e) => {
      TipoDeDieta.findOrCreate({
        //where: { name: e[0].toUpperCase()+e.substring(1) },
        where: { name: e }
      });
    });

    //TRAE TODOS LOS TIPOS DE DIETAS DE LA BASE DE DATOS
    const allresults = await TipoDeDieta.findAll({
      attributes: ["name"],
    });

    // DEVUELVE TODAS LAS DIETAS, CON UN ARRAY DE OBJETOS
    res.send(
      allresults.map((e) => {
        return { name: e.name };
      })
    );
  } catch (error) {
    console.log(error);
  }
});

// RUTA QUE TRAE TODOS LOS INGREDIENTES SIN REPETIR
router.get("/ingredients", async (req, res) => {
  try {
    const ingredients = [];
    const recipes = await getAllRecipes();
    const ingredientsApi = recipes.map((recipe) => recipe.ingredients);
    //GUARDA EN EL ARRAY ingredients TODOS LOS INGREDIENTES QUE HAY EN LA API, PERO SIN REPETIR
    ingredientsApi.forEach((ingredient) =>
    ingredient.forEach((ingredient) => {
        if (!ingredients.includes(ingredient.name)) {
          ingredients.push(ingredient.name);
        }
      })
    );
    ingredients.forEach((e) => {
      Ingredient.findOrCreate({
        //where: { name: e[0].toUpperCase()+e.substring(1) },
        where: { name: e }
      });
    });
    const allresults = await Ingredient.findAll({
      attributes: ["name"],
    });

    res.send(
      allresults.map((e) => {
        return { name: e.name };
      })
    );
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

// RUTA PARA CREAR UNA RECETA 
router.post("/recipe", async (req, res, next) => {
  // TRAE TODOS LOS DATOS QUE VIENEN POR POST
  const {
    title,
    summary,
    healthScore,
    instructions,
    image,
    diets,
    ingredients,
  } = req.body;


  //console.log("que llega por diets",diets) // que llega por diets [ 'Vegan', 'Primal', 'Paleolithic' ]

  // GUARDO LA RECETA EN LA BDD
  let recipeCreated = await Recipe.create({ //no le paso tipo de dieta porque se hace la relacion aparte
    title,
    summary,
    healthScore,
    instructions,
    image,
  });

  diets.map((tipoDieta) => {
    TipoDeDieta.findOrCreate({ where: { name: tipoDieta } });  // GUARDA TODAS LAS DIETAS QUE VIENEN POR BODY EN LA BDD
  });
  //traigo todas las  dietas de la BDD
  let dietsDb = await TipoDeDieta.findAll({ where: { name: diets } });//diets llega por body

  dietsDb.map((dietaDb) => {
    recipeCreated.addTipoDeDieta(dietaDb); //CREA LA RELACION ENTRE TABLAS RECETA Y DIETAS
  });

  ingredients.map((ingredient) => {
    ingredient.findOrCreate({ where: { name: ingredient } });  // GUARDA LOS INGREDIENTES QUE VIENEN POR PARAMETRO EN LA BDD
  });
  
  let ingredientsDb = await Ingredient.findAll({ where: { name: ingredients } });//TREA TODOS LOS INGREDIENTES DE LA BASE DE DATOS

  ingredientsDb.map((ingredientDb) => {
    recipeCreated.addIngredient(ingredientDb); //CREA LA RELACION  ENTRE TABLAS RECETAS E INGREDIENTES
  });

  res.send("receta cargada con exito");
});

module.exports = router;
