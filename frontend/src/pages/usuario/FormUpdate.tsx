import React from 'react'
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Alert from "@mui/material/Alert";
import FormControl from "@mui/material/FormControl";
import Box from '@mui/material/Box';
import IconButton from "@mui/material/IconButton";
import IconEdit from "@mui/icons-material/ModeEditOutlineOutlined";
import AvatarIcon from '@mui/icons-material/Person';

import {
    putService,
} from "../../service/index.service";
import {
    typeFormError,
    typeSetErrorEdit
} from "../../interfaces/usuario";

import { btnDefault } from '../../utils/styles/General';
import { dataUserEdit } from '../../interfaces/usuario';

interface IFormUpdateProps {
    usuario: dataUserEdit,
    idUser: number,
    getList: () => void
}

let initDto: dataUserEdit = {
    nombre: "",
    username: "",
    email: ""
};

let regexError: typeFormError = {
    nombre: "^[a-zA-ZÀ-ÿ ]{1,200}$",
    username: "^[a-zA-Z0-9-.]{3,50}$",
    password: "^[a-zA-Z0-9!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?]{6,20}$",
    email: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
};




const FormUpdate: React.FC<IFormUpdateProps> = ({ usuario, idUser, getList }) => {

    const [open, setOpen] = React.useState(false);
    const [errorApi, setErrorApi] = React.useState<string>("");
    const [showMsgApi, setShowMsgApi] = React.useState<boolean>(false);
    const [createDto, setCreateDto] = React.useState<dataUserEdit>(initDto);

    const [nombre, setNombre] = React.useState<string>(usuario.nombre);
    const [username, setUsername] = React.useState<string>(usuario.username);
    const [email, setEmail] = React.useState<string>(usuario.email);

    const [nombreError, setNombreError] = React.useState<string>("");
    const [usernameError, setUsernameError] = React.useState<string>("");
    const [emailError, setEmailError] = React.useState<string>("");


    React.useEffect(() => {
    }, []);

    let tForm: typeSetErrorEdit = {
        nombre: setNombre,
        username: setUsername,
        email: setEmail,
    };

    let tFormError: typeSetErrorEdit = {
        nombre: setNombreError,
        username: setUsernameError,
        email: setEmailError,

    };

    let textControl: typeSetErrorEdit = {
        nombre: "Solo letras, maximo 200 caracteres",
        username: "Solo letras, minimo 3, maximo 50 caracteres",
        email: "Formato de correo invalido",
    };

    const saveUser = () => {
        let updateDto = createDto as dataUserEdit;
        updateDto.nombre = nombre;
        updateDto.username = username;
        updateDto.email = email;

        setCreateDto(updateDto)
        Object.keys(createDto).forEach(key => {
            onChangeInput({ 'target': { 'name': key, 'value': createDto[key as keyof dataUserEdit] } }, key)
        });
        if (createDto.nombre !== "" && createDto.username !== ""
            && createDto.email !== "") {
            putService("/users/" + idUser, createDto).then((result) => {
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
        initDto = {
            nombre: "",
            username: "",
            email: "",

        };

        setNombre(usuario.nombre);
        setUsername(usuario.username);
        setEmail(usuario.email);

        setOpen(true);
    };

    const onChangeInput = (event: any, input: string) => {
        const { value } = event.target;
        let regex = new RegExp(regexError[input as keyof typeFormError]);
        if (regex.test(value)) {
            let dto = createDto;
            dto[input as keyof dataUserEdit] = value;
            setCreateDto(dto);
            tFormError[input as keyof dataUserEdit]("")

        } else {
            tFormError[input as keyof dataUserEdit]("Formato de: " + input + " incorrecto!")
            if (!value && value.length === 0) {
                tFormError[input as keyof dataUserEdit]("Campo " + input + " requerido!")
            } else {
                tFormError[input as keyof dataUserEdit](textControl[input as keyof dataUserEdit])
            }
        }
        tForm[input as keyof dataUserEdit](value)
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <label htmlFor="icon-delete">
                <IconButton
                    color="primary"
                    aria-label="upload picture"
                    component="span"
                    onClick={handleClickOpen}
                    style={btnDefault}
                >
                    <IconEdit />
                </IconButton>
            </label>

            <Dialog open={open}>
                <DialogTitle>Editar Usuario</DialogTitle>
                <DialogContent>
                    <Alert
                        variant="outlined"
                        severity="error"
                        style={{ display: showMsgApi ? "block" : "none" }}
                    >
                        {errorApi}
                    </Alert>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                        <FormControl fullWidth sx={{ m: 1 }} >
                            <TextField
                                label="Nombre"
                                value={nombre}
                                InputProps={{
                                    startAdornment: <AvatarIcon />,
                                }}
                                onChange={(e) => onChangeInput(e, "nombre")}
                                helperText={nombreError}
                                error={nombreError !== ""}
                            />
                        </FormControl>
                        <FormControl fullWidth sx={{ m: 1 }} >
                            <TextField
                                label="Usuario"
                                value={username}
                                onChange={(e) => onChangeInput(e, "username")}
                                helperText={usernameError}
                                error={usernameError !== ""}
                            />
                        </FormControl>
                        <FormControl fullWidth sx={{ m: 1 }} >
                            <TextField
                                label="Correo"
                                value={email}
                                onChange={(e) => onChangeInput(e, "email")}
                                helperText={emailError}
                                error={emailError !== ""}
                            />
                        </FormControl>

                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={() => saveUser()}>Actualizar</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default FormUpdate;