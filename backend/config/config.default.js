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
  // �����ݿ���Ϣ����
  client: mysqlConfig['local'],
  // �Ƿ���ص� app �ϣ�Ĭ�Ͽ���
  app: true,
  // �Ƿ���ص� agent �ϣ�Ĭ�Ϲر�
  agent: false,
};