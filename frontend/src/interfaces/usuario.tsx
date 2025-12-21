
export interface dataUser {
  id: number;
  nombre: number;
  username: string;
  email: number;
  active: string;
  NRO?: number;
}

export interface typeData {
  nro: string;
  clave: string;
  rol: string;
  nombre: string;
  sucursal: number;
  identificador: number;
}

export interface typeRolData {
  CODIGO: string;
  DESCRIPCION: string;
  IDENTIFICADOR: number;
}

export interface typeSucursalData {
  NOMBRESUCURSAL: string;
  DIRECCION: string;
  SUCURSAL: number;
}

export interface typeCreate {
  codRolAplicacion: number;
  clave: string;
  sucursal: number;
}


export interface typeSetError {
  nombre: any,
  username: any,
  password: any,
  email: any,
}

export interface typeFormError {
  nombre: string,
  username: string,
  password: string,
  email: string,
}

export interface dataApi {
  nombre: string,
  username: string,
  password: string,
  email: string,
  active?: string,
}