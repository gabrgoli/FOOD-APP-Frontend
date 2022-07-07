import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import { getTitleRecipes } from '../actions';
import swal from 'sweetalert';
import { useDispatch } from 'react-redux';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';

const useAppDispatch = () => useDispatch();

export default function SearchPopUp({}) { //FUNCION PRINCIPAL

  const dispatch=useAppDispatch()
  const [postValue,SetPostValue]=React.useState({name:''})
/*
React.useEffect(()=>SetPostValue(()=>({
   //FORMATO DE ENVIO DE DATOS A LA BDD
  productId: product._id,
  productName:product.name,
  comment: '', //setea en "" a comment como default
  questionId:question?._id,
  answerId:'',
  userEmail: question?.userEmail,
})),[product,user])*/

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const sendName = async() => { //FUNCION QUE ENVIA EL POST PARA BUSCAR EN LA BDD
    if(postValue.name===""){return null}
    dispatch(getTitleRecipes(postValue.name))
    setOpen(false);    
  };

  return (
    <div>

        <Box display='flex' justifyContent='center'>
            <IconButton sx={{border:'3px solid rgb(1,40,83)'  , fontSize:'large', display:{xs:'flex',md:'none'}}} type='submit' onClick={handleClickOpen} >
                <SearchIcon  sx={{ color:'white', fontSize:'large'  }} >  </SearchIcon>
            </IconButton>
        </Box>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>'Realiza tu Búsqueda'</DialogTitle>
        <DialogContent>
          <DialogContentText>
          </DialogContentText>

          <TextField
            margin="dense"
            id="name"
            label="Nombre de receta"
            fullWidth
            variant="standard"
            height={300}
            onChange={(e)=>SetPostValue((old)=>({...old,name:e.target.value}))}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={sendName}>Buscar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}