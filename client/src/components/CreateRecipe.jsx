import React, { useState, useEffect } from "react";
import { Link ,  useNavigate } from "react-router-dom"
import { postRecipe,getDiets } from "../actions"
import { useDispatch , useSelector } from "react-redux"
//import styles from "../Styles/CreateRecipe.module.css"
import '../styles/Buttons.css';
import NavBar from './NavBar'
import { Grid,CardMedia, Box, Typography, Divider } from '@mui/material'
import { TextField,Select,Container, UploadOulined,InputLabel, OutlinedInput, InputAdornment, MenuItem, Button, FormLabel, FormControlLabel } from '@mui/material';
import { useRef } from 'react';
import { UploadOutlined } from '@ant-design/icons';
//import { Navigation, Pagination, Scrollbar, A11y } from 'swiper'
//import { Swiper, SwiperSlide } from 'swiper/react'
//import 'swiper/css';
import swal from 'sweetalert';

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



    const fileInputRef=useRef(null)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const allDiets = useSelector((state) => state.dietTypes)
    const [errors, setErrors] = useState({}) //estado local para manejar errores
    const[images,setImages]=React.useState([]);//array de strings de url de imagenes 
    const[upLoading,setUpLoading]=React.useState(false) //estado que sirve para mostrar "cargando foto"
  
    const [post, setPost] = useState({
        title: "",
        summary: "",
        healthScore: 50,
        instructions: "",
        image:"",
        diets: []  
    })
    useEffect(() => {
        dispatch(getDiets())
    },[dispatch])



    const handleUploadPicture=  (e)=>{
      const pics = e.target.files;
      if (pics[0]===undefined)  return  0
  
      setUpLoading(true); //marcador de loading...
     
      for(const pic of pics){
        let formData=new FormData();
        formData.append('file',pic);
        formData.append('upload_preset','images');
         fetch('https://api.cloudinary.com/v1_1/dnlooxokf/upload',{
          method: 'POST',
          body: formData,
        })
          .then((res)=>res.json())
          .then((res)=> {
            setImages(images=>[...images,res.url]);
            setUpLoading(false);
          })
          .catch(error=>console.log(error));
        }
    };


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

    function handleSelectDiets(e){
        setPost({
            ...post,
            diets: [...post.diets, e.target.value] //guarda en un arreglo lo qe vaya seleccionando
        })

    }

    const handlePictureDelete=(e,image)=>{
        e.preventDefault()
        setImages(images.filter(element=>//deja afuera el elemento que tenga la url a eliminar
        element!==image
      ))
      }

    function handleDeleteDiet(e,deleteThis){
        e.preventDefault()
        setPost({
            ...post,
            diets: post.diets.filter(diet => diet !== deleteThis)
        })
    }

    function handleSubmit(e){
        console.log("el post",post)
        if(!post.title || !post.summary){
            e.preventDefault()
            return  swal({
                title:"Error",
                text:"La receta necesita un titulo y un resumen",
                icon:"error",
                button:"Aceptar"
              })
        } else if(!post.diets.length){
            e.preventDefault()
            return swal({
                title:"Error",
                text:"Necesitas agregar por lo menos 1 tipo de dieta a la receta",
                icon:"error",
                button:"Aceptar"
              })
        } 

            const newPost={...post,image:images[0]?images[0]:"https://res.cloudinary.com/dnlooxokf/image/upload/v1654057815/images/pzhs1ykafhvxlhabq2gt.jpg"}

            dispatch(postRecipe(newPost))
            swal({
                title:"Success",
                text:"The recipe was succesfuly created",
                icon:"succes",
                button:"Aceptar"
              })
            navigate("/home")
        
    }


    return(
        
    <Box display='fllex' justifyContent='center'  marginTop='250px'>
            <NavBar />
            
            <Box bgcolor='#F5C86A'  mb='100px' sx={{boxShadow:'rgba(0, 0, 0, 0.35) 0px 5px 15px;',display:'flex',justifyContent:'center',flexDirection:{xs:'column',md:'column'}, width:'70%',borderRadius:3,alignItems:'center',  border:'2px solid rgb(1,40,83)'}}>
            <h1 >CREA TU PROPIA RECETA</h1>
            <form >
                <Box >
                    <TextField id="formtitle2" label="Titulo" name='title' value={post.title} onChange={(e)=>handleChange(e)} ></TextField>
                    {errors.title && (<p >{errors.title}</p>)}
                </Box>
                <label ><h1>Resumen</h1></label>
                <Box>
                    <textarea rows="10" cols="30" type="text" label="Resumen" variant="outlined" name='summary' value={post.summary} onChange={(e)=>handleChange(e)} ></textarea>
                    {errors.summary && (<p >{errors.summary}</p>)}
                </Box>
                {/* <div >
                    <label >Puntuacion</label>
                    <input  type="range" min="0" max="100" value={post.puntuacion} name="puntuacion" onChange={(e) => handleChange(e)}></input>
                    {<p >{post.puntuacion}</p>}
                </div> */}
                <div >
                    <label ><h1>Puntaje de Salud</h1></label>
                    <input  type="range" min="0" max="100" value={post.healthScore} name="healthScore" onChange={(e) => handleChange(e)}></input>
                    {<h1 >{post.healthScore}</h1>}
                </div>
               
                    <label ><h1><Typography fontSize={25}>Preparacion</Typography></h1></label>
                <div >
                    <textarea rows="10" cols="30"  type="text" value={post.instructions} name="instructions" onChange={(e) => handleChange(e)}></textarea>
                    {errors.instructions && (<p >{errors.instructions}</p>)}
                </div>
                {/* <div >
                    <label >Cargar url de la imagen</label>
                    <input  type="url" value={post.image} name="image" onChange={(e) => handleChange(e)}></input>
                </div> */}

                 {/* BOTON CARGAR IMAGEN */}
                <Box sx={{display:'flex',flexDirection:'column',justifyContent:'center'}}>
                    <Button
                    color="secondary"
                    fullWidth
                    startIcon={ <UploadOutlined /> }
                    onClick={ () => fileInputRef.current?.click() }
                    >
                        Cargar imagen
                    </Button>
                </Box>

                        <input 
                        multiple
                        aria-label="Archivo" 
                        type="file" name="imagen" 
                        onChange={handleUploadPicture} 
                        ref={ fileInputRef }
                        style={{ display: 'none' }}
                        />



              {/*///////////////////////////////////////////// DONDE SE SUBE LA FOTO///////////////////////////////////////////// */}
              <Container display='flex' flexDirection='row' justifyContent='center' width={10}  >
                {images[0]?
                images.map(image=>(
                  <Container>
                      {/* <Link target="_blank" href={image}> */}
                      <CardMedia
                        
                        component="img"
                        height="250"
                        image={image}
                        alt="gf"
                        sx={{objectFit:'contain',  zIndex: 'modal' }}
                      />
                      {/* </Link> */}
                    
                      <Box display='flex' justifyContent='center' sx={{ zIndex: 'tooltip' }} onClick={(e)=>{handlePictureDelete(e,image)}}>
                        <Button  color = 'error' >Borrar</Button>
                      </Box>
                   </Container>
                )):<></>}
              </Container>
              {upLoading && <p>Subiendo Foto...</p> }


            {/*//////////////////////////////////////////////////// CANTIDAD DE FOTOS/////////////////////////////////////////// */}
            <Box sx={{display:'flex',flexDirection:'column',justifyContent:'center'}}>
              <Typography display='flex' justifyContent='center'>subiste {images.length} fotos</Typography>
            </Box>   

                {/*/////////////////////////////////////////////// MOSTRAR Y SELECCIONAR TIPOS DE DIETAS //////////////////////////////////////////////////////*/}        
                <div >
                    <select onChange={(e)=> handleSelectDiets(e)}>
                        <option value="all" hidden name="diets" >Selecciona tipo de dieta</option>
                            {allDiets?.map(diet => {
                            return ( <option value={diet.id} key={diet.id}>{diet.name[0].toUpperCase()+diet.name.substring(1)}</option>)
                            })
                            } 
                    </select>

                    {/*/////////////////////////////////////////////// ELIMINAR UNA DIETA //////////////////////////////////////////////////////*/}
                    <ul>
                            {post.diets.map(diet => 
                            <div >
                                <p>{diet}</p>
                                <button onClick={(e) => handleDeleteDiet(e,diet)}>x </button>
                            </div>
                            )}
                    </ul>
                </div>
                 {/*/////////////////////////////////////////////// BOTON DE CREAR RECETA //////////////////////////////////////////////////////*/}
                <Box mb='20px'>
                    <button  className="botonNavegar" type="submit" onClick={(e) => handleSubmit(e)}>Crear Receta</button>
                </Box>
            </form>
            </Box>
        </Box>
        
    )


}

//  <p>{allDiets?.find(element => element.id === diet)?.name}</p>