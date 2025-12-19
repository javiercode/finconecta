import React, { useEffect } from 'react'
import Box, { BoxProps } from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import FormControl from "@mui/material/FormControl";
import { LocalizationProvider, MobileDateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import Button from '@mui/material/Button';
import IconSearch from "@mui/icons-material/Search";
import { btnDefault } from '../../utils/styles/General';
import { esOficial, getAuth } from '../../store/login';
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { EstadoTareaEnum } from '../../interfaces/tarea';
import { getStrFecha } from '../../config/General';


interface IFormCreateProps {
    // getList: (params:any) => void
}

// const Filter: React.FC<IFormCreateProps> = ({ getList }: IFormCreateProps) => {
const Filter: React.FC<IFormCreateProps> = () => {
    const [fechaInicio, setFechaInicio] = React.useState<Date | null>(new Date());
    const [fechaFin, setFechaFin] = React.useState<Date | null>(new Date());
    const [nro, setNro] = React.useState<number>(0);
    const [estado, setEstado] = React.useState<string>("");
    const [responsable, setResponsable] = React.useState<string>("");


    useEffect(() => {
    }, []);

    const handleFind = () => {
        const paramsFilter={
            "nro":nro,
            "estado":estado =="TODOS"?"":estado,
            "responsable":esOficial()? getAuth().username: responsable,
            "fechaInicio": getStrFecha({date:new Date(fechaInicio || "") }),
            "fechaFin": getStrFecha({date:new Date(fechaFin || "") }),
        }
        // getList(paramsFilter)
    };

    return (
        <div style={{ width: '100%' }}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    p: 1,
                    m: 1,
                    bgcolor: 'background.paper',
                    borderRadius: 1,
                }}
            >
                <FormControl fullWidth sx={{ m: 1 }} key={'cliente-filter-nro'}>
                    <TextField
                        label="Nro Referencia"
                        onChange={(e)=>setNro(Number(e.target.value.toString()) ||0)}
                        key={'cliente-formcreate-dialog-formcontrol-nombre1'}
                    />
                </FormControl>
                <FormControl fullWidth sx={{ m: 1, width: '150ch'}} key={'tarea-filter-tipo'}>
                            <InputLabel id="tarea-formcreate-select-tipo">Estado</InputLabel>
                            <Select
                                labelId="tarea-formcreate-select-tipo"
                                label="Estado"
                                onChange={(e) => setEstado(e.target.value)}
                                key={'tarea-filter-estado'}
                                defaultValue="TODOS"
                            >
                                <MenuItem value={"TODOS"} key={'tarea-filter-estado-default'}>
                                    {"TODOS"} </MenuItem>
                                {Object.keys(EstadoTareaEnum).map((key: string, index:number) => {
                                    return (
                                        <MenuItem value={key} key={'tarea-filter-select-estado-'+key}>
                                            { Object.values(EstadoTareaEnum)[index]}
                                        </MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>
                <FormControl fullWidth sx={{ m: 1 }} key={'cliente-filter-responsable'}>
                    <TextField
                        disabled={esOficial()}
                        defaultValue={esOficial()? getAuth().username : ""}
                        label="responsable"
                        onChange={(e)=>setResponsable(e.target.value.toString() || "")}
                        key={'cliente-formcreate-dialog-formcontrol-nombre2'}
                    />
                </FormControl>
                <FormControl fullWidth sx={{ m: 1, width: '150ch' }} key={'tarea-filter-fechaInicio'} >
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <MobileDateTimePicker
                            label="Inicio"
                            value={fechaInicio}
                            onChange={(e) => { setFechaInicio(e) }}
                            renderInput={(params: any) => <TextField {...params} />}
                            inputFormat="dd/MM/yyyy HH:MM"
                            InputProps={{
                                startAdornment: <CalendarTodayRoundedIcon />,
                            }}
                        />
                    </LocalizationProvider>
                </FormControl>
                <FormControl fullWidth sx={{ m: 1, width: '150ch' }} key={'tarea-filter-fechaFin'} >
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <MobileDateTimePicker
                            label="Fin"
                            value={fechaFin}
                            onChange={(e) => { setFechaFin(e) }}
                            renderInput={(params: any) => <TextField {...params} />}
                            inputFormat="dd/MM/yyyy HH:MM"
                            InputProps={{
                                startAdornment: <CalendarTodayRoundedIcon />,
                            }}
                        />
                    </LocalizationProvider>
                </FormControl>
                <Button fullWidth sx={{ m: 1, width: '100ch' }} 
                    variant="outlined"
                    startIcon={<IconSearch />}
                    onClick={handleFind}
                    style={btnDefault}
                >
                    Buscar
                </Button>
            </Box>
        </div>
    )
}

export default Filter;