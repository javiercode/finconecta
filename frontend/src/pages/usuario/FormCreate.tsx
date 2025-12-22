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
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import AvatarIcon from '@mui/icons-material/Person';
import FormHelperText from '@mui/material/FormHelperText';


import {
    postService,
} from "../../service/index.service";
import {
    dataApi,
    typeFormError,
    typeSetError, //typeApiString
} from "../../interfaces/usuario";
import {
    IOptionMap
} from "../../interfaces/general";
import Color from '../../utils/styles/Color';
import { btnDefault } from '../../utils/styles/General';
import { Divider } from '@mui/material';

interface IFormCreateProps {
    getList: () => void
}

let initDto: dataApi = {
    nombre: "",
    username: "",
    password: "",
    email: ""

};

let regexError: typeFormError = {
    nombre: "^[a-zA-ZÀ-ÿ ]{1,200}$",
    username: "^[a-zA-Z0-9-.]{3,50}$",
    password: "^[a-zA-Z0-9!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?]{6,20}$",
    email: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",

};


const FormCreate: React.FC<IFormCreateProps> = ({ getList }) => {
    const [open, setOpen] = React.useState(false);
    const [errorApi, setErrorApi] = React.useState<string>("");
    const [showMsgApi, setShowMsgApi] = React.useState<boolean>(false);
    const [createDto, setCreateDto] = React.useState<dataApi>(initDto);

    const [usernameError, setUsernameError] = React.useState<string>("");
    const [passwordError, setPasswordError] = React.useState<string>("");
    const [nombreError, setNombreError] = React.useState<string>("");
    const [emailError, setEmailError] = React.useState<string>("");


    React.useEffect(() => {
    }, []);

    let tFormError: typeSetError = {
        nombre: setNombreError,
        username: setUsernameError,
        password: setPasswordError,
        email: setEmailError,

    };

    const textControl: typeSetError = {
        nombre: "Solo letras, maximo 200 caracteres",
        username: "Solo letras, minimo 3, maximo 50 caracteres",
        password: "Solo letras, numeros y los siguientes cararcteres: . -  (minimo 6 y maximo 50 caracteres)",
        email: "Formato de correo invalido",

    };

    const saveUser = () => {
        Object.keys(createDto).forEach(key => {
            const x = { text: key, value: createDto[key as keyof dataApi] }
            onChangeInput({ 'target': { 'name': key, 'value': createDto[key as keyof dataApi] } }, key)
        });
        if (createDto.nombre !== "" && createDto.username !== "" && createDto.password !== ""
            && createDto.email !== "") {
            createDto.nombre = createDto.nombre.toLocaleUpperCase();
            postService("/users", createDto).then((result) => {
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


    const onChangeInput = (event: any, input: string) => {
        let dto = createDto;
        const { value } = event.target;
        let regex = new RegExp(regexError[input as keyof typeFormError]);
        if (regex.test(value)) {
            dto[input as keyof dataApi] = value;
            setCreateDto(dto);
            tFormError[input as keyof typeSetError]("")
        } else {
            if (value.length == 0) {
                tFormError[input as keyof typeSetError]("Campo " + input + " requerido!")
            } else {
                tFormError[input as keyof typeSetError](textControl[input as keyof typeSetError])
            }
        }
    };

    const handleClose = () => {
        setOpen(false);
    };
    const handleClickOpen = () => {

        setCreateDto(initDto);
        setOpen(true);

        setErrorApi("");
        setShowMsgApi(false);
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
            <Dialog open={open} key={'user-formcreate-dialog'}>
                <DialogTitle key={'user-formcreate-dialogtitle'}>Crear Usuario</DialogTitle>
                <DialogContent key={'user-formcreate-dialogcontent'}>
                    <DialogContentText>
                        Cuando se registre el usuario aqui, el mismo podra ingresar al
                        sistema.

                    </DialogContentText>
                    <Alert
                        variant="outlined"
                        severity="error"
                        style={{ display: showMsgApi ? "block" : "none" }}
                        key={'user-formcreate-dialog-alert'}
                    >
                        {errorApi}
                    </Alert>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap' }} key={'user-formcreate-dialog-box'}>
                        <FormControl fullWidth sx={{ m: 1 }} key={'user-formcreate-dialog-formcontrol'}>
                            <TextField
                                label="Nombre"
                                InputProps={{
                                    startAdornment: <AvatarIcon />,
                                }}
                                onChange={(e) => onChangeInput(e, "nombre")}
                                helperText={nombreError}
                                error={nombreError !== ""}
                                key={'user-formcreate-dialog-formcontrol-nombre'}
                            />
                        </FormControl>
                        <FormControl fullWidth sx={{ m: 1 }} key={'user-formcreate-dialog-formcontrol'}>
                            <TextField
                                label="Usuario"
                                onChange={(e) => onChangeInput(e, "username")}
                                helperText={usernameError}
                                error={usernameError !== ""}
                                key={'user-formcreate-dialog-formcontrol-telefono1'}
                            />
                        </FormControl>
                        <FormControl fullWidth sx={{ m: 1 }} key={'user-formcreate-dialog-formcontrol'}>
                            <TextField
                                label="Correo" type='email'
                                onChange={(e) => onChangeInput(e, "email")}
                                helperText={emailError}
                                error={emailError !== ""}
                                key={'user-formcreate-dialog-formcontrol-email'}
                            />
                        </FormControl>
                        <FormControl fullWidth sx={{ m: 1 }} key={'user-formcreate-dialog-formcontrol'}>
                            <TextField
                                label="Contraseña" type='password'
                                onChange={(e) => onChangeInput(e, "password")}
                                helperText={passwordError}
                                error={passwordError !== ""}
                                key={'user-formcreate-dialog-formcontrol-password'}
                            />
                        </FormControl>
                    </Box >

                </DialogContent >
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={() => saveUser()}>Crear</Button>
                </DialogActions>
            </Dialog >
        </>
    )
}

export default FormCreate;