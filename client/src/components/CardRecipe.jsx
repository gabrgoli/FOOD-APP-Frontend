
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


export default function CardRecipe({ image , title , diets,score, recipeId }){
  const [colorHeart, setColorHeart] = React.useState ('black');
  
  const changeColor = () => { 
    if(colorHeart==="black"){setColorHeart("red")}
    else{ setColorHeart("black")} 
  }

    return (


<div class="card" >
        <Card sx={{ backgroundColor:'#D3CBC9', width: 300, height: 550, margin:'20px', boxShadow: 'rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px', border:'4px solid rgb(1,40,83)' }}>
        <Link to = {'/recipe/'+recipeId}>

            <CardMedia
              component="img"
              height="200"
              image={image}
              alt=""
              sx={{objectFit:'contain',marginTop:'10px', }}

            />
            <Typography fontSize='20px'>{title}</Typography>
          </Link>
            <CardContent>
            <Typography >{score}</Typography>
                <Typography >{diets}</Typography>
                
            </CardContent>
         <CardActions sx={{justifyContent:'flex-end'}}>
          <IconButton   onClick={ changeColor } style={{color: colorHeart}}>
            <FavoriteIcon />
          </IconButton>
        </CardActions> 
      </Card>
      </div>
    )
}