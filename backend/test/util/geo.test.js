const assert = require("assert")
const mock = require("egg-mock")
const geoUtil = require("../../app/util/geo")

describe('test/service/geo.test.js', ()=>{

  it('isPointInRegion', async ()=>{
    const p = [118.12520442517472, 24.457112968661107]

    const region = [
        [118.10001348684655, 24.49312168608001],
        [118.10189360177104, 24.440164488229374],
        [118.15749209838508, 24.44354654543104],
        [118.16472358617017, 24.498263208475073],
        [118.10001348684655, 24.49312168608001]
    ]
    const res = geoUtil.isPointInRegion(p, region)
    assert(res)
  })
})