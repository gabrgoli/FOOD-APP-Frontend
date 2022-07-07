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

export default function SearchBar (){
    const dispatch = useDispatch()
    const [name,setName]=useState("")
    const alerta = useSelector((state) => state.alerta)
    const location=useLocation()
    const navigate=useNavigate()

    function handleInputChange (e){
        e.preventDefault()
        setName(e.target.value)
    }

    /*function handleSubmit(e){
        e.preventDefault();
      if(!name){
        return alert("el nombre no puede ser vacio")
      }
           
        dispatch(getTitleRecipes(name))
        if(location!=='/home')navigate('/home')
        document.getElementById('id1').value='' ; 
        document.getElementById('id1').placeholder='Buscar....' ;

    }*/

    function openSearch(e){
        console.log("hola pedro")

    }

    //   console.log("pantalla",document.documentElement.scrollWidth)
    return(
        <Box 
            component="form"
            className='SearchBar' 
            display='flex' flexDirection='row' 
            alignItems='center' 
            justifyContent='center'
            onSubmit={(e) => {
                e.preventDefault()
                dispatch(getTitleRecipes(name))
                navigate(`/home`)
              }}
        >
            {/* <form> */}
            <Box sx={{display:{xs:'none',md:'flex'}}}  >   
                <input
                    
                    id='id1'
                    type = 'text'
                    placeholder = "Buscar...."
                    onChange = {(e)=> handleInputChange(e)}
                    
                    >
                </input>
            </Box>
            {/* </form> */}
            <div>
            <IconButton sx={{border:'3px solid rgb(1,40,83)'  , fontSize:'large' ,display:{xs:'none',md:'flex'}}} type='submit'  >
                <SearchIcon  sx={{ color:'white', fontSize:'large',display:{xs:'none',md:'flex'} }} >  </SearchIcon>
            </IconButton>
            <IconButton sx={{border:'3px solid rgb(1,40,83)'  , fontSize:'large', display:{xs:'flex',md:'none'}}} type='submit'  >
                <SearchIcon  sx={{ color:'white', fontSize:'large' ,display:{xs:'flex',md:'none'} }} >  </SearchIcon>
            </IconButton>
            </div>
        </Box>
    )
}