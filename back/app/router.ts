import { Application } from 'egg';
export default (app: Application) => {
  const { controller, router } = app;

  router.get('/', controller.home.index);

  router.get('/taxi', controller.taxi.index);
  router.get('/phone', controller.phone.index);
  router.get('/weibo', controller.weibo.index);
};
