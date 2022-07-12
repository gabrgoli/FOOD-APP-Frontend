import React from 'react'
import {Link} from 'react-router-dom'
import '../styles/Buttons.css';

export default function LandingPage(){

    console.log("api",process.env.URL_ORIGIN)
    return(
        <div>
            <h1> Bienvenidos a la aplicación de recetas de cocina </h1>
            <Link to = '/home'>
                <button className='botoninicio'>Inicio</button>
            </Link>
            <div style={{ 
            backgroundImage: `url("https://cdn.dribbble.com/users/6191/screenshots/1816613/media/7cbb657541208e9c1f70a48d24e334df.gif")`, 
            height:'100vh',
            marginTop:'-200px',
            fontSize:'10px',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            
            }}>
                
            </div>


        
        </div>
    )
}