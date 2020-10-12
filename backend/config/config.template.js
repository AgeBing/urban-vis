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
  'local': {
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: '',
    database: ''
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