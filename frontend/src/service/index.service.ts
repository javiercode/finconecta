import axios, { AxiosRequestConfig } from "axios";
import { getAuth, signIn, updateToken } from '../store/login';
import { toast } from 'react-toastify';
import { MessageResponse } from '../interfaces/store';

axios.defaults.baseURL = process.env.REACT_APP_API_BACKEND;
axios.defaults.withCredentials = true; // IMPORTANTE: Permite enviar cookies/tokens
axios.defaults.headers.common['Content-Type'] = 'application/json';
var clientService = axios.create({
  baseURL: process.env.REACT_APP_API_BACKEND,
  withCredentials: true, // Habilita credenciales CORS
  timeout: 30000,
});

clientService.interceptors.request.use(
  (config) => {
    if (config.headers) {
      // Agregar token si existe y no es login
      const auth = getAuth();
      if (auth?.token && !config.url?.includes('/auth/login')) {
        config.headers.Authorization = `Bearer ${auth.token}`;
      }

      // Agregar headers para CORS
      config.headers['Access-Control-Allow-Origin'] = '*';
      config.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, PATCH, OPTIONS';
      config.headers['Access-Control-Allow-Headers'] = 'Authorization, Content-Type, Accept';
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


async function postService(url: string, data: any): Promise<MessageResponse> {
  return methodService('post', url, data);
};
async function getService(url: string, data: any): Promise<MessageResponse> {
  return methodService('get', url, data);
};
async function getBlobService(url: string, data: any): Promise<MessageResponse> {
  return methodBlobService('get', url, data);
};
async function putService(url: string, data: any): Promise<MessageResponse> {
  return methodService('put', url, data);
};
async function deleteService(url: string, data: any): Promise<MessageResponse> {
  return methodService('delete', url, data);
};
async function loginService(username: string, password: string): Promise<MessageResponse> {
  const credenciales = { username: username.toLowerCase(), password: password };
  return methodService('post', "/auth/login", credenciales);
};

async function methodService(type: string, url: string, dataPost: any): Promise<MessageResponse> {
  let response = { success: false, message: "Error al conectarse con el servidor", code: 0 } as MessageResponse;
  let ToastId;
  if (!isLogin(url) && type !== 'get') {
    ToastId = toast.loading("Cargando", { position: toast.POSITION.BOTTOM_RIGHT, autoClose: 5000 })
  }
  try {
    const { data: dataAxios, headers } = await clientService(getHeader(url, type, dataPost))
    if (headers) {
      updateToken(headers.authorization);
    }
    response = dataAxios ? dataAxios : response;
    if (response.success && isLogin(url)) {
      signIn(dataAxios.data.NOMBRE, dataPost.username.toUpperCase(), headers.authorization, []);
    }
  } catch (error) {
    response.code = 505;
    if (axios.isAxiosError(error)) {
      if (error && error.response) {
        response.code = error.response.status;
        switch (error.response.status) {
          case 401:
            response.message = "Demasiado tiempo inactivo, vuelva a loguearse";
            break;
          case 500:
            response.message = "Error interno, vuelva a intentarlo";
            break;
          case 400:
            response.message = "Petición incorrecta, reintente otra vez";
            break;
        }
      } else {
        response.message = 'error inesperado conexion: ' + error;
      }
    } else {
      console.error('unexpected error: ', error);
      response.message = 'error inesperado: ' + error;
    }
  }
  if (!isLogin(url) && ToastId) {
    toast.update(ToastId, { render: response.message, type: response.success ? "success" : "warning", autoClose: 1500, isLoading: false, position: toast.POSITION.BOTTOM_RIGHT, closeButton: true });
  }

  return response;
};

async function methodBlobService(type: string, url: string, dataPost: any): Promise<MessageResponse> {
  let response = { success: false, message: "Error al procesar la información", code: 0 } as MessageResponse;
  let ToastId;

  toast.dismiss();

  ToastId = toast.loading("Cargando", { position: toast.POSITION.BOTTOM_RIGHT, autoClose: 3000 })
  try {
    let header = getHeader(url, type, dataPost);
    header.responseType = 'stream';
    const { data: dataAxios, headers } = await clientService(header)
    if (headers) {
      updateToken(headers.authorization);
    }
    response = dataAxios ? dataAxios : response;

  } catch (error) {
    response.code = 505;
    if (axios.isAxiosError(error)) {
      if (error && error.response) {
        response.code = error.response.status;
        switch (error.response.status) {
          case 401:
            response.message = "Demasiado tiempo inactivo, vuelva a loguearse";
            break;
          case 500:
            response.message = "Error interno, vuelva a intentarlo";
            break;
          case 400:
            response.message = "Petición incorrecta, reintente otra vez";
            break;
        }
      } else {
        response.message = 'error inesperado conexion: ' + error;
      }
    } else {
      console.error('unexpected error: ', error);
      response.message = 'error inesperado: ' + error;
    }
  }
  if (ToastId) {
    toast.update(ToastId, { render: response.message, type: response.success ? "success" : "warning", autoClose: 1500, isLoading: false, position: toast.POSITION.BOTTOM_RIGHT });
  }

  return response;
};

const getHeader = (url: string, type: string, dataPost: any): AxiosRequestConfig => {
  const header = {
    method: type,
    url: (url),
    data: dataPost,
    headers: !isLogin(url) ? { 'Authorization': 'Bearer ' + getAuth().token } : {},
  } as AxiosRequestConfig;
  return header;
}
const isLogin = (url: string): boolean => {
  console.log("isLogin", url);
  return url === '/login';
}


export {
  postService,
  getService,
  putService,
  deleteService,
  loginService,
  getBlobService
};