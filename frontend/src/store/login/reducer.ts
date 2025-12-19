import { ReducerType } from '../../enums/RouterPathEnum'
import { AuthAction, IAuthReducer } from '../../interfaces/store'
import { createSlice } from '@reduxjs/toolkit'

let initialState:IAuthReducer = {
    isLogin: false,
    rol:[],
};


function AuthReducer( state = initialState,action:AuthAction ) {
  switch (action.type) {
    case ReducerType.SIGN_IN:
      let userLogin:IAuthReducer = {
          isLogin:true,
          token:action.payload.token,
          username:action.payload.username,
          name:action.payload.name,
          rol:action.payload.rol,
      }
      state = userLogin;
      return userLogin;
    case ReducerType.SIGN_OUT:
      state = initialState;
      return initialState
    default:
      return initialState;
  }
}

export const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    signInReducer: (state = initialState,action:AuthAction) => {
        let userLogin:IAuthReducer = {
          isLogin:true,
          token:action.payload.token,
          username:action.payload.username,
          name:action.payload.name,
          rol:action.payload.rol,
      }
    state = userLogin;
    return state;
    },
    signOutReducer: (state:any) => {
      state = initialState;
      return state;
    },
  },
}) 

// export default {AuthReducer,loginSlice};

export const { signInReducer, signOutReducer } = loginSlice.actions

export default loginSlice.reducer