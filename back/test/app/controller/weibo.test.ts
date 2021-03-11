import * as assert from 'assert';
import { app } from 'egg-mock/bootstrap';
import { hasItem } from '../../util'
import { GEO, TIME } from '../../cond'

describe('test/app/controller/weibo.test.ts', () => {
  // it('GET /weibo', async () => {
  //   const result = await app.httpRequest().get('/poi').expect(200);
  //   assert(hasItem(result));
  // });

  it('POST /weibo 无条件', async () => {
    const res = await app.httpRequest()
      .post('/weibo')
      .send({})
      .expect(200)
    assert(hasItem(res))
  });

  it('POST /weibo geo1 ', async () => {
    const res = await app.httpRequest()
      .post('/weibo')
      .send({
        geo: GEO[2],
      })
      .expect(200)
    assert(hasItem(res))
  });

  it('POST /weibo time1 ', async () => {
    const res = await app.httpRequest()
      .post('/weibo')
      .send({
        time: TIME[2],
      })
      .expect(200)
    assert(hasItem(res))
  });

  it('POST /weibo geo1&time1 ', async () => {
    const res = await app.httpRequest()
      .post('/weibo')
      .send({
        geo: GEO[2],
        time: TIME[2]
      })
      .expect(200)
    assert(hasItem(res))
  });


  it('POST /weibo/py 无条件', async () => {
    const condition = {
      source: 2,
    }
    const res = await app.httpRequest()
      .post('/py/query')
      .send(condition)
      .expect(200)
    assert(hasItem(res))
  });

  it('POST /weibo/py geo1', async () => {
    const condition = {
      source: 2,
      attr: {
        S: GEO[2]
      }
    }
    const res = await app.httpRequest()
      .post('/py/query')
      .send(condition)
      .expect(200)
    assert(hasItem(res))
  });


  it('POST /weibo/py time1', async () => {
    const condition = {
      source: 2,
      attr: {
        T: TIME[2]
      }
    }
    const res = await app.httpRequest()
      .post('/py/query')
      .send(condition)
      .expect(200)
    assert(hasItem(res))
  });

  it('POST /weibo/py geo1&time1', async () => {
    const condition = {
      source: 2,
      attr: {
        T: TIME[2],
        S: GEO[2]
      }
    }
    const res = await app.httpRequest()
      .post('/py/query')
      .send(condition)
      .expect(200)
    assert(hasItem(res))
  });
});
