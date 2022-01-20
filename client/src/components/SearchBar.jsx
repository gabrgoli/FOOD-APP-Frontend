import React from 'react';
import { useState, useEffect } from 'react';
import { getTitleRecipes } from '../actions';
import { useDispatch,useSelector} from "react-redux"



export default function SearchBar (){
    const dispatch = useDispatch()
    const [name,setName]=useState("")
    const alerta = useSelector((state) => state.alerta)

    function handleInputChange (e){
        e.preventDefault()
        setName(e.target.value)
    }

    function handleSubmit(e){
      if(!name){
        e.preventDefault()
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
        <div>
            <input
                id='id1'
                type = 'text'
                placeholder = "Buscar...."
                onChange = {(e)=> handleInputChange(e)}
                />
                <button type='submit' onClick={(e)=> handleSubmit(e)}> Buscar </button>
        </div>
    )
}