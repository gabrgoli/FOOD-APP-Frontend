const initialState = {
  recipes: [],
  allRecipes: [],
  typeOfDiets: [],
};

function rootReducer(state = initialState, action) {
  switch (action.type) {
    case "GET_RECIPES":
      return {
        ...state,
        recipes: action.payload,
        allRecipes: action.payload, //llena 2 estados con todos los personajes
      };

    case "FILTER_CREATED": //muestra los creados por mi o los existentes en la base de datos
      const createdFilter =
        action.payload === "created"
          ? state.allRecipes.filter((el) => el.createdInDb)
          : state.allRecipes.filter((el) => !el.createdInDb);
      return {
        ...state,
        recipes: action.payload === "All" ? state.allRecipes : createdFilter,
      };
    case "FILTERED_BY_DIETS":
      const allRecipes = state.allRecipes;
      const dietFiltered =
        action.payload === "all"
          ? allRecipes
          : allRecipes.filter((el) => 

           el.dieta.includes(action.apyload)||
           el.dieta.map((e)=> e.name).includes(action.payload)   
             /*
              let diet = recipe.diets.map((d) => d.name);
              if (diet.includes(action.payload)) {
                return allRecipes;
              }*/

            );
      return {
        ...state,
        recipes: dietFiltered,
      };
    case "SEARCH_RECIPE":
      return {
        ...state,
        recipes: action.payload,
      };

    case "POST_RECIPE":
      return {
        ...state,
      };
    case "ORDER_BY_SPOONACULAR_SCORE":
      const sortedRecipesSpoonScore =
        action.payload === "SpoonacularMax"
          ? state.allRecipes.sort(function (a, b) {
              if (a.puntuacion < b.puntuacion) {
                return 1;
              }
              if (b.puntuacion < a.puntuacion) {
                return -1;
              }
              return 0;
            })
          : state.allRecipes.sort(function (a, b) {
              if (a.puntuacion < b.puntuacion) {
                return -1;
              }
              if (b.puntuacion < a.puntuacion) {
                return 1;
              }
              return 0;
            });
      return {
        ...state,
        allRecipes: sortedRecipesSpoonScore,
      };
    case "GET_DIETS_TYPES":
      return {
        ...state,
        diets: action.payload,
        //allRecipes: action.payload,
      };
    case "GET_DETAIL":
      return {
        ...state,
        detail: action.payload,
      };
    case "ORDER_BY_TITLE":
      const sortedRecipesTitle =
        action.payload === "asc"
          ? state.allRecipes.sort(function (a, b) {
              if (a.title.toLowerCase() > b.title.toLowerCase()) {
                return 1;
              }
              if (b.title.toLowerCase() > a.title.toLowerCase()) {
                return -1;
              }
              return 0;
            })
          : state.allRecipes.sort(function (a, b) {
              if (a.title.toLowerCase() > b.title.toLowerCase()) {
                return -1;
              }
              if (b.title.toLowerCase() > a.title.toLowerCase()) {
                return 1;
              }
              return 0;
            });
      return {
        ...state,
        allRecipes: sortedRecipesTitle,
      };
    default:
      return state;
  }
}

export default rootReducer;



    /*case "FILTER_BY_STATUS":
      const allRecipes = state.allRecipes;
      const statusFiltered =
        action.payload === "All"
          ? allRecipes
          : allRecipes.filter((el) => el.status === action.payload);
      return {
        ...state,
        recipes: statusFiltered, //solo modifica este estado
      };*/