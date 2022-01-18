import React from "react";
//import styles from "../Styles/SingleCard.module.css"


export default function Card({ image , title , diets,score }){

    return (
        <div >
            <div>
                <h3 >{title}</h3>
                <img src={image} width = "350px" height="250px" alt="la imagen no se encuentra "/>
              
                <h5 >{diets}</h5>
                {score}
                
            </div>
        </div>
    )
}