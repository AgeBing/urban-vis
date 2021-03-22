const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv')
dotenv.config()
const DATA_SOURCE_PATH = process.env.DATA_CASEVERSION_PATH
// '../../../data/node-server-data-older/';
console.log("DATA_SOURCE_PATH",DATA_SOURCE_PATH)
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
};
