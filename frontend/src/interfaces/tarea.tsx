import {dataCliente} from './cliente';

export interface dataTarea {
  id: string;
  tipo: string;
  codCliente: string;
  responsable: string;
  fecha: string;
  recordatorio: number;
  motivo: string;
  referencia: string;
  estado: string;
  fechaRegistro: string;  
  usuarioRegistro: string,
  sucursalRegistro:number;
  ubicacion:string;
  cliente:dataCliente;
  nroReferencia:number;
  NRO?:number;
}

export interface dataMovimiento {
  id: string,
  tipo: string,
  latitud: number,
  longitud: number,
  codTarea: string,
  usuarioRegistro: string,
  fechaRegistro: Date,
  sucursalRegistro: number,
  estado: string,
  fecha: Date,
  urlImage: string
}

export interface dataApi {
  tipo: string;
  codCliente: string;
  responsable: string;
  fecha: string;
  recordatorio: string;
  motivo: string;
  referencia: string;
}

export interface editDataApi {
  tipo: string;
  responsable: string;
  fecha: string;
  recordatorio: string;
  motivo: string;
  referencia: string;
}

export interface typeFormError {
  tipo: string,
  codCliente: string,
  responsable: string,
  // fecha: string,
  recordatorio: string,
  motivo: string,
  referencia: string,
}

export interface typeSetError {
  tipo: any,
  codCliente: any,
  responsable: any,
  fecha: any,
  recordatorio: any,
  motivo: any,
  referencia: any,
}

export interface Column {
  id: "nro"| "nroReferencia" | "cliente" | "responsable" | "fecha" | "tipo"| "referencia" | "bitacora" | "options";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}


export enum EstadoTareaEnum {
    F = 'FINALIZADO',
    A = 'ACTIVO',
    P = 'PROCESO',
    D = 'ELIMINADO',
}

export enum tipotareaEnum {
  GESTION_OF_CENTRAL='Gestiones de oficina',
  LLAMADA_COBRANZA='Llamada de cobranza',
  LLAMADA_MERCADEO='Llamada de mercadeo',
  REVISION_CARPETA='Revisión de carpeta',
  VISITA_COBRANZA='Visita de cobranza',
  VISITA_MERCADEO='Visita de mercadeo',
  VISITA_DOMICILIO='Visita de domicilio',
  VISITA_DOM_NEG_LAB='Visita domicilio y negocio/laboral',
  VISITA_NEGOCIO_LABORAL='Visita negocio/laboral',
}

export const regexError:typeFormError = {
  tipo: "^[A-Z_]{1,200}$",
  codCliente: "^[a-zA-Z0-9 ]{10,50}$",
  responsable: "^[a-zA-Z0-9]{3,4}$",
  recordatorio: "^[0-9]{1,2}$",
  motivo: "^[a-zA-Z0-9À-ÿ .,-]{0,300}$",
  referencia: "^[a-zA-Z0-9À-ÿ .,-]{0,300}$",
};

export const textoControl:typeSetError = {
  tipo: "Solo letras",
  codCliente: "Seleccione un valor porfavor!",
  responsable: "Solo iniciales en mayuscula!",
  fecha: "Seleccione un fecha porfavor!",
  recordatorio: "Numeros de maximo 2 caracteres!",
  motivo: "Maximo 300 caracteres!",
  referencia: "Maximo 300 caracteres!",
};