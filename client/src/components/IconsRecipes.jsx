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

export default function IconsRecipes (title){
    console.log("title",title)
    let imagen='gluten-free.svg';
    
    (title==={title: 'gluten free'})&&(imagen='gluten-free.svg')
    (title==='dairy-free')&&(imagen='dairy-free.svg')
    (title==='lacto ovo vegetarian')&&(imagen='vegetarian.svg')
    (title==='healthy')&&(imagen='healthy.svg')
    (title==='4rr4r4')&&(imagen='vegan.png')
    (title==='Pescatarian')&&(imagen='vegan.png')

    return(
        <Box  display='flex' flexDirection='row' alignItems='center' >
            
            <CardMedia
                component="img"
                height="25"
                image={imagen}
                alt="gf"
                sx={{objectFit:'contain'}}
            />   
        </Box>
    )
}