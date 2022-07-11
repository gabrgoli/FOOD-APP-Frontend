import * as React from 'react'
import { Box, Typography } from '@mui/material'


const Loading=()=>{
    return(
        <>
        <Box sx={{mt:20,display:'flex',alignItems:'center',flexDirection:'column'}}>
            <div className="lds-dual-ring"></div>
            <Typography sx={{m:3,fontWeight:20,fontSize:20}}>Procesando...</Typography>
        </Box>
        </>
    )
}

export default Loading