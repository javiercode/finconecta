
export interface dataUser {
  id: number;
  nombre: string;
  username: string;
  email: string;
  active: boolean;
  NRO?: number;
}

export interface dataUserEdit {
  // id?: number;
  nombre: string;
  username: string;
  email: string;
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

export interface typeSetErrorEdit {
  nombre: any,
  username: any,
  email: any,
}

export interface typeFormError {
  nombre: string,
  username: string,
  password: string,
  email: string,
}

export interface dataApi {
  id?:string
  nombre: string,
  username: string,
  password: string,
  email: string,
  active?: string,
}

export interface dataApiEdit {
  id?:string
  nombre: string,
  username: string,
  email: string,
}