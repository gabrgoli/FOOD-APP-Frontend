import * as React from 'react';
import { getRecipes} from '../actions';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import SearchBar from './SearchBar';
import { Link } from 'react-router-dom';
import '../styles/Buttons.css';
import { useDispatch } from 'react-redux';
import Typography from '@mui/material/Typography';

export default function PrimarySearchAppBar() {
  
  const dispatch = useDispatch()

  return (
    <Box sx={{ zIndex: 'tooltip'}} position="fixed" width='100%' >
      <AppBar sx={{bgcolor:'#4661A8'}} >
        <Box display='flex'  flexDirection='row'  alignItems='center'>
            
            <Box width='100%' display='flex' justifyContent='left' marginLeft='30px'>
                <Link to="/home" ><h1 onClick={()=>dispatch(getRecipes())}><Typography sx={{fontSize:{xs:30,md:50}}}>Foods app</Typography></h1></Link>
            </Box>
            
            <Box width='100%' display='flex' justifyContent='center'>
                <SearchBar/>
            </Box>
    
            <Box  >
                {window.location.pathname==='/home'?
                <Link to = '/recipe'><button className='botonNavegar' >Crear Receta</button></Link>
                :   
                <Link to="/home" > <button className='botonNavegar'>Home</button></Link>}
            </Box>

        </Box>
      </AppBar>
    </Box>
  );
}