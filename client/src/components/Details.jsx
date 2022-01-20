import React from "react";
import { Link , useParams} from "react-router-dom"
import { useDispatch , useSelector } from "react-redux"
import { useEffect , useState} from "react";
import { getDetail } from "../actions";
//import styles from "../Styles/DetailRecipe.module.css"


export default function DetailRecipe(){
    
    const dispatch = useDispatch()
    const recipeId = useParams()
    const detailRecipe = useSelector((state) => state.detail) //traigo del reducer

    useEffect(() => {
        dispatch(getDetail(recipeId.id))// recipe.Id accedo al id del detalle
    },[dispatch])
//console.log(detailRecipe);

    return (
        <div >
            <div>
            {
                ((!detailRecipe)||(detailRecipe.length === 0)) ? 
                    <div >
                        <p >Loading ...</p>
                    </div> 
                :
                    <div >
                        <h1 >Titulo: </h1>
                        <p >{detailRecipe.title}</p> 
                        <h1 >Imagen: </h1>
                        <img width = "350px" height="250px" src={detailRecipe.imagen} alt="la imagen no se encuentra"/>
                        
                        <h3 >Resumen:</h3>
                        <p >{detailRecipe.resumen}</p>                         
                        <h3 >Puntuacion</h3>
                        <p >{detailRecipe.puntuacion}</p>
                        <h3 >Nivel</h3>
                        <p >{detailRecipe.nivel}</p>
                        <h3 >Tipo de Dietas</h3>
                        <p >{detailRecipe.dieta?.map(r => (<li >{r.name} </li>))}</p>
                        <h3 >Instrucciones</h3>
                        <p >{detailRecipe.pasoApaso}</p>
                    </div>
                    
                
            }
            </div>
            <div >
                <Link to="/home">
                    <button >Go back!</button>
                </Link>
            </div>
        </div>
    )

}