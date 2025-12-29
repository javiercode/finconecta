import axios, { AxiosRequestConfig } from "axios";
import { getAuth, signIn, updateToken } from '../store/login';
import { toast } from 'react-toastify';
import { MessageResponse } from '../interfaces/store';

axios.defaults.baseURL = process.env.REACT_APP_API_BACKEND;


const API_BASE_URL = process.env.REACT_APP_API_BACKEND || 'http://localhost:8080/finconecta';

var clientService = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// REMUEVE el interceptor que agrega headers CORS incorrectos
clientService.interceptors.request.use(
  (config) => {
    // SOLO agregar Authorization si existe
    const auth = getAuth();
    if (auth?.token && !config.url?.includes('/auth/login')) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${auth.token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Añade este interceptor de respuesta para debug
clientService.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('Axios error:', {
      message: error.message,
      code: error.code,
      response: error.response,
      request: error.request
    });
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
  const credenciales = {
    username: username.toLowerCase(),
    password: password
  };

  // Configuración EXPLÍCITA para login
  const config: AxiosRequestConfig = {
    method: 'post',
    url: '/auth/login',
    data: credenciales,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    }
  };

  let response = { success: false, message: "Error al conectarse con el servidor", code: 0 } as MessageResponse;

  try {
    const { data: dataAxios, headers } = await clientService(config);
    if (headers) {
      updateToken(dataAxios.data.token);
    }
    response = dataAxios ? dataAxios : response;

    if (response.success) {
      signIn(
        dataAxios.data?.NOMBRE || username.toUpperCase(),
        username.toUpperCase(),
        dataAxios.data.token,
        []
      );
    }
  } catch (error: any) {
    console.error('💥 Login error details:', {
      error,
      isAxiosError: axios.isAxiosError(error),
      response: error.response,
      request: error.request
    });

    response = handleError(error, response);
  }

  return response;
};
async function methodService(type: string, url: string, dataPost: any): Promise<MessageResponse> {
  let response = { success: false, message: "Error al conectarse con el servidor", code: 0 } as MessageResponse;
  let ToastId;
  if (!isLogin(url) && type !== 'get') {
    ToastId = toast.loading("Cargando", { position: toast.POSITION.BOTTOM_RIGHT, autoClose: 5000 })
  }
  try {
    const { data: dataAxios, headers } = await clientService(getHeader(url, type, dataPost))
    if (headers && headers.authorization) {
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
  return url === '/login';
}

const handleError = (error: any, response: MessageResponse): MessageResponse => {
  console.error('🔴 API Error:', {
    message: error.message,
    code: error.code,
    isAxiosError: axios.isAxiosError(error),
    response: error.response,
    request: error.request
  });

  if (axios.isAxiosError(error)) {
    if (error.response) {
      response.code = error.response.status;

      switch (error.response.status) {
        case 0:
          response.message = "Error de red o CORS. Verifica: \n1. Servidor corriendo\n2. Configuración CORS\n3. No hay bloqueos de red";
          break;
        case 401:
          response.message = "No autorizado. Token inválido o expirado.";
          break;
        case 403:
          response.message = "Acceso prohibido. Problema de CORS o permisos.";
          break;
        case 404:
          response.message = "Recurso no encontrado.";
          break;
        case 500:
          response.message = "Error interno del servidor.";
          break;
        case 400:
          response.message = "Solicitud incorrecta.";
          break;
        default:
          response.message = `Error ${error.response.status}`;
      }
    } else if (error.request) {
      // No hubo respuesta del servidor (CORS o red)
      response.message = "No se pudo conectar al servidor. Posibles causas:\n" +
        "1. El servidor no está corriendo\n" +
        "2. Problema de configuración CORS\n" +
        "3. Bloqueo de red/firewall";
      response.code = 0;
    } else {
      response.message = `Error: ${error.message}`;
    }
  } else {
    response.message = `Error inesperado: ${error.message || 'Desconocido'}`;
  }

  return response;
};


export {
  postService,
  getService,
  putService,
  deleteService,
  loginService,
  getBlobService
};
