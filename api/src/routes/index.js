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
    `https://api.spoonacular.com/recipes/complexSearch?number=500&offset=100&addRecipeInformation=true&diet&apiKey=${API_KEY}`
  );
  const apiUrl2 = await axios.get(
    `https://api.spoonacular.com/recipes/complexSearch?number=500&offset=2&addRecipeInformation=true&diet&apiKey=${API_KEY}`
  );

  let apiUrl3=apiUrl.data.results.concat(apiUrl2.data.results)

  const apiInfo = await apiUrl3.map((el) => {
    return {
      id: el.id,
      title: el.title,
      resumen: el.summary.replace(/<[^>]*>?/g, ""),
      //puntuacion: el.spoonacularScore,
      nivel: el.healthScore,
      pasoApaso: el.analyzedInstructions[0]?.steps.map((each) => {
        return each.step.concat({number:each.number, step:each.step})
      }),
      imagen: el.image,
      dieta: el.diets.map((e) => ({ name: e })),
      //pasoApaso: el.analyzedInstructions.map(el=>el===steps),
      createdInDb:false
    };



  });
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
      imagen: recipe.imagen,
      resumen: recipe.resumen,
      //puntuacion: recipe.puntuacion,
      nivel: recipe.nivel,
      //dieta: recipe.TipoDeDieta,
      dieta: recipe.TipoDeDieta,
      pasoApaso: recipe.instructions,
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
      imagen: detail.image,
      resumen: detail.summary.replace(/<[^>]*>?/g, ""),
      //puntuacion: detail.spoonacularScore,
      nivel: detail.healthScore,
      dieta: detail.diets.map((diet) => ({ name: diet })),
      pasoApaso: detail.instructions.replace(/<[^>]*>?/g, ""),
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
      imagen: recipe.imagen,
      resumen: recipe.resumen,
     // puntuacion: recipe.puntuacion,
      nivel: recipe.nivel,
      dieta: recipe.TipoDeDieta,
      pasoApaso: recipe.instructions,
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
    /*recipeTotal?.map((recipe) => {
      Recipe.findOrCreate({ where: { 
        title: recipe?.title,
        resumen: recipe.resumen,
        //nivel: toString(recipe.nivel)        
      //  pasoApaso: recipe.pasoApaso,
        //imagen: recipe?.imagen
       // createdInDb: false
      } });
    });*/

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
    const dat = await getApiInfo();
    const types_arrays = dat.map((e) => e.dieta);

    types_arrays.forEach((e) =>
      e.forEach((e) => {
        if (!types.includes(e.name)) {
          types.push(e.name);
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
    resumen,
    puntuacion,
    nivel,
    pasoApaso,
    imagen,
    dieta,
    createdInDb,
  } = req.body;

  //Cargo una variable con los datos de la receta
  let recipeCreated = await Recipe.create({ //no le paso tipo de dieta porque se hace la relacion aparte
    title,
    resumen,
    puntuacion,
    nivel,
    pasoApaso,
    imagen,
    createdInDb,
  });
  //Guarda las diestas de la API en la BDD
  dieta.map((tipoDieta) => {
    TipoDeDieta.findOrCreate({ where: { name: tipoDieta } });
  });

  //traigo todas las  dietas de la BDD
  let dietaDb = await TipoDeDieta.findAll({ where: { name: dieta } });//dieta llega por body
  
  dietaDb.map((unaDietaDb) => {
    recipeCreated.addTipoDeDieta(unaDietaDb); //agregale tipo de dieta que coinciden con el nombre de dieta
  });

  res.send("receta cargada con exito");
});

module.exports = router;



/*
[ ] GET /types:
Obtener todos los tipos de dieta posibles
En una primera instancia, cuando no exista ninguno, deberán precargar la base de datos con los tipos de datos indicados por spoonacular acá
*/
/*
router.get('/types', async(req,res)=>{
    let recipeTotal = await getAllRecipes();//traigo todas las recetas
    let arrayDietas = []
    let defaultDiet= [
        "gluten free",
        "ketogenic",
        "vegetarian",
        "lacto vegetarian",
        "ovo vegetarian",
        "vegan",
        "pescetarian",
        "paleo",
        "primal",
        "low fodmap",
        "whole30",]

    recipeTotal.forEach(el=>{
        el.diets.forEach(el=>{
            if(!arrayDietas.includes(el)){
                arrayDietas.push(el)
            }
        })
    })

    arrayDietas.length?
    arrayDietas.map(el=>{
        TipoDeDieta.create({name:el})
    })
    :defaultDiet.map(el=>{
        TipoDeDieta.create({name:el})
    })

return arrayDietas
})
*/
/*
router.get('/types', async (req, res)=>{
    try 
    {

        const recetas = await getApiInfo();

        //const types = ['vegetarian', 'vegan', 'glutenFree'];

        const types = recetas.data.results.map(e=>{
            e.diets
        })
        types.forEach(e => {
            TipoDeDieta.findOrCreate({
                where: {name : e}
            })
        });
        const allresults = await TipoDeDieta.findAll({
            attributes : ["name"]
        });
        res.send(allresults.map(e=>e.name)) 
    }
    catch(e){
        console.log(e)
    }
    
})

*/
/*
router.get('/types', async (req, res)=>{
    try {
        const types = ['main course','side dish','dessert','appetizer','salad','bread','breakfast','soup',
                        'beverage','sauce','marinade','fingerfood','snack','drink'];
        types.forEach(e => {
            Type.findOrCreate({
                where: {name : e}
            })
        });
        const allresults = await Type.findAll({
            attributes : ["name"]
        });
        res.send(allresults.map(e=>e.name)) 
    }
    catch(e){
        console.log(e)
    }
});

*/

/*router.get('/recipes/:idReceta', async (req, res)=>{ //aca llegan  por parametro
    const {idReceta} = req.params
    let recipeTotal = await getAllRecipes();//traigo todas las recetas
    let recipeId = recipeTotal.find(el=>el.id===parseInt(idReceta))
    recipeId?
    res.status(200).json({resumen:recipeId.resumen,dieta:recipeId.dieta}):
    res.status(404).send('no esta la receta, sory men');
})

*/

/*
const getDbInfo = async ()=> {
    return await Recipe.findAll({
        include:{
            model: TipoDeDieta, //ademas de las recetas traeme este modelo
            attributes: ['name'], //de este modelo, tipo de dieta traeme este atributo
            through:{
                atrributes: [],
            },
        }
    })
}

*/
