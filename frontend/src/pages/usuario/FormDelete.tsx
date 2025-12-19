import React, { useState, useEffect } from 'react'
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import IconButton from "@mui/material/IconButton";
import IconDelete from "@mui/icons-material/DeleteOutlineOutlined";
import Alert from "@mui/material/Alert";
import {
  dataUser,
  typeRolData,
  typeSucursalData,
  typeCreate,
} from "../../interfaces/usuario";
import { deleteService } from "../../service/index.service";
import { btnDefault } from '../../utils/styles/General';
interface IFormDeleteProps {
  usuario: dataUser,
  getList: () => void
}

const FormDelete: React.FC<IFormDeleteProps> = ({ usuario, getList }) => {
  const [open, setOpen] = useState(false);
  const [errorApi, setErrorApi] = useState<string>("");
  const [showMsgApi, setShowMsgApi] = useState<boolean>(false);

  const handleClose = () => {
    setOpen(!open);
  };

  const deleteUser = () => {
    deleteService("/usuario/delete/" + usuario.IDENTIFICADOR, {}).then(
      (result) => {
        setErrorApi(result.success ? "" : result.message);
        setShowMsgApi(!result.success);
        setOpen(!result.success);
        if (result.success) {
          getList();
        }
      }
    );
  };

  return (
    <>
      <label htmlFor="icon-delete">
        <IconButton
          aria-label="upload picture"
          component="span"
          onClick={() => {
            handleClose();
          }}
          style={btnDefault}
        >
          <IconDelete />
        </IconButton>
      </label>
      <Dialog open={open} keepMounted aria-describedby="alert-dialog-slide-description">
        <DialogTitle>{"¿Eliminar el registro?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Esta seguro de eliminar el Rol de: {usuario.NOMBRE}
            
          </DialogContentText>
          <Alert
              variant="outlined"
              severity="error"
              style={{ display: showMsgApi ? "block" : "none" }}
            >
              {errorApi}
            </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={() => deleteUser()}>Aceptar</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default FormDelete