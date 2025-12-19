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
import {
    postService,
  } from "../../service/index.service";
  import {
    dataUser,
    typeRolData,
    typeSucursalData,
    typeCreate,
  } from "../../interfaces/usuario";
import { btnDefault } from '../../utils/styles/General';

  interface IFormCreateProps {
    // sucursalList: typeSucursalData[],
    // rolList:typeRolData[],
    // getList: () => void
}

// const FormCreate: React.FC<IFormCreateProps> = ({sucursalList, rolList, getList}) => {
const FormCreate: React.FC<IFormCreateProps> = () => {

    const [open, setOpen] = React.useState(false);
    const [textErrorUser, setTextErrorUser] = React.useState<string>("");
    const [errorApi, setErrorApi] = React.useState<string>("");
    const [showMsgApi, setShowMsgApi] = React.useState<boolean>(false);
    const [createDto, setCreateDto] = React.useState<typeCreate>({
        codRolAplicacion: 0,
        clave: "",
        sucursal: 0,
    });

    const saveUser = () => {
        // if (createDto.codRolAplicacion !== 0 && createDto.sucursal !== 0) {
        //     postService("/usuario/create", createDto).then((result) => {
        //         setErrorApi(result.success ? "" : result.message);
        //         setShowMsgApi(!result.success);
        //         setOpen(!result.success);
        //         if (result.success) {
        //             getList();
        //         }
        //     });
        // } else {
        //     setErrorApi("Completar el formulario, porfavor.");
        //     setShowMsgApi(true);
        // }
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const onChangeUser = (event: any) => {
        const { name, value } = event.target;
        let regex = new RegExp("^[A-Z0-9 ]{1,4}$");
        if (regex.test(value)) {
            let dto = createDto;
            dto.clave = value;
            setCreateDto(dto);
            setTextErrorUser("");
        } else {
            setTextErrorUser(
                "Formato incorrecto! (Mayusculas y maximo 4 carácteres)"
            );
        }
    };

    const onChangeSucursal = (event: any) => {
        const { name, value } = event.target;
        let dto = createDto;
        dto.sucursal = value;
        setCreateDto(dto);
    };

    const onChangeRol = (event: any) => {
        const { name, value } = event.target;
        let dto = createDto;
        dto.codRolAplicacion = value;
        setCreateDto(dto);
    };

    const handleClose = () => {
        setOpen(false);
      };

    return (
        <>
            <Button
                variant="outlined"
                startIcon={<IconCreate />}
                onClick={handleClickOpen}
                style={btnDefault}
            >
                Registrar
            </Button>

            <Dialog open={open}>
                <DialogTitle>Crear Rol</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Cuando se registre el usuario aqui, el mismo podra ingresar al
                        sistema.
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
                                id="usuario"
                                label="Usuario"
                                type="email"
                                fullWidth
                                variant="standard"
                                onChange={(e) => onChangeUser(e)}
                                helperText={textErrorUser}
                                error={textErrorUser !== ""}
                            />
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel id="select-sucursal">Sucursal</InputLabel>
                            <Select
                                labelId="select-sucursal"
                                id="select-sucursal"
                                //value={30}
                                label="Sucursal"
                                onChange={(e) => onChangeSucursal(e)}
                            >
                                {/* {sucursalList.map((sucursal, i) => {
                                    return (
                                        <MenuItem value={sucursal.SUCURSAL} key={"usuario-update-sucursal-"+i}>
                                            {sucursal.SUCURSAL + " - " + sucursal.NOMBRESUCURSAL}
                                        </MenuItem>
                                    );
                                })} */}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel id="select-rol">Rol</InputLabel>
                            <Select
                                labelId="select-rol"
                                id="select-rol"
                                // value={30}
                                label="Rol"
                                onChange={(e) => onChangeRol(e)}
                            >
                                {/* {rolList.map((rol, i) => {
                                    return (
                                        <MenuItem value={rol.IDENTIFICADOR} key={"usuario-update-rol-"+i}>
                                            {rol.CODIGO + " - " + rol.DESCRIPCION}
                                        </MenuItem>
                                    );
                                })} */}
                            </Select>
                        </FormControl>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={() => saveUser()}>Crear</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default FormCreate;