import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Avatar from '@mui/material/Avatar';
import { green } from '@mui/material/colors';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Button from '@mui/material/Button';
import Copyright from '../components/Copyright';
import { loginService } from '../service/index.service';
import Alert from '@mui/material/Alert';
import backgroundDefault from '../assets/image/backgroundDefault.jpg'
import { MessageResponse } from '../interfaces/store';
import CircularProgress from '@mui/material/CircularProgress';
import Color from '../utils/styles/Color';


const theme = createTheme();

function Login() {
  const [user, setUser] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [mensajeAlerta, setMensajeAlerta] = useState<string>("");
  const [loadingResponse, setLoadingResponse] = useState<boolean>(false);
  let navigate = useNavigate();

  useEffect(() => {
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoadingResponse(true)
    loginService(user, password).then((response: MessageResponse) => {
      if (response.success) {
        navigate('/home');
      } else {
        setMensajeAlerta(response.message)
      }

      setLoadingResponse(false)
    })
  };

  const buttonSx = {
    ...({
      bgcolor: green[500],
      '&:hover': {
        bgcolor: green[700],
      },
    }),
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(https://picsum.photos/800/900)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square style={{ backgroundImage: `url(${backgroundDefault})`, backgroundRepeat: 'repeat' }} >
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Card><CardContent>
              <Avatar style={{ margin: theme.spacing(2), backgroundColor: Color.secondary, display: 'inline-flex' }}>
                <LockOutlinedIcon style={{ color: 'white' }} />
              </Avatar>
              <Typography component="h1" variant="h5" sx={{ display: 'inline-flex', alignContent: 'right' }}>
                Iniciar Sesión
              </Typography>
              <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="user"
                  label="Usuario"
                  name="user"
                  autoComplete="user"
                  autoFocus
                  value={user}
                  onChange={(event) => { setUser(event.target.value) }}
                  inputProps={{ style: { textTransform: "lowercase" } }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  value={password}
                  onChange={(event) => { setPassword(event.target.value) }}
                  autoComplete="current-password"
                />

                {mensajeAlerta !== "" &&
                  <Alert severity='warning' onClose={() => { setMensajeAlerta("") }}>{mensajeAlerta}</Alert>
                }

                <Button type="submit" fullWidth variant="contained" sx={buttonSx} disabled={loadingResponse} style={{ background: Color.secondary }}>
                  {loadingResponse && (
                    <CircularProgress
                      size={24}
                      sx={{
                        color: green[500],
                        position: 'absolute',
                      }}
                    />
                  )}
                  Ingresar
                </Button>
                <Copyright sx={{ mt: 5 }} />
              </Box>
            </CardContent></Card>
          </Box>
        </Grid>
      </Grid>

    </ThemeProvider>
  );
}

export default Login;