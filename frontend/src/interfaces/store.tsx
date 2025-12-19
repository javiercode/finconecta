export interface IAuthReducer {
  isLogin: boolean;
  token?: string;
  username?: string;
  name?: string;
  rol?: SessionDto[];
}

export interface SessionDto {
  id:number,
  codigo:string,
  username:string,
  rol:string,
  correo:string,
  grupo:string,
  tipo:string,
  privacidad:string,
  codPartido:string
};

export interface AuthAction {
  type: string
  payload: IAuthReducer
}

export interface MessageResponse {
  success: boolean,
  message: string,
  code: number,
  data?:any,
  total?:number
}

// export {IAuthReducer};