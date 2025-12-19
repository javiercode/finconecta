import React from 'react'
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import IconCreate from "@mui/icons-material/AddCircleOutlineOutlined";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import IconEdit from "@mui/icons-material/ModeEditOutlineOutlined";
import {
    putService,
  } from "../../service/index.service";
  import {
    dataUser,
    typeRolData,
    typeSucursalData,
    typeCreate,
  } from "../../interfaces/usuario";
import { btnDefault } from '../../utils/styles/General';

  interface IFormEditProps {
    usuario: dataUser,
    sucursalList: typeSucursalData[],
    rolList:typeRolData[],
    getList: () => void}

const FormUpdate: React.FC<IFormEditProps> = ({usuario,sucursalList, rolList, getList}) => {

    const [open, setOpen] = React.useState(false);
    const [textErrorUser, setTextErrorUser] = React.useState<string>("");
    const [errorApi, setErrorApi] = React.useState<string>("");
    const [showMsgApi, setShowMsgApi] = React.useState<boolean>(false);
    const [createDto, setCreateDto] = React.useState<typeCreate>({
        codRolAplicacion: 0,
        clave: "",
        sucursal: 0,
    });
    const [codSucursal, setCodSucursal] = React.useState<number>(usuario.SUCURSAL);
    const [codRol, setCodRol] = React.useState<number>(usuario.COD_ROL);

    const updateUser = () => {
        createDto.clave = usuario.CLAVE;
        createDto.sucursal = codSucursal;
        createDto.codRolAplicacion = codRol;
        
        if (createDto.codRolAplicacion !== 0 && createDto.sucursal !== 0) {
            putService("/usuario/edit/"+usuario.IDENTIFICADOR, createDto).then((result) => {
                setErrorApi(result.success ? "" : result.message);
                setShowMsgApi(!result.success);
                setOpen(!result.success);
                if (result.success) {
                    getList();
                }
            });
        } else {
            setErrorApi("Completar el formulario, porfavor.");
            setShowMsgApi(true);
        }
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const onChangeSucursal = (event: any) => {
        const { name, value } = event.target;
        setCodSucursal(value);
        createDto.sucursal = value;
    };

    const onChangeRol = (event: any) => {
        const { name, value } = event.target;
        setCodRol(value);
        createDto.codRolAplicacion = value;
    };

    const handleClose = () => {
        setOpen(false);
      };

    return (
        <>
            <label htmlFor="icon-delete">
                <IconButton
                    aria-label="upload picture"
                    component="span"
                    onClick={handleClickOpen}
                    style={btnDefault}
                >
                    <IconEdit />
                </IconButton>
            </label>

            <Dialog open={open}>
                <DialogTitle>Editar Rol</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Tome en cuenta que al cambiar la sucursal puede cambiar la jurisdicción del dependiente.
                        
                    </DialogContentText>
                    <Alert
                            variant="outlined"
                            severity="error"
                            style={{ display: showMsgApi ? "block" : "none" }}
                        >
                            {errorApi}
                        </Alert>
                    <Stack spacing={3} direction="column">
                        <FormControl fullWidth>
                            <TextField
                                autoFocus
                                margin="dense"
                                label="Usuario"
                                type="email"
                                fullWidth
                                variant="standard"
                                helperText={textErrorUser}
                                error={textErrorUser !== ""}
                                value={usuario.CLAVE}
                                disabled
                            />
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel id="select-sucursal">Sucursal</InputLabel>
                            <Select
                                labelId="select-sucursal"
                                label="Sucursal"
                                onChange={(e) => onChangeSucursal(e)}
                                value={codSucursal}                            >
                                {sucursalList.map((sucursal, i) => {
                                    return (
                                        <MenuItem value={sucursal.SUCURSAL} key={"usuario-create-sucursal-"+i} >
                                            {sucursal.SUCURSAL + " - " + sucursal.NOMBRESUCURSAL}
                                        </MenuItem>
                                    );
                                })}
                                
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel id="select-rol">Rol</InputLabel>
                            <Select
                                labelId="select-rol"
                                id="select-rol"
                                value={codRol}
                                label="Rol"
                                onChange={(e) => onChangeRol(e)}
                            >
                                {rolList.map((rol, i) => {
                                    return (
                                        <MenuItem value={rol.IDENTIFICADOR} key={"usuario-update-rol-"+i}>
                                            {rol.CODIGO + " - " + rol.DESCRIPCION}
                                        </MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={() => updateUser()}>Actualizar</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default FormUpdate;