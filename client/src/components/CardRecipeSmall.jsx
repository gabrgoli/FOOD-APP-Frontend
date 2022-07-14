
import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
//import Collapse from '@mui/material/Collapse';
//import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
//import { red } from '@mui/material/colors';
 import FavoriteIcon from '@mui/icons-material/Favorite';
 import { Link } from 'react-router-dom';
 import { Grid, Box, Divider, Tooltip } from '@mui/material'
import DietIcons from './IconDiet'
import { useNavigate } from 'react-router-dom';
import ShareIcon from '@mui/icons-material/Share';
import swal from 'sweetalert';
import IconDiet from './IconDiet.jsx'
import { favorite } from '../actions';
import { useDispatch } from 'react-redux';

export default function CardRecipe({ recipe }){

  const dispatch=useDispatch()
  const navigate=useNavigate()


  ////////////////////////////////////// FAVORITOS START ///////////////////
  const [recipeState, setRecipeState] = React.useState()
  // CARGO LOS VALORES DE recipe EN EL ESTADO recipeState
  React.useEffect(()=>setRecipeState(()=>(recipe)),[recipe])

  const changeColor =  () => { 
      let newPost
      if(recipeState.favorite===false){
          newPost={...recipeState,favorite:true}
          setRecipeState(()=>({...recipeState,favorite:true}))
          dispatch(favorite(newPost));
      }
      else{ 
          newPost={...recipeState,favorite:false}
          setRecipeState(()=>({...recipeState,favorite:false}))
          dispatch(favorite(newPost));
      } 
  }
//__________________________________FAVORITOS END ___________________//

// PARA NO REPETIR LAS DIETAS 
let arrayDietsNoRepeat=[]

  recipe.diets?.forEach((diet) =>{
      if (!arrayDietsNoRepeat.includes(diet.name)) {
        arrayDietsNoRepeat.push(diet.name);
      }
    }
  );

  return (
    < >
      <Box sx={{display:'flex',flexDirection:'row',bgcolor:'#D3CBC9',width:'100%',height:'40vw',marginY:2,boxShadow:'rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;', border:'1px solid rgb(1,40,83)'}}> 
      
          <Box sx={{width:'50%vw'}}>
          <Typography sx={{fontSize:'2vw',display:'flex',position:"absolute"}}><span class="blueSmall" >{recipe?.healthScore}</span></Typography>
              <CardMedia
                component="img"
                height='100%'
                width='100%'
                image={recipe.image}
                alt="gf"
                sx={{objectFit:'cover'}}
                onClick={()=>{navigate(`/recipe/${recipe.id}`)}}>
              </CardMedia>
              
             
          </Box >
          <Box sx={{display:'flex',flexDirection:'column',width:'100%'}}>
              <Box sx={{width:'100%',height:'100%'}}>
                    <Box sx={{alignItems:'flex-start',mt:1,ml:1}}>
                      <Link to = {'/recipe/'+recipe.id}>
                          <Typography variant='h2' sx={{fontSize:'4.5vw',maxHeight:50, color:'black'}}>{recipe.title.slice(0,100)}</Typography>
                      </Link>
                    </Box>
              </Box>  

              <Box  sx={{width:'100%',display:'flex',flexDirection:'row'}}>   
                    <IconButton>
                        {arrayDietsNoRepeat.map((diet)=>(<IconDiet title={diet}/>))}
                    </IconButton>
                    <Box display='flex' justifyContent='right' width='100%'>
                      
                      <IconButton  onClick={ changeColor } style={{color: recipeState?.favorite?'red':'black'}}>
                        <FavoriteIcon fontSize='small'/>
                      </IconButton> 

                      <IconButton 
                      aria-label="share" 
                      style={{color: 'black'}}
                      onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/recipe/${recipe.id}`);
                        swal({title:"URL copiado",text:"Se copio la dirección de la Receta en el portapapeles", icon:"success",button:"Aceptar"}) 
                      }}>
                          <ShareIcon />
                      </IconButton>
                    </Box>
              </Box> 
          </Box>
      </Box>
    </>
  )
}