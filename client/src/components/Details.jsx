import React from "react";
import { Link , useParams} from "react-router-dom"
import { useDispatch , useSelector } from "react-redux"
import DietIcons from "./IconDiet.jsx";
import { useEffect , useState} from "react";
import { getDetail } from "../actions";
//import styles from "../Styles/DetailRecipe.module.css"
import { Box, Typography } from '@mui/material'
import '../styles/Buttons.css';
import NavBar from '../components/NavBar'
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import swal from 'sweetalert';
import Loading from '../components/Loading'

export default function DetailRecipe(){ //FUNCION PRINCIPAL
    const dispatch = useDispatch()
    const recipeId = useParams()
    const detailRecipe = useSelector((state) => state.detail) //traigo del reducer
    const [loaded,setLoaded]=React.useState(false)
    const [colorHeart, setColorHeart] = React.useState ('black');

    useEffect(() => {
        dispatch(getDetail(recipeId.id)).then(()=>setLoaded(true))// recipe.Id accedo al id de la url
    },[dispatch])

    const changeColor = () => { 
        if(colorHeart==="black"){setColorHeart("red")}
        else{ setColorHeart("black")} 
      }

  // PARA NO REPETIR LAS DIETAS 
    let arrayDietsNoRepeat=[]

    detailRecipe.diets?.forEach((diet) =>{
        if (!arrayDietsNoRepeat.includes(diet.name)) {
        arrayDietsNoRepeat.push(diet.name);
        }
    }
    );

console.log(detailRecipe);
// console.log("url de ahora",window.location.pathname);
// console.log(recipeId.id);
 console.log("detailRecipe",detailRecipe);
    return (
        <>
            {/* {((!detailRecipe)&&(window.location.pathname!==(`/recipe/${detailRecipe.id}`)))?
                    <div >
                        <h1 >Loading ...</h1>
                    </div> 
                : */}
            
                <Box display='fllex' justifyContent='center' width='100%'>
                    <NavBar />
                    {loaded?
                        <Box marginTop='200px' mb='100px' sx={{boxShadow:'rgba(0, 0, 0, 0.35) 0px 5px 15px;',display:'flex',justifyContent:'center',flexDirection:{xs:'column',md:'column'}, width:'70%',borderRadius:3,alignItems:'center'}}>
                            <h1 >{detailRecipe?.title}</h1> 
                            <img objectFit='contain' width = "100%"  src={detailRecipe?.image} alt="la imagen no se encuentra"/>
                            
                                <Box display='flex' justifyContent='right' width='100%'>
                                <IconButton  onClick={ changeColor } style={{color: colorHeart}}>
                                <FavoriteIcon fontSize='small'/>
                                </IconButton> 

                                <IconButton aria-label="share" onClick={() => {navigator.clipboard.writeText(`${window.location.origin}/recipe/${detailRecipe.id}`);swal({
                                title:"URL copiado",
                                text:"Se copio la dirección de la Receta en el portapapeles",
                                icon:"success",
                                button:"Aceptar"
                                }) }}>
                                <ShareIcon />
                                </IconButton>
                                </Box>
                            
                            <Typography variant='h3'>Types of Diets:</Typography>
                            <Box display='flex' flexDirection='row' justifyContent='center'>{arrayDietsNoRepeat?.map((diet)=>(<DietIcons title={diet}/>))}</Box>
                            <Typography variant='h3'>{detailRecipe.ingredients && 'Ingredients:'}</Typography>
                            {detailRecipe.ingredients?.map((ingredient)=>{
                               return <Typography variant='h5'>{`${ ingredient.name[0].toUpperCase()}${ingredient.name.substring(1)} `}</Typography>
                            })}
                               
                            <Typography variant='h3'>Summary:</Typography>
                            <Typography variant='h5'>{detailRecipe?.summary}</Typography>                         
                            {/* <h3 >Puntuacion</h3>
                            <p >{detailRecipe?.puntuacion}</p> */}
                            <Typography variant='h3' >Health Score</Typography>
                            <h2><span class="blue">{detailRecipe?.healthScore}</span></h2>

                            <Typography variant='h3' >Instructions</Typography>
                            {detailRecipe.instructions.map((instruction)=>(
                                <Typography variant='h5'>{instruction}</Typography>
                            ))
                        }
                        </Box>
                    :
                    <Loading/>}
                </Box>
                    
            
        </>
    )

}