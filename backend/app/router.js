
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.get('/poi', controller.poi.list);
  router.get('/weibo', controller.weibo.list);

  router.get('/taxi', controller.taxi.list);
  router.post('/taxi', controller.taxi.query);

  // 道路 路口相关
  router.get('/cross', controller.road.getCrossingSites);
  router.post('/cross',controller.road.postCrossingSites);
  router.post('/crossDailyCount', controller.road.crossDailyConut);
  router.post('/crossODMapData', controller.road.crossODMapData);

  // router.get('/road', controller.road.list);
  // router.get('/crossStatics', controller.road.crossStatics);
  router.post('/data', controller.data.list);
};