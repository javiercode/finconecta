import React from 'react'
import Typography from '@mui/material/Typography';
import { Alert, Button,   Snackbar } from '@mui/material';
import Slide, { SlideProps } from '@mui/material/Slide';

interface INotificationProps {
  mensaje:string,
  loading:boolean,
}

const Notification: React.FC<INotificationProps> = ({mensaje, loading }) => {
  const toastId = React.useRef(null);

  return (
    <>
      <Snackbar open={loading} autoHideDuration={10000}
      TransitionComponent={(props)=>(<Slide {...props} direction="left" />)}
      anchorOrigin={{ horizontal:'left',vertical:'bottom' }}
      >
        <Alert severity="warning" sx={{ width: '100%' }}>
          {mensaje}
        </Alert>
      </Snackbar>
    </>


  )
}


export default Notification;