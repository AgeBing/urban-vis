const fileUtil = require('../app/util/file')


const getAllWeiboFile = async () => {
  const weiboDir = 'weibo3utf8'
  const files = []
  fileUtil.travel(weiboDir, (pathname) => {
    let dataCondition = true
    // let dataCondition = pathname.includes('6_18')
    dataCondition && files.push(pathname)
  })
  return files
}

const readWeiboData = async () => {
  const files = await getAllWeiboFile()
  const ps = files.map(async (f) => {
    const data = await fileUtil.file(f)
    return data
  })
  const datas = await Promise.all(ps)
  return datas.reduce((a ,b) => b.concat(a))
}


module.exports = {
  readWeiboData
}