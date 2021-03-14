import * as assert from 'assert';
import { app } from 'egg-mock/bootstrap';

describe('test/app/controller/queryByDataId.test.ts', () => {

  /**
    使用同一个条件查前后端两个接口看返回的条件是否一样
 */

  it('使用 TAXI 数据查 TAXI', async () => {
    const condition = {
      "id": "浙CT0431.LOG",
      "originSource": 1,
      "targetSource": 1,
    }
  
    const res1 = await app.httpRequest()
      .post('/py/queryByDataId')
      .send(condition)
      .expect(200)

    const res2 = await app.httpRequest()
      .post('/queryByDataId')
      .send(condition)
      .expect(200)

    assert(res1.body.length === res2.body.length)
  });

  it('使用 TAXI 数据查 PHONE', async () => {
    const condition = {
      "id": "浙CT0431.LOG",
      "originSource": 1,
      "targetSource": 0,
    }
  
    const res1 = await app.httpRequest()
      .post('/py/queryByDataId')
      .send(condition)
      .expect(200)

    const res2 = await app.httpRequest()
      .post('/queryByDataId')
      .send(condition)
      .expect(200)

    assert(res1.body.length === res2.body.length)
  });

  it('使用 TAXI 数据查 WEIBO', async () => {
    const condition = {
      "id": "浙CT0431.LOG",
      "originSource": 1,
      "targetSource": 2,
    }
  
    const res1 = await app.httpRequest()
      .post('/py/queryByDataId')
      .send(condition)
      .expect(200)

    const res2 = await app.httpRequest()
      .post('/queryByDataId')
      .send(condition)
      .expect(200)

    assert(res1.body.length === res2.body.length)
  });



  it('使用 PHONE 数据查 PHONE', async () => {
    const condition = {   
      "id": "460006741429772",
      "mode":0,
      "originSource":0,
      "targetSource":0
    }
  
    const res1 = await app.httpRequest()
      .post('/py/queryByDataId')
      .send(condition)
      .expect(200)

    const res2 = await app.httpRequest()
      .post('/queryByDataId')
      .send(condition)
      .expect(200)

    assert(res1.body.length === res2.body.length)
  });

  it('使用 PHONE 数据查 TAXI', async () => {
    const condition = {   
      "id": "460006741429772",
      "mode":0,
      "originSource":0,
      "targetSource":1
    }
  
    const res1 = await app.httpRequest()
      .post('/py/queryByDataId')
      .send(condition)
      .expect(200)

    const res2 = await app.httpRequest()
      .post('/queryByDataId')
      .send(condition)
      .expect(200)

    assert(res1.body.length === res2.body.length)
  });

  it('使用 PHONE 数据查 WEIBO', async () => {
    const condition = {   
      "id": "460006741429772",
      "mode":0,
      "originSource":0,
      "targetSource":2
    }

    const res1 = await app.httpRequest()
      .post('/py/queryByDataId')
      .send(condition)
      .expect(200)

    const res2 = await app.httpRequest()
      .post('/queryByDataId')
      .send(condition)
      .expect(200)

    assert(res1.body.length === res2.body.length)
  });

  it('使用 PHONE 数据查 POI', async () => {
    const condition = {   
      "id": "460006741429772",
      "mode":0,
      "originSource":0,
      "targetSource":3
    }

    const res1 = await app.httpRequest()
      .post('/py/queryByDataId')
      .send(condition)
      .expect(200)

    const res2 = await app.httpRequest()
      .post('/queryByDataId')
      .send(condition)
      .expect(200)

    assert(res1.body.length === res2.body.length)
  });

});
