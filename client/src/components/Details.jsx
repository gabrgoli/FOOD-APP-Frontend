import React from "react";
import { Link , useParams} from "react-router-dom"
import { useDispatch , useSelector } from "react-redux"
import { useEffect , useState} from "react";
import { getDetail } from "../actions";
//import styles from "../Styles/DetailRecipe.module.css"
import { Grid,CardMedia, Box, Typography, Divider } from '@mui/material'
import '../styles/Buttons.css';
import NavBar from '../components/NavBar'

export default function DetailRecipe(){
    
    const dispatch = useDispatch()
    const recipeId = useParams()
    const detailRecipe = useSelector((state) => state.detail) //traigo del reducer

    useEffect(() => {
        dispatch(getDetail(recipeId.id))// recipe.Id accedo al id de la url
    },[dispatch])

//console.log(detailRecipe);
console.log("url de ahora",window.location.pathname);
console.log(recipeId.id);
console.log(detailRecipe);
    return (
        <div>
            {((!detailRecipe)&&(window.location.pathname!==(`/recipe/${recipeId.id}`)))?
                    <div >
                        <h1 >Loading ...</h1>
                    </div> 
                :
                    
                    <Box display='fllex' justifyContent='center'>
                        <NavBar />
                        <Box marginTop='200px' mb='100px' sx={{boxShadow:'rgba(0, 0, 0, 0.35) 0px 5px 15px;',display:'flex',justifyContent:'center',flexDirection:{xs:'column',md:'column'}, width:'70%',borderRadius:3,alignItems:'center'}}>
                        <h1 >{detailRecipe?.title}</h1> 
                        <img objectFit='contain' width = "700px"  src={detailRecipe?.imagen} alt="la imagen no se encuentra"/>
                        <Box display='flex' flexDirection='row'>
                          {detailRecipe?.dieta?.map(r => (<Box display='flex' flexDirection='row' >{' -'+r.name[0].toUpperCase()+r.name.substring(1)} </Box>))}
                        </Box>
                        <h3 >Resumen:</h3>
                        <p >{detailRecipe?.resumen}</p>                         
                        {/* <h3 >Puntuacion</h3>
                        <p >{detailRecipe?.puntuacion}</p> */}
                        <h3 >Puntaje de Salud</h3>
                        <p >{detailRecipe?.nivel}</p>     
                        <h3 >Instrucciones</h3>
                        <p >{detailRecipe?.pasoApaso}</p>
                        </Box>
                    </Box>
                    
                
            }
        </div>
    )

}