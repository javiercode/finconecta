// import { useDispatch, useSelector, useStore } from 'react-redux';
import { store } from '../index';
import { RolesType } from '../../enums/RouterPathEnum';
import { signInReducer, signOutReducer } from './reducer'
import { IAuthReducer, SessionDto } from '../../interfaces/store';

const signIn = (name: string, username: string, token: string, rol: SessionDto[]) => {
    let userLogin:IAuthReducer = {
        isLogin:true,
        token:token,
        username:username,
        name:name,
        rol:rol,
    }
    store.dispatch(signInReducer(userLogin));
}

const signOut = () => {
    store.dispatch(signOutReducer());
}

const getAuth = () => {
    // let authReducer = JSON.parse(sessionStorage.getItem('auth') || '{}');
    // if (  Object.keys(authReducer).length>0 && store.getState().AuthReducer.isLogin !== authReducer.payload.isLogin) {
    //     signIn(authReducer.payload.name, authReducer.payload.username, 
    //         authReducer.payload.token,authReducer.payload.rol,authReducer.payload.expire,authReducer.payload.sucursales,authReducer.payload.departamento);
    // }
    return store.getState().AuthReducer;
}

const updateToken = (token:string) => {
    const authSession = getAuth();
    if (authSession.isLogin) {
        signIn((authSession.name || ''),(authSession.username || ''),(token||''), (authSession.rol || []));
    } 
    return store.getState().AuthReducer;
}

const esOficial = () => {
    const auth = getAuth();
    let aRol = [];
    aRol = [...auth.rol];
    const rolFind = aRol.filter(element => (element ===RolesType.ADMIN || element ===RolesType.GERENTE || element ===RolesType.JEFE ));
    return rolFind.length==0;
}


export { signOut, signIn, getAuth,updateToken,esOficial }
