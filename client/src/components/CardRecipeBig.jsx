import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Grid, Box, Divider, Tooltip } from '@mui/material'
import IconDiet from './IconDiet.jsx'
import { Link } from 'react-router-dom';
import swal from 'sweetalert';
import { favorite } from '../actions';

// ESTA FUNCION VIENE CON MUI MATERIAL DEBIDO A LA CARD ESPECIAL QUE SE DESPLIEGA
const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function CardRecipe({  recipe }) { //FUNCION PRINCIPAL
  const [expanded, setExpanded] = React.useState(false);
  

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const [colorHeart, setColorHeart] = React.useState (recipe.favorite?'red':'black');
 
  let changeColor = () => { 

    if(colorHeart==="black"){setColorHeart("red")}
    else{ setColorHeart("black")} 
  }

// PARA NO REPETIR LAS DIETAS 
let arrayDietsNoRepeat=[]

  recipe.diets?.forEach((diet) =>{
      if (!arrayDietsNoRepeat.includes(diet.name)) {
        arrayDietsNoRepeat.push(diet.name);
      }
    }
  );


  return (
    <div className='Card'>
    <Card sx={{ maxWidth: 345, backgroundColor:'#D3CBC9',  margin:'20px', boxShadow: 'rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px', border:'4px solid rgb(1,40,83)'  }}>
      <Link to = {'/recipe/'+recipe?.id}>
      <Tooltip title={recipe.title} placement="top" > 
      <Box sx={{height:'60px',mb:'15px'}}>
        <Typography variant='h2' sx={{fontSize:30,m:2,ml:4}}>{recipe.title.slice(0,30)}</Typography>
      </Box>
      </Tooltip>
      <CardMedia
        component="img"
        height="194"
        image={recipe?.image}
        alt="Food"
      />
      <Box display='flex' flexDirection='row' justifyContent='center' margin='8px'>{arrayDietsNoRepeat.map((diet)=>(<IconDiet title={diet}/>))}</Box>
      </Link>
      <CardContent>
        <Typography variant="h6" color="text.secondary">
            {recipe.summary.slice(0,250)}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton onClick={ changeColor } style={{color: colorHeart}} aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton  
          style={{color: 'black'}} 
          aria-label="share" 
          onClick={() => {
            navigator.clipboard.writeText(`${window.location.origin}/recipe/${recipe.id}`);
            swal({title:"URL copiado",text:"Se copio la dirección de la Receta en el portapapeles",icon:"success",button:"Aceptar"}) 
          }}>
          <ShareIcon />
        </IconButton>
        <Tooltip title={'Health Score'}>
            <h2><span class="blue">{recipe?.healthScore}</span></h2>
        </Tooltip>
        
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
        <Typography paragraph>
            <h3 >Ingredients:</h3>
            {recipe?.ingredients?.map((ingredient)=>{
                return <>{`${ ingredient?.name[0].toUpperCase()}${ingredient?.name.substring(1)} `}</>
            })}
          </Typography>

          <Typography paragraph>
          <h3 >Instructions:</h3>
            {recipe.instructions}
          </Typography>
          <Typography paragraph>

          </Typography>

          <Typography>

          </Typography>
        </CardContent>
      </Collapse>
    </Card>
    </div>
  );
}