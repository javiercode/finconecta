import { ReducerType } from '../../enums/RouterPathEnum'




const signInAction = (name:string,username:string,token:string,rol:string[],expire:number, sucursales:number[],departamento:number) =>{

  let signIn = {
    type:ReducerType.SIGN_IN,
    payload:{
      isLogin:true,
      username:username,
      name:name,
      token:token,
      rol:rol,
      expire:expire,
      sucursales:sucursales,
      departamento:departamento,
    }
  }
  sessionStorage.setItem('auth', JSON.stringify(signIn))
  return signIn;
}
const signOutAction = () =>{
  let signOut = {
    type:ReducerType.SIGN_OUT,
    payload:{
      isLogin:false
    }
  }
  sessionStorage.clear()
  return signOut;
}

export { signOutAction,signInAction}