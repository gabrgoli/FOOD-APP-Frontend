import React from 'react';
import Box from '@mui/material/Box';
import CardMedia from '@mui/material/CardMedia';
import Tooltip from '@mui/material/Tooltip';

export default function IconsRecipes ({title}){
    console.log("title:",title)
    let imagen='../gluten-free.svg';
    if(title==='lacto ovo vegetarian'){(imagen='../vegetarian.svg')}
    if(title==='primal'){(imagen='../primal.svg')}
    if(title==='vegan'){(imagen='../vegan.svg')}
    if(title==='gluten free'){(imagen='../gluten-free.svg')}
    if(title==='ketogenic'){(imagen='../keto.png')}
    if(title==='dairy free'){(imagen='../dairy-free.svg')}
    if(title==='paleolithic'){(imagen='../protein.svg')}
    if(title==='whole 30'){(imagen='../whole30.png')}

    return(
        <Box margin='3px'>
            <Tooltip title={title}>
            <CardMedia
                component="img"
                height="25"
                image={imagen}
                alt={imagen}
                sx={{objectFit:'contain'}}
            />   
            </Tooltip>
        </Box>
    )
}