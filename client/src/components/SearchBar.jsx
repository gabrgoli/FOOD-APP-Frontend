import React from 'react';
import { useState, useEffect } from 'react';
import { getTitleRecipes } from '../actions';
import { useDispatch,useSelector} from "react-redux"
import '../styles/SearchBar.module.css';
import '../styles/Buttons.css';
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';


export default function SearchBar (){
    const dispatch = useDispatch()
    const [name,setName]=useState("")
    const alerta = useSelector((state) => state.alerta)

    function handleInputChange (e){
        e.preventDefault()
        setName(e.target.value)
    }

    function handleSubmit(e){
        e.preventDefault();
      if(!name){
        return alert("el nombre no puede ser vacio")
      }


      /*recetas.find(el=>el===name)
      ?alert("hola")
      :alert("chau")*/
        
       /* if(!recetaencontrada){
            e.preventDefault()
            return alert("no se encuentra la receta")
        }else{dispatch(getTitleRecipes(name))}*/
        
        
        dispatch(getTitleRecipes(name))
        document.getElementById('id1').value='' ; 
        document.getElementById('id1').placeholder='Buscar....' ;

    }

    return(
        <Box className='SearchBar' display='flex' flexDirection='row' alignItems='center' justifyContent='center'>
            {/* <form> */}
            <input
                id='id1'
                type = 'text'
                placeholder = "Buscar...."
                onChange = {(e)=> handleInputChange(e)}
                >
            
            </input>
            {/* </form> */}
            <div>
            <IconButton sx={{border:'3px solid rgb(1,40,83)'  , fontSize:'large'}} >
                <SearchIcon  sx={{ color:'white', fontSize:'large'}} type='submit' onClick={(e)=> handleSubmit(e)}>  </SearchIcon>
            </IconButton>
                
            </div>
        </Box>
    )
}