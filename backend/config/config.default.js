// copy this file as  config.default.js
exports.keys = "xxxx";

exports.cors = { 
  credentials: true,
  origin: [ 'http://localhost:3000' ], 
  allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS'
}
exports.security = {
  csrf: {
    enable: false,
  },
};

const mysqlConfig = {
    'share':{
        host: '10.76.0.185',
    port: '3306',
    user: 'root',
    password: '123456',
    database: 'xiamen_xr'
    },
  'local': {
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: '123456',
    database: 'xiamen_xr'
  }
}
exports.mysql = {
  // 单数据库信息配置
  client: mysqlConfig['local'],
  // 是否加载到 app 上，默认开启
  app: true,
  // 是否加载到 agent 上，默认关闭
  agent: false,
};