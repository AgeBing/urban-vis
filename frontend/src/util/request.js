/**
 * http 请求模块
 */

const baseUrl = 'http://127.0.0.1:7001/'  

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

export default {
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
  }
}