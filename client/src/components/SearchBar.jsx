import React from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { getTitleRecipes } from '../actions';


export default function SearchBar (){
    const dispatch = useDispatch()
    const [name,setName]=useState("")

    function handleInputChange (e){
        e.preventDefault()
        setName(e.target.value)
    }

    function handleSubmit(e){
        e.preventDefault()
        dispatch(getTitleRecipes(name))
        setName("")
    }

    return(
        <div>
            <input
                type = 'text'
                placeholder = "Buscar...."
                onChange = {(e)=> handleInputChange(e)}
                />
                <button type='submit' onClick={(e)=> handleSubmit(e)}> Buscar </button>
        </div>
    )
}