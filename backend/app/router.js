
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);

  // POI
  router.get('/poi', controller.poi.list);
  router.post('/poi', controller.poi.query);
  
  // 出租车
  router.get('/taxi', controller.taxi.list);
  router.post('/taxi', controller.taxi.query);

  // 道路 路口相关
  router.get('/cross', controller.road.getCrossingSites);
  router.post('/cross',controller.road.postCrossingSites);
  router.post('/crossDailyCount', controller.road.crossDailyConut);
  
};