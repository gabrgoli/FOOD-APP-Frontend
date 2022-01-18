import axios from "axios";

export function getRecipes() {
  return async function (dispatch) {
    var json = await axios.get("http://localhost:3001/recipes"); //LA RUTA QUE ME CREE EN EL BACK que trae todas la recetas
    return dispatch({
      type: "GET_RECIPES",
      payload: json.data,
    });
  };
}
export function orderBySpoonacularScore(payload) {
  return {
    type: "ORDER_BY_SPOONACULAR_SCORE",
    payload,
  };
}
export function getDiets() {
  return async function (dispatch) {
    // try {
    var json = await axios.get("http://localhost:3001/types");
    return dispatch({
      type: "GET_DIETS_TYPES",
      payload: json.data,
    });
    // } catch (error) {
    //     console.log(error)
    // }
  };
}

export function filteredByDiet(payload) {
  // el payload en este caso significa el value="..." que yo le mande desde el componente, osea el nombre de la dieta
  return {
    type: "FILTERED_BY_DIETS",
    payload,
  };
}

export function filterRecipeByStatus(payload) {
  //el payload recibe el value de las opciones
  return {
    type: "FILTER_BY_VALUE",
    payload,
  };
}

export function filterCreated(payload) {
  return {
    type: "FILTER_CREATED",
    payload,
  };
}

export function orderByTitle(payload) {
  return {
    type: "ORDER_BY_TITLE",
    payload,
  };
}

export function getTitleRecipes(name) {
  //buscar receta por nombre
  return async function (dispatch) {
    try {
      var json = await axios.get(`http://localhost:3001/recipes?name=${name}`);
      return dispatch({
        type: "SEARCH_RECIPE",
        payload: json.data, //el json.data es lo que devuelve la ruta
      });
    } catch (error) {
      console.log(error);
    }
  };
}

export function postRecipe(payload) {
  return async function (dispatch) {
    //este dispatch no lo use, ver que pasa si lo borro
    try {
      console.log(payload);
      var json = await axios.post(`http://localhost:3001/recipe`, payload);
      return json;
    } catch (error) {
      console.log(error);
    }
  };
}

export function getDetail(id) {
  return async function (dispatch) {
    try {
      var json = await axios.get(`http://localhost:3001/recipes/${id}`);
      return dispatch({
        type: "GET_DETAIL",
        payload: json.data,
      });
    } catch (error) {
      console.log(error);
    }
  };
}