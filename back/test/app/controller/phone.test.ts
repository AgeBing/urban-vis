import * as assert from 'assert';
import { app } from 'egg-mock/bootstrap';
import { hasItem } from '../../util'
import { GEO, TIME } from '../../cond'


describe('test/app/controller/taxi.test.ts', () => {
  it('POST /phone 无条件', async () => {
    const res = await app.httpRequest()
      .post('/phone')
      .send({})
      .expect(200)
    assert(hasItem(res))
  });


  it('POST /phone geo1', async () => {
    const res = await app.httpRequest()
      .post('/phone')
      .send({
        geo: GEO[2],
      })
      .expect(200)
    assert(hasItem(res))
  });

  it('POST /phone time1', async () => {
    const res = await app.httpRequest()
      .post('/phone')
      .send({
        time: TIME[2],
      })
      .expect(200)
    assert(hasItem(res))
  });

  it('POST /phone geo1&time1', async () => {
    const res = await app.httpRequest()
      .post('/phone')
      .send({
        geo: GEO[2],
        time: TIME[2],
      })
      .expect(200)
    assert(hasItem(res))
  });




  it('POST /phone/py 无条件', async () => {
    const res = await app.httpRequest()
      .post('/py/query')
      .send({
        source: 0,
      })
      .expect(200)
    assert(hasItem(res))
  });

  it('POST /phone/py geo1', async () => {
    const res = await app.httpRequest()
      .post('/py/query')
      .send({
        source: 0,
        attr: {
          S: GEO[2]
        }
      })
      .expect(200)
    assert(hasItem(res))
  });

  it('POST /phone/py time1', async () => {
    const res = await app.httpRequest()
      .post('/py/query')
      .send({
        source: 0,
        attr: {
          T: TIME[2]
        }
      })
      .expect(200)
    assert(hasItem(res))
  });

  it('POST /phone/py geo1&time1', async () => {
    const res = await app.httpRequest()
      .post('/py/query')
      .send({
        source: 0,
        attr: {
          T: TIME[2],
          S: GEO[2]
        }
      })
      .expect(200)
    assert(hasItem(res))
  });
});
