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
        <>
            {/* PANTALLA GRANDE */}
            <Box  display='flex' flexDirection='row' justifyContent='center' sx={{display:{xs:'none',md:'flex'}}}>
                {pageNumber &&
                        pageNumber.map(number => (
                            <Box display='flex' flexDirection='row'  className={currentPage===number?styles.barrasActivo:styles.barras} onClick = {()=> paginado (number)}>{number}</Box>       
                        ))
                }
            </Box>

            {/* PANTALLA CHICA */}
                 <Grid container spacing={1}  sx={{display:{xs:'flex',md:'none'},justifyContent:{xs:'flex-start',md:'none'},mt:2}}> 
                 {pageNumber &&
                        pageNumber.map(number => (
                            <Grid    xs={3} sx={{display:{xs:'flex',md:'none'},justifyContent:'center'}}>   
                                <Box display='flex' flexDirection='row'  className={currentPage===number?styles.barrasActivo:styles.barras} onClick = {()=> paginado (number)}>{number}</Box>       
                            </Grid>
                        ))
                }
                 </Grid>
                    
        </>
    )
}