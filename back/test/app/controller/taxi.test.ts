import * as assert from 'assert';
import { app } from 'egg-mock/bootstrap';
import { hasItem } from '../../util'
import { GEO, TIME } from '../../cond'


describe('test/app/controller/taxi.test.ts', () => {
  it('POST /taxi 无条件', async () => {
    const res = await app.httpRequest()
      .post('/taxi')
      .send({})
      .expect(200)
    assert(hasItem(res))
  });


  it('POST /taxi geo1', async () => {
    const res = await app.httpRequest()
      .post('/taxi')
      .send({
        geo: GEO[2],
      })
      .expect(200)
    assert(hasItem(res))
  });

  it('POST /taxi time1', async () => {
    const res = await app.httpRequest()
      .post('/taxi')
      .send({
        time: TIME[2],
      })
      .expect(200)
    assert(hasItem(res))
  });

  it('POST /taxi geo1&time1', async () => {
    const res = await app.httpRequest()
      .post('/taxi')
      .send({
        geo: GEO[2],
        time: TIME[2],
      })
      .expect(200)
    assert(hasItem(res))
  });




  it('POST /taxi/py 无条件', async () => {
    const res = await app.httpRequest()
      .post('/py/query')
      .send({
        source: 1,
      })
      .expect(200)
    assert(hasItem(res))
  });

  it('POST /taxi/py geo1', async () => {
    const res = await app.httpRequest()
      .post('/py/query')
      .send({
        source: 1,
        attr: {
          S: GEO[2]
        }
      })
      .expect(200)
    assert(hasItem(res))
  });

  it('POST /taxi/py time1', async () => {
    const res = await app.httpRequest()
      .post('/py/query')
      .send({
        source: 1,
        attr: {
          T: TIME[2]
        }
      })
      .expect(200)
    assert(hasItem(res))
  });

  it('POST /taxi/py geo1&time1', async () => {
    const res = await app.httpRequest()
      .post('/py/query')
      .send({
        source: 1,
        attr: {
          T: TIME[2],
          S: GEO[2]
        }
      })
      .expect(200)
    assert(hasItem(res))
  });
});
