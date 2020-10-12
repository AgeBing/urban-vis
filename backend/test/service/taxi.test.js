const assert = require('assert');
const mock = require('egg-mock');

describe('test/service/taxi.test.js', () => {
  let app;
  before(() => {
    // 创建当前应用的 app 实例
    app = mock.app();
    // 等待 app 启动成功，才能执行测试用例
    return app.ready();
  });

  it('轨迹查询', async () => {
    const ctx = app.mockContext();
    const trajs = await ctx.service.taxi.trajectorys(); 
    // console.log(trajs);
    assert(trajs);
  });

  // it('轨迹条件', async () => {
  //   const ctx = app.mockContext();
  //   ctx.request.body = {
  //     region: [
  //       [118.10001348684655, 24.49312168608001],
  //       [118.10189360177104, 24.440164488229374],
  //       [118.15749209838508, 24.44354654543104],
  //       [118.16472358617017, 24.498263208475073],
  //       [118.10001348684655, 24.49312168608001]
  //     ],
  //     time: [
  //       '2020-06-18 15:48:44',
  //       '2020-06-18 16:48:44',
  //     ]
  //   }
  //   const trajs = await ctx.service.taxi.query()
  //   assert(trajs)
  // })
});