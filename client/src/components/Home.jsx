import React from 'react';
import { useState,useEffect } from 'react';
import { useDispatch,useSelector } from 'react-redux';
import { getRecipes,filterCreated,getDiets ,filteredByDiet, orderByTitle,orderBySpoonacularScore} from '../actions';
import { Link } from 'react-router-dom';
import Card from './Card';
import Paginado from './Paginado';
import SearchBar from './SearchBar';
//import styles from "../styles/Paginado.module.css"

export default function Home(){

    const dispatch = useDispatch()
    const allRecipes = useSelector((State)=> State.recipes) //me trae del reducer el estado de recipes, que tiene todas las recetas
    const allDiets = useSelector((State) => State.diets)

    //PAGINADO
    const [currentPage,setCurrentPage]=useState(1) //creo un estado local en donde le paso la pagina actual
    const [recipesPerPage, setRecipesPerPage]=useState(9) //cantidad de recetas por pagina
    const indexOfLastRecipe = currentPage * recipesPerPage //porque si estoy en la pagina 3, el ultimo recipe va a ser 6*3=18
    const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage //da el index de la primera receta
    const currentRecipes = allRecipes.slice(indexOfFirstRecipe,indexOfLastRecipe) //va mostrando cuantos recipes hay que rednerizar por pagina


        // estados locales para renderizar los globales
        const [aux,forzarRenderizado] = useState("") //estado local que arranca vacio
        const [score,setScore] = useState("")

    const paginado = (pageNumber)=> {
        setCurrentPage(pageNumber)
    }

    useEffect(()=>{
        dispatch(getRecipes());
    },[dispatch])

    useEffect(() => {
        dispatch(getDiets())
    },[dispatch])

    function handleClick(e){
        e.preventDefault();
        dispatch(getRecipes());
    }


    function handleFilterCreated(e){
        dispatch(filterCreated(e.target.value))
    }

    function handleFilteredDiet(e){
        dispatch(filteredByDiet(e.target.value))
        setCurrentPage(1)
        e.preventDefault()
    }

    function handleSortedRecipesSpoonScore(e){
        dispatch(orderBySpoonacularScore(e.target.value))
        setCurrentPage(1)
        setScore(e.target.value)
        e.preventDefault()
    }

    function handleSortedRecipesTitle(e){
        e.preventDefault();
        dispatch(orderByTitle(e.target.value))
        setCurrentPage(1);//setea la pagina principal
        forzarRenderizado(e.target.value) //renderiza modificando el estado local, ordenado de tal forma, solo hace la modificacion en el renderizado
        //setorder('Ordenado ${e.target.value}')

        //guarda el valor d el criterio actual, max min o all, y verifica si hubo un cambio de valor y compara con el estado actual, si es diferente renderiza
    }

    return(//se pasan los values iguales a la API
        <div>
            <Link to = '/recipe'>Crear Receta</Link>
            <h1>aguante las recetas loco</h1>

            <button onClick={e=>{handleClick(e)}}>
                volver a cargar las recetas
            </button>

            <div>
                <select onChange={(e) => handleSortedRecipesTitle(e)}>
                    <option value="" >Select Order</option>
                    <option value='asc'>Ascendente</option> 
                    <option vale='desc'>Descendente</option>
                </select>
                <select onChange={e=>handleSortedRecipesSpoonScore(e)}>
                    <option value="" >Select Score</option>
                    <option value="SpoonacularMax">Max Spoonacular Score</option>
                    <option value="SpoonacularMin">Min Spoonacular Score</option>
                </select>  
                <select onChange={e=>handleFilterCreated(e)}>
                    <option value='All'>Todos</option>
                    <option value='created'>Creados</option>
                    <option value='api'>Existente</option>
                </select>
                <select  onChange={e => handleFilteredDiet(e)}>
                    <option value="all">Seleccionar Dietas</option>
                    {allDiets?.map(diet => {
                        return ( <option value={diet.name}>{diet.name}</option>)
                    })
                }
                </select>


                <Paginado
                key={paginado}
                recipesPerPage={recipesPerPage}
                allRecipes={allRecipes.length}
                paginado = {paginado}
                />

                <SearchBar
                />

                <div >
                {console.log(currentRecipes)}
                {
                
                currentRecipes?.map(recipe => {
                    return (
                        <Link to = {'/recipe/'+recipe.id}>
                        <Card image={recipe.imagen} title={recipe.title} diets={recipe.dieta.map(r => <p>{r.name}</p>)} key={recipe.id} score={recipe.puntuacion} ></Card>
                        </Link>
                        )
                    })
                }
                
                </div>

                <div  >
                <Paginado recipesPerPage={recipesPerPage} allRecipes={allRecipes.length} paginado={paginado}></Paginado>
                </div>  
            </div>
        </div>

    )
}