import React from 'react';
//import { Link } from 'react-router-dom';
import styles from "../styles/Paginado.module.css"
import { Grid,CardMedia, Box, Typography, Divider } from '@mui/material'

export default function Paginado ({recipesPerPage,  allRecipes, paginado, currentPage}){
    const pageNumber = []
    
    for (let i=1;i<=Math.ceil(allRecipes/recipesPerPage); i++){
        pageNumber.push(i)
    }

    return(
        <Box  display='flex' flexDirection='row' justifyContent='center'>

                {pageNumber &&
                pageNumber.map(number => (
                        <Box display='flex' flexDirection='row'  className={currentPage===number?styles.barrasActivo:styles.barras} onClick = {()=> paginado (number)}>{number}</Box>       
                ))}
    
        </Box>
    )
}