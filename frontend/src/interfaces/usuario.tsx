
export interface dataUser {
  IDENTIFICADOR: number;
  BANCA: number;
  CLAVE: string;
  SUCURSAL: number;
  NOMBRE: string;
  CODIGO: string;
  DESCRIPCION: string;
  COD_ROL: number;
  NRO?:number;
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
// export {IAuthReducer};