import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import Typography from "@mui/material/Typography";
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

import FormCreate from "./FormCreate"
import FormDelete from "./FormDelete"
import FormUpdate from "./FormUpdate"

import {
  getService,
} from "../../service/index.service";
import {
  dataUser,
  typeRolData,
  typeSucursalData,
} from "../../interfaces/usuario";
import { esOficial } from "../../store/login";
import Color from "../../utils/styles/Color";
import { headerTable } from "../../utils/styles/General";

export interface SimpleDialogProps {
  open: boolean;
  selectedValue: string;
  onClose: (value: string) => void;
}

interface Column {
  id: "nro" | "clave" | "rol" | "nombre" | "sucursal" | "options";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: "nro", label: "Nro", minWidth: 50 },
  { id: "clave", label: "Usuario", minWidth: 100 },
  {
    id: "rol",
    label: "Rol",
    minWidth: 170,
  },
  {
    id: "nombre",
    label: "Nombre",
    minWidth: 170,
  },
  {
    id: "sucursal",
    label: "Sucursal",
    minWidth: 170,
    format: (value: number) => value.toFixed(0),
  },
  {
    id: "options",
    label: "Opciones",
    minWidth: 170,
  },
];

export default function Usuario() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [dataList, setDataList] = React.useState<dataUser[]>([]);
  const [dataTotal, setDataTotal] = React.useState<number>(0);
  const [rolList, setRolList] = React.useState<typeRolData[]>([]);
  const [sucursalList, setSucursalList] = React.useState<typeSucursalData[]>(
    []
  );

  let navigate = useNavigate();
  React.useEffect(() => {
    if(esOficial()){
      navigate('/home');
    }else{
      getList();
      getListSucursal();
      getListRol();
    }
  }, []);

  const getList = ({ pagina = 0, limite = 10 }: { pagina?: number; limite?: number } = {}) => {
    getService(`/usuario/list/${pagina}/${limite}`, {}).then((result) => {
      if (result.success) {
        const userList = result.data as dataUser[];
        userList.forEach((user, i) => {
          user.NRO = i + 1;
        });
        setDataList(userList);
        setDataTotal(result.total || 0);
      }
    }).catch(()=>{
      console.error("error de carga de usuario")
    });
  };

  const getListSucursal = () => {
    getService("/sucursal/list", {}).then((result) => {
      if (result.success) {
        setSucursalList(result.data);
      }
    });
  };

  const getListRol = () => {
      getService("/rol/list", {}).then((result) => {
        if (result.success) {
          setRolList(result.data);
        }
      });
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    getList({ pagina: newPage })
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    getList({ limite: +event.target.value })
    setPage(0);
  };

  return (
    <>
      <Typography variant="h4" component="h4">
        ADMINISTRACIÓN DE USUARIOS
      </Typography>
      
      <Grid container component="main" justifyContent={'flex-end'} >
        <FormCreate sucursalList={sucursalList} rolList={rolList} getList={getList} />
      </Grid>
      <Box sx={{ width: '100%' }} style={{display:dataList.length==0?'block':'none'}}>
        <LinearProgress />
      </Box>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 640 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth, ...headerTable }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {dataList
                // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.NRO}>
                      <TableCell>{row.NRO}</TableCell>
                      <TableCell>{row.CLAVE}</TableCell>
                      <TableCell>
                        {row.CODIGO + " - " + row.DESCRIPCION}
                      </TableCell>
                      <TableCell>{row.NOMBRE}</TableCell>
                      <TableCell>{row.SUCURSAL}</TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <FormUpdate usuario={row} sucursalList={sucursalList} rolList={rolList} getList={getList} />
                          <FormDelete usuario={row} getList={getList} />
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={dataTotal}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
              />
      </Paper>
    </>
  );
}
