import React from 'react';
//import { Link } from 'react-router-dom';
import styles from "../styles/Paginado.module.css"
import { Grid,CardMedia, Box, Typography, Divider } from '@mui/material'

export default function Paginado ({recipesPerPage,  allRecipes, paginado, currentPage}){
    const pageNumber = []
    const pageNumberMenor = []
    const pageNumberMAyor = []
    
    for (let i=1;i<=Math.ceil(allRecipes/recipesPerPage); i++){
        pageNumber.push(i)
        if(i<5){pageNumberMenor.push(i)}
        if(i>4){pageNumberMAyor.push(i)}
    }

    return(
        <>
            <Box  display='flex' flexDirection='row' justifyContent='center' sx={{display:{xs:'none',md:'flex'}}}>
                {pageNumber &&
                        pageNumber.map(number => (
                            <Box display='flex' flexDirection='row'  className={currentPage===number?styles.barrasActivo:styles.barras} onClick = {()=> paginado (number)}>{number}</Box>       
                        ))
                }
            </Box>
            <Box  display='flex' flexDirection='column' justifyContent='center' sx={{display:{xs:'flex',md:'none'}}}>
                {pageNumber &&
                    <Box display='flex' flexDirection='column' justifyContent='center'>
                            <Box display='flex' flexDirection='row' justifyContent='center'>
                            {pageNumberMenor.map(number => (
                                <Box className={currentPage===number?styles.barrasActivo:styles.barras} onClick = {()=> paginado (number)}>{number}</Box>       
                            ))}
                            </Box>

                            <Box display='flex' flexDirection='row' justifyContent='center'>
                            {pageNumberMAyor.map(number => (
                                <Box className={currentPage===number?styles.barrasActivo:styles.barras} onClick = {()=> paginado (number)}>{number}</Box>       
                            ))}
                            </Box>
                    </Box>
                }
            </Box>
        </>
    )
}