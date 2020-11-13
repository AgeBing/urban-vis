const assert = require('assert');
const mock = require('egg-mock');

describe('test/service/road.test.js', () => {
  let app;
  before(() => {
    // 创建当前应用的 app 实例
    app = mock.app();
    // 等待 app 启动成功，才能执行测试用例
    return app.ready();
  });
  
  it('路网数据', async () => {
    const ctx = app.mockContext();
    const roads = await ctx.service.road.list(); 
    assert(roads);
  });
});