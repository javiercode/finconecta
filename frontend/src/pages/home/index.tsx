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


  React.useEffect(() => {
    // getList()
  }, []);

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
      
      <Grid container component="main" justifyContent={'space-between'} >
        <Typography variant="h4" component="h4">
          ADMINISTRACIÓN DE GRUPOS
        </Typography>
        <FormCreate />
      </Grid>
      <hr />
      <Filter />
      
      <Box sx={{ width: '100%' }} style={{ display: dataList.length == 0 ? 'block' : 'none' }}>
        <LinearProgress />
      </Box>
      <Grid container spacing={3}>
        {
          dataList.map((rol, i) => (
            <Grid item xs={3} key={"grid-" + i}>
              <Card sx={{ minWidth: 100 }} key={"card-" + i}>
                <CardHeader
                  avatar={
                    <Avatar aria-label="recipe">
                      {/* {rol.grupo.substring(0,1)} */}
                    </Avatar>
                  }
                  action={
                    <IconButton aria-label="settings">
                    </IconButton>
                  }
                  title={rol.grupo}
                  subheader="September 14, 2016"
                />
                <CardContent key={"card-content" + i}>
                  <Typography variant="body2" key={"card-content-contenido" + i}>
                    <strong>Privacidad: </strong>{rol.privacidad}
                    <br />
                    <strong>Tipo: </strong>{rol.tipo}
                  </Typography>
                </CardContent>
                <CardActions key={"card-content-action" + i}>
                  <Button size="small" key={"card-content-button" + i}>Ingresar</Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        }
      </Grid>
    </>

  );
}

export default Home;
