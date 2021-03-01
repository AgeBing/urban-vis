import { Application } from 'egg';
export default (app: Application) => {
  const { controller, router } = app;

  router.get('/', controller.home.index);
  router.post('/test', controller.home.test);
  router.get('/test', controller.home.test);

  router.get('/taxi', controller.taxi.index);
  router.get('/phone', controller.phone.index);
  router.get('/weibo', controller.weibo.index);

  router.get('/stc', controller.taxi.query);

  // 出租车数据
  router.post('/taxi', controller.taxi.query);



  router.get('/case/taxi', controller.case.taxi);
  router.get('/case/weibo', controller.case.weibo);
  router.get('/case/taxiPhone', controller.case.taxiPhone);

};
