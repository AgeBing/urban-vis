import { Application } from 'egg';
export default (app: Application) => {
  const { controller, router } = app;

  router.get('/', controller.home.index);
  router.post('/test', controller.home.test);
  router.get('/test', controller.home.test);

  // 数据接口
  router.get('/taxi', controller.taxi.query);
  router.post('/taxi', controller.taxi.query);
  router.get('/phone', controller.phone.index);
  router.get('/weibo', controller.weibo.index);
  router.post('/weibo', controller.weibo.query);
  router.get('/poi', controller.poi.index);
  router.post('/poi', controller.poi.query);
  router.get('/stc', controller.taxi.query);

  // Python 后端的接口
  router.post('/py/query', controller.py.query);
  router.post('/py/queryId', controller.py.getOneData);
  router.post('/py/box`', controller.py.isOneDataInBBox);

  // 用于 Case 展示
  router.get('/case/taxi', controller.case.taxi);
  router.get('/case/weibo', controller.case.weibo);
  router.get('/case/taxiPhone', controller.case.taxiPhone);
};
