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
import IconsRecipes from './DietIcons.jsx'
import { Link } from 'react-router-dom';

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

export default function CardRecipe({  diets, recipe }) { //FUNCION PRINCIPAL
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const [colorHeart, setColorHeart] = React.useState ('black');
  const changeColor = () => { 
    if(colorHeart==="black"){setColorHeart("red")}
    else{ setColorHeart("black")} 
  }


  return (
    <Card sx={{ maxWidth: 345, backgroundColor:'#D3CBC9',  margin:'20px', boxShadow: 'rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px', border:'4px solid rgb(1,40,83)'  }}>
      <Link to = {'/recipe/'+recipe?.id}>
      <Box sx={{height:'60px',mb:'5px'}}>
      <Typography sx={{fontSize:{xs:15,md:20},m:2,ml:4}}>{recipe.title}</Typography>
      </Box>

      

      <CardMedia
        component="img"
        height="194"
        image={recipe?.image}
        alt="Food"
      />
      <Box display='flex' flexDirection='row' justifyContent='center' margin='8px'>{diets.map((diet)=>(<IconsRecipes title={diet.name}/>))}</Box>
      </Link>
      <CardContent>
        <Typography variant="body2" color="text.secondary">
            {recipe.summary.slice(0,250)}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton onClick={ changeColor } style={{color: colorHeart}} aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
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
          </Typography>
          <Typography paragraph>Method:</Typography>
          <Typography paragraph>
            {recipe.instructions}
          </Typography>
          <Typography paragraph>

          </Typography>

          <Typography>

          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}