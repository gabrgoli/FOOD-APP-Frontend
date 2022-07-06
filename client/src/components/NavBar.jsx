import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import SearchBar from './SearchBar';
import { Link } from 'react-router-dom';
import '../styles/Buttons.css';

export default function PrimarySearchAppBar() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = 'primary-search-account-menu';

  const mobileMenuId = 'primary-search-account-menu-mobile';

  return (
    <Box sx={{ zIndex: 'tooltip'}} position="fixed" width='100%' >
      <AppBar sx={{bgcolor:'#4661A8'}} >
        <Box display='flex'  flexDirection='row'  alignItems='center'>
            <Box width='100%' display='flex' justifyContent='center'>
                <Link to="/home" ><h1 contenteditable data-heading="Piece of Cake">Foods app</h1></Link>
            </Box>
            <Box width='100%'>
                <SearchBar/>
            </Box>
    
            <Box width='100%' sx={{display:'flex',justifyContent:'right',alignItems:'center'}} >
                {window.location.pathname==='/home' ?
                <Link to = '/recipe'><button className='botoninicio'>Crear Receta</button></Link>
                :   
                <Link to="/home" > <button className='botoninicio' >Home</button></Link>}
            </Box>
        </Box>
      </AppBar>
    </Box>
  );
}