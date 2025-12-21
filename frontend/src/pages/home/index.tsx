import { Avatar, Button, Card, CardActions, CardContent, CardHeader, Grid, IconButton, LinearProgress, Typography } from '@mui/material';
import { Box } from '@mui/system';
import * as React from 'react';
import { SessionDto } from '../../interfaces/store';
import { getService } from '../../service/index.service';
import { getAuth } from '../../store/login';

import FormCreate from "./FormCreate"
import Filter from "./Filter"

function Home() {
  const [dataList, setDataList] = React.useState<SessionDto[]>([]);

  const getList = () => {
    const user = getAuth();
    getService(`/roluser/list/${user.username}`, {}).then((result) => {
      if (result.success) {
        const userList = result.data as SessionDto[];
        setDataList(userList);
      }
    }).catch(() => {
      console.error("error de carga de usuario")
    });
  };

  return (
    <>
      Inicio
    </>

  );
}

export default Home;
