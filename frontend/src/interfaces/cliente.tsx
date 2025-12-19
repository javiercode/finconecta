
export interface dataCliente {
  id: string;
  nombre: string;
  telefono1: string;
  telefono2: string;
  direccion: string;
  ci: string;
  complemento: string;
  extension: string;
  comentario: string;
  estado: string;
  fechaRegistro: string;  
  usuarioRegistro: string,
  sucursalRegistro:number;
  latitud:number;
  longitud:number;
  NRO?:number;
}

export interface dataApi {
  nombre: string,
  telefono1: string,
  telefono2: string,
  direccion: string,
  ci: string,
  complemento: string,
  extension: string,
  comentario: string,
  latitud: number | string,
  longitud: number | string,
}

export interface dataEditApi {
  nombre: string,
  telefono1: string,
  telefono2: string,
  direccion: string,
  extension: string,
  comentario: string,
  latitud: number | string,
  longitud: number | string,
}

export interface typeApiString {
  nombre: string,
  telefono1: string,
  telefono2: string,
  direccion: string,
  ci: string,
  complemento: string,
  extension: string,
  comentario: string,
  latitud: string,
  longitud: string,
}

export interface typeFormError {
  nombre: string,
  telefono1: string,
  telefono2: string,
  direccion: string,
  ci: string,
  complemento: string,
  extension: string,
  comentario: string,
  latitud: string,
  longitud: string,
}

export interface typeSetError {
  nombre: any,
  telefono1: any,
  telefono2: any,
  direccion: any,
  ci: any,
  complemento: any,
  extension: any,
  comentario: any,
  latitud: any,
  longitud: any,
}

export interface typeSetErrorEdit {
  nombre: any,
  telefono1: any,
  telefono2: any,
  direccion: any,
  extension: any,
  comentario: any,
  latitud: any,
  longitud: any,
}

export interface Column {
  id: "nro" | "nombre" | "doc_identidad" | "telefono" | "comentario"| "bitacora" | "registro" | "options";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}

export enum extensionCI {
  CH='Chuquisaca',
  LP='La Paz',
  CB='Cochabamba',
  OR='Oruro',
  PT='Potosí',
  TJ='Tarija',
  SC='Santa Cruz',
  BE='Beni',
  PD='Pando',
  PE='Persona Extranjera',
}

export interface ILocationCliente {
  lat: number,
  lng: number,
  id: string,
  nombre: string,
  direccion: string,
}