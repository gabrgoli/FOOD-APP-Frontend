import React from 'react';
import { useState, useEffect } from 'react';
import { getTitleRecipes } from '../actions';
import { useDispatch,useSelector} from "react-redux"
import '../styles/SearchBar.module.css';
import '../styles/Buttons.css';
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import {useLocation, useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Tooltip from '@mui/material/Tooltip';

export default function IconsRecipes ({title}){
    console.log("title:",title)
    let imagen='gluten-free.svg';
    if(title==='lacto ovo vegetarian'){(imagen='vegetarian.svg')}
    if(title==='primal'){(imagen='primal.svg')}
    if(title==='vegan'){(imagen='vegan.svg')}
    if(title==='gluten free'){(imagen='gluten-free.svg')}
    if(title==='ketogenic'){(imagen='keto.png')}
    if(title==='dairy free'){(imagen='dairy-free.svg')}
    if(title==='paleolithic'){(imagen='protein.svg')}
    if(title==='whole 30'){(imagen='whole30.png')}

    return(
        <Box  display='flex' flexDirection='row' alignItems='center'margin='3px' >
            <Tooltip title={title}>
            <CardMedia
                component="img"
                height="25"
                image={imagen}
                alt="gf"
                sx={{objectFit:'contain'}}
            />   
            </Tooltip>
        </Box>
    )
}