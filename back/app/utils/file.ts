const fs = require('fs');
const path = require('path');
let DATA_SOURCE_PATH = ''
const setPath = (path:string) => {
  console.log(`SET DATA SOURCE PATH ${path}`)
  DATA_SOURCE_PATH = path
}
const getPath = () => {
  console.log(`GET DATA SOURCE PATH ${DATA_SOURCE_PATH}`)
  return DATA_SOURCE_PATH
}
/**
 * 读取 .json 文件
 * @param file 文件名
 */
async function readJson(file) {
  return new Promise((resolve, reject) => {
    const filePath = path.resolve(__dirname, DATA_SOURCE_PATH + file);
	  	fs.readFile(filePath, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(data));
      }
    });
  });
}

module.exports = {
  readJson,
  setPath
};
