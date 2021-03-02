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
  router.get('/stc', controller.taxi.query);

  // 用于 Case 展示
  router.get('/case/taxi', controller.case.taxi);
  router.get('/case/weibo', controller.case.weibo);
  router.get('/case/taxiPhone', controller.case.taxiPhone);
};
