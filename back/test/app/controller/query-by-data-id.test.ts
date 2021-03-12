import * as assert from 'assert';
import { app } from 'egg-mock/bootstrap';
import { hasItem } from '../../util'
import { DATA_IDS_Taxi, DATA_IDS_Weibo } from '../../cond'

describe('test/app/controller/queryByDataId.test.ts', () => {

  it('使用 TAXI 数据查 TAXI', async () => {
    const condition = {
      "originSource": 1,
      "id": DATA_IDS_Taxi[0],
      "targetSource": 1,
    }
    const res = await app.httpRequest()
      .post('/py/queryByDataId')
      .send(condition)
      .expect(200)
    assert(hasItem(res))
  });

  it('使用 TAXI 数据查 TAXI MODE_TIME', async () => {
    const condition = {
      "originSource": 1,
      "id": DATA_IDS_Taxi[0],
      "targetSource": 1,
      "mode": 1
    }
    const res = await app.httpRequest()
      .post('/py/queryByDataId')
      .send(condition)
      .expect(200)
    assert(hasItem(res))
  });

  it('使用 TAXI 数据查 TAXI MODE_GEO', async () => {
    const condition = {
      "originSource": 1,
      "id": DATA_IDS_Taxi[0],
      "targetSource": 1,
      "mode": 2
    }
    const res = await app.httpRequest()
      .post('/py/queryByDataId')
      .send(condition)
      .expect(200)
    assert(hasItem(res))
  });


  it('使用 TAXI 数据查 PHONE', async () => {
    const condition = {
      "originSource": 1,
      "id": DATA_IDS_Taxi[0],
      "targetSource": 0,
    }
    const res = await app.httpRequest()
      .post('/py/queryByDataId')
      .send(condition)
      .expect(200)
    assert(hasItem(res))
  });


  
  // it('使用 TAXI 数据查 WEIBO', async () => {  // 结果为空
  //   const condition = {
  //     "originSource": 1,
  //     "id": DATA_IDS_Taxi[0],
  //     "targetSource": 2,
  //   }
  //   const res = await app.httpRequest()
  //     .post('/py/queryByDataId')
  //     .send(condition)
  //     .expect(200)
  //   assert(hasItem(res))
  // });

  // it('使用 TAXI 数据查 POI', async () => {  // 结果为空
  //   const condition = {
  //     "originSource": 1,
  //     "id": DATA_IDS_Taxi[0],
  //     "targetSource": 3,
  //   }
  //   const res = await app.httpRequest()
  //     .post('/py/queryByDataId')
  //     .send(condition)
  //     .expect(200)
  //   assert(hasItem(res))
  // });

  it('使用 TAXI 数据查 WEIBO MODE_TIME', async () => {  // 结果为空
    const condition = {
      "originSource": 1,
      "id": DATA_IDS_Taxi[0],
      "targetSource": 2,
      "mode": 1
    }
    const res = await app.httpRequest()
      .post('/py/queryByDataId')
      .send(condition)
      .expect(200)
    assert(hasItem(res))
  });

  it('使用 TAXI 数据查 WEIBO MODE_GEO', async () => {  // 结果为空
    const condition = {
      "originSource": 1,
      "id": DATA_IDS_Taxi[0],
      "targetSource": 2,
      "mode": 2
    }
    const res = await app.httpRequest()
      .post('/py/queryByDataId')
      .send(condition)
      .expect(200)
    assert(hasItem(res))
  });

  it('使用 TAXI 数据查 POI MODE_GEO', async () => {  // 结果为空
    const condition = {
      "originSource": 1,
      "id": DATA_IDS_Taxi[0],
      "targetSource": 3,
      "mode": 2
    }
    const res = await app.httpRequest()
      .post('/py/queryByDataId')
      .send(condition)
      .expect(200)
    assert(hasItem(res))
  });



 it('使用 WEIBO 数据查 TAXI', async () => {
    const condition = {
      "originSource": 2,
      "id": DATA_IDS_Weibo[0],
      "targetSource": 1,
    }
    const res = await app.httpRequest()
      .post('/py/queryByDataId')
      .send(condition)
      .expect(200)
    assert(hasItem(res))
  });

 it('使用 WEIBO 数据查 WEIBO', async () => {
    const condition = {
      "originSource": 2,
      "id": DATA_IDS_Weibo[0],
      "targetSource": 2,
    }
    const res = await app.httpRequest()
      .post('/py/queryByDataId')
      .send(condition)
      .expect(200)
    assert(hasItem(res))
  });

 it('使用 WEIBO 数据查 PHONE', async () => {
    const condition = {
      "originSource": 2,
      "id": DATA_IDS_Weibo[0],
      "targetSource": 0,
    }
    const res = await app.httpRequest()
      .post('/py/queryByDataId')
      .send(condition)
      .expect(200)
    assert(hasItem(res))
  });

 it('使用 WEIBO 数据查 POI', async () => {
    const condition = {
      "originSource": 2,
      "id": DATA_IDS_Weibo[0],
      "targetSource": 3,
    }
    const res = await app.httpRequest()
      .post('/py/queryByDataId')
      .send(condition)
      .expect(200)
    assert(hasItem(res))
  });
});
