import React from 'react';
//import { Link } from 'react-router-dom';
import styles from "../styles/Paginado.module.css"

export default function Paginado ({recipesPerPage,  allRecipes, paginado}){
    const pageNumber = []
    
    for (let i=1;i<=Math.ceil(allRecipes/recipesPerPage); i++){
        pageNumber.push(i)
    }

    return(
        <nav>
            <ul className={styles.barra}>
                {pageNumber &&
                pageNumber.map(number => (
                    <li key = {number}>
                        <a onClick = {()=> paginado (number)}>{number}</a>
                    </li>               
                ))}
            </ul>
        </nav>
    )
}