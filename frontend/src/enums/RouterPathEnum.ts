enum RouterPathEnum  {
    HOME = '/home',
    ABOUT = '/about',
    LOGIN = '/',
    USUARIOS = '/usuarios',
    GEO_EJECUTIVO = '/geo-ejecutivo',
    SEG_EJECUTIVO = '/seguimiento',
    CLIENTES = '/clientes',
    GEO_CLIENTES = '/geo-cliente',
    TAREA = '/tarea',
    RESUMEN_TIEMPO = '/resumen-tiempo',
    EVOLUCION_GESTIONES = '/gestion',
    TAREA_CLIENTE = '/tarea-cliente',
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
      code:'adm_usuario',
    //   visible:!(getAuth().isLogin ),
      visible:true,
    },{
      code:'adm_cliente',
      visible:true,
    },{
      code:'adm_tarea',
      visible:true,
    }
  ];

export  {RouterPathEnum,ReducerType, aMenuRol,RolesType}