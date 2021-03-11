/**
 * 返回结果中是否有数字
 */
export const hasItem = (res) => {
  if(Array.isArray(res.body) && res.body.length > 0){
    console.log("Return Items Length :", res.body.length)
    return true
  }
  return false
}