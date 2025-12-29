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
} from "../../interfaces/usuario";
import { headerTable } from "../../utils/styles/General";

export interface SimpleDialogProps {
  open: boolean;
  selectedValue: string;
  onClose: (value: string) => void;
}

interface Column {
  id: "nro" | "nombre" | "username" | "correo" | "activo" | "options";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: "nro", label: "Nro", minWidth: 50 },
  { id: "nombre", label: "Nombre", minWidth: 100 },
  {
    id: "username",
    label: "Usuario",
    minWidth: 170,
  },
  {
    id: "correo",
    label: "Correo",
    minWidth: 170,
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

  React.useEffect(() => {
    getList(page, rowsPerPage);
  }, [page, rowsPerPage]);

  const getList = (page: number = 0, rowsPerPage: number = 10) => {
    getService(`/users/all/${page}/${rowsPerPage}`, {}).then((result) => {
      if (result.success) {
        const userList = result.data as dataUser[];
        userList.forEach((user, i) => {
          user.NRO = i + 1;
        });
        setDataList(userList);
        setDataTotal(result.total || 0);
      }
    }).catch(() => {
      console.error("error de carga de usuario")
    });
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    getList(newPage, rowsPerPage)
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    getList(0, +event.target.value)
    setPage(0);
  };

  return (
    <>
      <Typography variant="h4" component="h4">
        ADMINISTRACIÓN DE USUARIOS
      </Typography>

      <Grid container component="main" justifyContent={'flex-end'} >
        <FormCreate getList={getList} />
      </Grid>
      <Box sx={{ width: '100%' }} style={{ display: dataList.length === 0 ? 'block' : 'none' }}>
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
                      <TableCell>{row.nombre}</TableCell>
                      <TableCell>{row.username}</TableCell>
                      <TableCell>{row.email}</TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <FormUpdate usuario={row} getList={getList} idUser={row.id} />
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
