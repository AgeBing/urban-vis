import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;

  router.get('/', controller.home.index);
  router.post('/test', controller.home.test);
  router.get('/test', controller.home.test);

  // 数据接口
  router.get('/taxi', controller.taxi.query);
  router.get('/phone', controller.phone.query);

  // router.post('/taxi', controller.taxi.query);
  // router.post('/phone', controller.phone.query);
  // router.post('/weibo', controller.weibo.query);
  // router.post('/poi', controller.poi.query);

  router.post('/taxi',  controller.detail.transfer);
  router.post('/phone', controller.detail.transfer);
  router.post('/weibo', controller.detail.transfer);
  router.post('/poi',   controller.detail.transfer);
  router.post('/queryByDataId', controller.py.queryDetailByDataId);


  // Python 后端的接口
  router.post('/py/query', controller.py.query);
  router.post('/py/queryByDataId', controller.py.queryByDataId);

  
  router.get('/py/querySTConfig', controller.other.getSTConfig);
  router.get('/py/queryDataSetIds', controller.other.queryDataSetIds);

  // 用于 Case 展示
  // router.get('/case/taxi', controller.case.taxi);
  // router.get('/case/weibo', controller.case.weibo);
  // router.get('/case/weibo', controller.case.weiboAll);
  // router.get('/case/poi', controller.case.poi);
  // router.get('/case/taxiPhone', controller.case.taxiPhone);
};
