import * as assert from 'assert';
import { app } from 'egg-mock/bootstrap';
import { hasItem } from '../../util'
import { GEO } from '../../cond'

describe('test/app/controller/poi.test.ts', () => {
  // it('GET /poi', async () => {
  //   const result = await app.httpRequest().get('/poi').expect(200);
  //   assert(hasItem(result));
  // });


  it('POST /poi 无条件', async () => {
    const res = await app.httpRequest()
      .post('/poi')
      .send({})
      .expect(200)
    assert(hasItem(res))
  });

  it('POST /poi geo1', async () => {
    const res = await app.httpRequest()
      .post('/poi')
      .send({
        geo: GEO[0],
      })
      .expect(200)
    assert(hasItem(res))
  });

  it('POST /poi geo2', async () => {
    const res = await app.httpRequest()
      .post('/poi')
      .send({
        geo: GEO[2],
      })
      .expect(200)
    assert(hasItem(res))
  });


  it('POST /poi keyword', async () => {
    const res = await app.httpRequest()
      .post('/poi')
      .send({
        keyword: '医院'
      })
      .expect(200)
    assert(hasItem(res))
  });

  it('POST /poi/py 无条件', async () => {
    const condition = {
      source: 3,
    }
    const res = await app.httpRequest()
      .post('/py/query')
      .send(condition)
      .expect(200)
    assert(hasItem(res))
  });

  it('POST /poi/py geo1', async () => {
    const condition = {
      source: 3,
      attr: {
        S: GEO[0]
      }
    }
    const res = await app.httpRequest()
      .post('/py/query')
      .send(condition)
      .expect(200)
    assert(hasItem(res))
  });

  it('POST /poi/py geo2', async () => {
    const condition = {
      source: 3,
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
});
