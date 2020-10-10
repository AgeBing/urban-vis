
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.get('/poi', controller.poi.list);
  router.get('/taxi', controller.taxi.list);
  router.get('/weibo', controller.weibo.list);
};