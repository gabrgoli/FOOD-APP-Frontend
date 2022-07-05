import React, { useState, useEffect } from "react";
import { Link ,  useNavigate } from "react-router-dom"
import { postRecipe } from "../actions"
import { useDispatch , useSelector } from "react-redux"
//import styles from "../Styles/CreateRecipe.module.css"
import '../styles/Buttons.css';

function validate(post){
    let errors = {}
    if (!post.title){ //si no hay nada
        errors.title = "Tu receta necesita un titulo"
    } else if (!post.summary){ //si no hay nada
        errors.summary = "Brinda una pequeña descripcion de tu receta"
    } else if (!post.instructions){ //si no hay nada
        errors.instructions = "No te olvides de contar como la preparaste"
    }
    return errors
}

    
export default function RecipeCreate(){
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const allDiets = useSelector((state) => state.diets)
   
    const [errors, setErrors] = useState({}) //estado local para manejar errores

    const [post, setPost] = useState({
        title: "",
        summary: "",
        spoonacularScore: 50,
        healthScore: 50,
        instructions: "",
        image: "",
        diets: []  
    })

    function handleChange(e){
        setPost({ //a mendida que escribo setea y va guardando
            ...post,
            [e.target.name]: e.target.value //va llenando el estado post a medida que va modificando
        })
        setErrors(validate({
            ...post,
            [e.target.name]: e.target.value
        }))
    }

    function handleSelect(e){
        setPost({
            ...post,
            diets: [...post.diets, e.target.value] //guarda en un arreglo lo qe vaya seleccionando
        })

    }

    function handleDietDelete(deleteThis){
        setPost({
            ...post,
            diets: post.diets.filter(diet => diet !== deleteThis)
        })
    }

    function handleSubmit(e){
        if(!post.title || !post.summary){
            e.preventDefault()
            return alert("La receta necesita un titulo y un resumen")
        } else if(!post.diets.length){
            e.preventDefault()
            return alert("Necesitas agregar por lo menos 1 tipo de dieta a la receta")
        } else {
            if (!post.image) {
                post.image = "https://cdn.pixabay.com/photo/2016/12/26/17/28/spaghetti-1932466_960_720.jpg"
            }
            const newPost={
                title: post.title,
                resumen: post.summary,
                puntuacion: post.healthScore,
                nivel: post.spoonacularScore,
                pasoApaso: post.instructions,
                imagen: post.image,
                dieta: post.diets
            }
            dispatch(postRecipe(newPost))
            alert("Se creo la receta exitosamente!")
            /*setPost({
                title: "",
                summary: "",
                spoonacularScore: 50,
                healthScore: 50,
                instructions: "",
                image: "",
                diets: []
            })*/
            navigate("/home")
        }
    }


    return(
        <div >
            <Link to="/home" >
                <button >Home</button>
            </Link>
            <h1 >CREA TU PROPIA RECETA</h1>
            <form >
                <div >
                    <label >Title</label>
                    <input  type="text" value={post.title} name="title" onChange={(e) => handleChange(e)} ></input>
                    {errors.title && (<p >{errors.title}</p>)}
                </div>
                <div >
                    <label >Resumen</label>
                    <textarea  type="text" value={post.summary} name="summary" maxLength="1000" onChange={(e) => handleChange(e)}></textarea>
                    {errors.summary && (<p >{errors.summary}</p>)}
                </div>
                <div >
                    <label >Puntuacion</label>
                    <input  type="range" min="0" max="100" value={post.spoonacularScore} name="spoonacularScore" onChange={(e) => handleChange(e)}></input>
                    {<p >{post.spoonacularScore}</p>}
                </div>
                <div >
                    <label >Nivel</label>
                    <input  type="range" min="0" max="100" value={post.healthScore} name="healthScore" onChange={(e) => handleChange(e)}></input>
                    {<p >{post.healthScore}</p>}
                </div>
                <div >
                    <label >Paso a paso</label>
                    <textarea  type="text" value={post.instructions} name="instructions" onChange={(e) => handleChange(e)}></textarea>
                    {errors.instructions && (<p >{errors.instructions}</p>)}
                </div>
                <div >
                    <label >Cargar url de la imagen</label>
                    <input  type="url" value={post.image} name="image" onChange={(e) => handleChange(e)}></input>
                </div>
                <div >
                    <select onChange={(e)=> handleSelect(e)}>
                        <option value="all" hidden name="diets" >Selecciona tipo de dieta</option>
                            {allDiets?.map(diet => {
                            return ( <option value={diet.id} key={diet.id}>{diet.name}</option>)
                            })
                            } 
                    </select>
                    <ul>
                        <li>                            
                            {post.diets.map(diet => 
                            <div >
                                <p>{diet}</p>
                                <button onClick={() => handleDietDelete(diet)}>x </button>
                            </div>
                            )}
                        </li>
                    </ul>
                </div>
                <button  type="submit" onClick={(e) => handleSubmit(e)}>Crear Receta</button>
            </form>
        </div>
    )


}

//  <p>{allDiets?.find(element => element.id === diet)?.name}</p>