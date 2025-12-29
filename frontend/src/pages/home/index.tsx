import * as React from 'react';
import { getAuth } from '../../store/login';
import { Link } from 'react-router-dom';
import { RouterPathEnum } from '../../enums/RouterPathEnum';

function Home() {

  return (
    <>
      Bienvenido al sistema {getAuth().username}, para administrar tus usuarios ingresa a la seccion de usuarios o click <Link to={RouterPathEnum.USUARIOS}>aqui</Link>
      <br></br>
      <br></br>
      <br></br>

    </>

  );
}

export default Home;
