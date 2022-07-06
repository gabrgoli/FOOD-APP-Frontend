import React from 'react';
import { useState,useEffect } from 'react';
import { useDispatch,useSelector } from 'react-redux';
import { getRecipes,filterCreated,getDiets ,filteredByDiet, orderByTitle,orderBySpoonacularScore} from '../actions';
import { Link } from 'react-router-dom';
import CardRecipe from './CardRecipe2';
import Paginado from './Paginado';
import SearchBar from './SearchBar';
import { Grid,CardMedia, Box, Typography, Divider } from '@mui/material'
import '../styles/Buttons.css';
import NavBar from '../components/NavBar'

//import styles from "../styles/Paginado.module.css"
console.log('url de ahora' ,window.location)
export default function Home(){

    const dispatch = useDispatch()
    const allRecipes = useSelector((State)=> State.recipes) //me trae del reducer el estado de recipes, que tiene todas las recetas
    const allDiets = useSelector((State) => State.diets)

    //PAGINADO
    const [currentPage,setCurrentPage]=useState(1) //creo un estado local en donde le paso la pagina actual
    const [recipesPerPage, setRecipesPerPage]=useState(28) //cantidad de recetas por pagina
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
        (allRecipes.length===0)&&dispatch(getRecipes());
        console.log("se hizo el dispatch")
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
            <NavBar />
            <Box marginTop='250px'/>
            <h1 marginTop='400px'>Busca tu receta favorita</h1>
            
            <button  className='botoninicio' onClick={e=>{handleClick(e)}}>
                Recargar
            </button>

            

            <div>
                <select className="select-css" onChange={(e) => handleSortedRecipesTitle(e)}>
                    <option value="" >Ordenar Alfabéticamente</option>
                    <option value='asc'>Ascendente</option> 
                    <option vale='desc'>Descendente</option>
                </select>
                <select className="select-css" onChange={e=>handleSortedRecipesSpoonScore(e)}>
                    <option value="" >Ordenar por Puntaje</option>
                    <option value="SpoonacularMax">Máximo</option>
                    <option value="SpoonacularMin">Mínimo</option>
                </select>  
                <select className="select-css" onChange={e=>handleFilterCreated(e)}>
                    <option value='All'>Ver Todas las Recetas o solo las creadas</option>
                    <option value='created'>Recetas Creaas</option>
                    <option value='api'>Todas las Recetas</option>
                </select>
                <select className="select-css"  onChange={e => handleFilteredDiet(e)}>
                    <option value="all">Filtrar por tipo de dieta</option>
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
                    currentPage={currentPage}
                    />

                <div >
                {console.log(currentRecipes)}

                <Grid container   sx={{display:{md:'flex'},justifyContent:{xs:'space-around',md:'flex-start'},mt:2}}> 
                {
                currentRecipes?.map(recipe => {
                    return (
     
                        <Grid key={recipe._id} md={3} sx={{display:'flex',justifyContent:'center'}}>          
                                <CardRecipe key={recipe.id} recipe={recipe}  diets={recipe.dieta} ></CardRecipe>
                        </Grid>
      
                        )
                    })
                }
                </Grid>
                
                </div>
             
                    <div  >
                        <Paginado recipesPerPage={recipesPerPage} allRecipes={allRecipes.length} paginado={paginado} currentPage={currentPage}></Paginado>
                    </div>  
             

            </div>
        </div>

    )
}