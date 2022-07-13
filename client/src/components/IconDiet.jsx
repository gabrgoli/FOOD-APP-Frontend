import React from 'react';
import Box from '@mui/material/Box';
import CardMedia from '@mui/material/CardMedia';
import Tooltip from '@mui/material/Tooltip';
import { Typography } from '@mui/material';

export default function IconsDiets ({title, size}){
    console.log("title:",title)
    let imagen='../gluten-free.svg';
    if(title==='lacto ovo vegetarian'){(imagen='../vegetarian.svg')}
    if(title==='primal'){(imagen='../primal.svg')}
    if(title==='vegan'){(imagen='../vegan.svg')}
    if(title==='gluten free'){(imagen='../gluten-free.svg')}
    if(title==='ketogenic'){(imagen='../keto.png')}
    if(title==='dairy free'){(imagen='../dairy-free.svg')}
    if(title==='paleolithic'){(imagen='../protein.svg')}
    if(title==='pescatarian'){(imagen='../pescetarian.svg')}
    if(title==='fodmap friendly'){(imagen='../whole30.png')}
    if(title==='whole 30'){(imagen='../whole30.png')}

    return(
        <Box display='flex' flexDirection='column'>
            <Box >
                <Tooltip title={title[0].toUpperCase()+title.substring(1)}>
                <CardMedia
                    component="img"
                    height={window.location.pathname==='/home'?"20":"85"}
                    image={imagen}
                    alt={imagen}
                    sx={{objectFit:'contain'}}
                /> 
                </Tooltip>
            </Box>
            <Box>
                <Typography  sx={{display:{xs:'none'},fontSize:{xs:10}}}>{title}</Typography>  
            </Box>
        </Box>
    )
}