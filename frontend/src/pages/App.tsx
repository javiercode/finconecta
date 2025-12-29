import * as React from 'react';
import '../assets/styles/App.css';
import Layout from './Layout';
import Login from './Login';
import About from './About';
import Home from './home';
import Usuario from './usuario';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { RouterPathEnum } from '../enums/RouterPathEnum';
//import {createBrowserHistory } from "history"

// const history = createBrowserHistory({ base:'/web' });

function App() {
  return (
    <BrowserRouter basename={process.env.REACT_APP_PATH || ""}>
      {/* <BrowserRouter basename=""> */}
      <Routes>
        <Route path={RouterPathEnum.LOGIN} element={<Login />} />

        <Route element={<Layout />} >
          <Route path={RouterPathEnum.HOME} element={<Home />} />
          <Route path={RouterPathEnum.ABOUT} element={<About />} />
          <Route path={RouterPathEnum.USUARIOS} element={<Usuario />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;