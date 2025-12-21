enum RouterPathEnum {
  HOME = '/home',
  ABOUT = '/about',
  LOGIN = '/',
  USUARIOS = '/usuarios',
}

enum ReducerType {
  SIGN_IN = 'login@SIGN_IN',
  SIGN_OUT = 'login@SIGN_OUT'
}

enum RolesType {
  ADMIN = 'ADM',
  GERENTE = 'GER',
  JEFE = 'JEF',
  OFICIAL = 'OFI'
}

const aMenuRol = [
  {
    code: 'adm_usuario',
    //   visible:!(getAuth().isLogin ),
    visible: true,
  }, {
    code: 'adm_cliente',
    visible: true,
  }, {
    code: 'adm_tarea',
    visible: true,
  }
];

export { RouterPathEnum, ReducerType, aMenuRol, RolesType }