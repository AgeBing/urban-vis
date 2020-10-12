const assert = require("assert")
const timeUtil = require("../../app/util/time")

describe('test/service/time.test.js', ()=>{

  it('isInTimeInterval', async ()=>{
    const time = '2020-06-18 13:40:28'
    const timeInterval = [
        '2020-06-18 00:48:44',
        '2020-06-18 14:48:44',
    ]
    const res = timeUtil.isInTimeInterval(time, timeInterval)
    assert(res)
  })
})