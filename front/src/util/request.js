/**
 * http 请求模块
 */

const HOST = 'http://127.0.0.1'
const PORT = '7001'
const baseUrl = `${HOST}:${PORT}/`  

function httpGet(url) {
  return new Promise((rs, rj) => {
    const res = fetch(url)
    res.then(
      (res) => {
        return res.json()
      },
      (err) => {
        console.error(err)
        rj(res)
      }
    )
    .then(
      (res) => rs(res),
      (err) => {
        console.error(err)
        rj(res)
      }
    )
  })
}

function httpPost(url, data){
  return new Promise((rs, rj) => {
    const res = fetch(url,{
      method: 'POST',
      body: JSON.stringify(data),
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    })
    res.then(
      (res) => {
        return res.json()
      },
      (err) => {
        console.error(err)
        rj(res)
      }
    )
    .then(
      (res) => rs(res),
      (err) => {
        console.error(err)
        rj(res)
      }
    )
  })
}

const api = {
  getPOI(){
    const url = baseUrl + 'poi'
    return httpGet(url)
  },
  getTaxi(){
    const url = baseUrl + 'taxi'
    return httpGet(url) 
  },
  getWeibo(){
    const url = baseUrl + 'weibo'
    return httpGet(url)
  },
  queryTaxi( data ){
    if(!data) return this.getTaxi()
    console.log(data)
    return httpPost(baseUrl + 'taxi' , data)
  },
  getRoad(){
    const url = baseUrl + 'road'
    return httpGet(url) 
  },
  getCross(){
    const url = baseUrl + 'cross'
    return httpGet(url) 
  },
  getCrossStatics(){
    const url = baseUrl + 'crossStatics'
    return httpGet(url) 
  },
  getBlocks(){
    const url = baseUrl + 'block'
    return httpGet(url)
  }
}

export default api