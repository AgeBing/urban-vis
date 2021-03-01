const fs = require('fs');
const path = require('path');

const DATA_SOURCE_PATH = '../../../data/node-server-data/'

/**
 * 读取 .json 文件
 * @param file 文件名
 */
async function readJson(file) {
	return new Promise(( resolve, reject ) => {
      let filePath = path.resolve(__dirname,  DATA_SOURCE_PATH + file)
	  	fs.readFile(filePath , (err, data) => {
      if (err) {
          reject( err )
        } else {
        resolve( JSON.parse(data))
      }
		})
	})
}

module.exports = {
  readJson: readJson
}