const fs = require('fs');
const path = require('path');
const iconv = require('iconv-lite');
const csv = require('csv-parser')
const PATH = '../../data/'

const readCsv = (file) => {
  return new Promise(( resolve, reject ) => {
    let res = []
    let filePath =  path.resolve(__dirname,  PATH + file);
    fs.createReadStream( filePath )
      .pipe(csv())
      .on('data', (data) => res.push(data))
      .on('end', () => {
          resolve(res)
      })
  })
}

const readFile = (file) => {
  return new Promise((rs, rj) => {
    let filePath =  file.includes('/data') ?  file : path.resolve(__dirname,  PATH + file);
    fs.readFile(filePath, 'utf-8', function(err, data) {
      if (err) rj(err)
      // 解决中文编码乱码问题 https://github.com/ashtuchkin/iconv-lite
      // let s = data
      // s = s.replace(/\'/g, '"')  
      // console.log(data)
      try{
        data =  JSON.parse(data)
        rs(data)
      }catch(e){
        console.log(`Parse ${file} Error`)
        rs([])
      }
    });  
  })

}

/**
 * 读取 dir 下的文件
 * @param {*} dir 
 * @param {*} callback 
 */
const travel = (dir, callback) => {
  dir =  path.resolve(__dirname,  PATH + dir);
  fs.readdirSync(dir).forEach((file)=>{
    var pathname = path.join(dir, file)
    if(fs.statSync(pathname).isDirectory()){
      travel(pathname, callback)
    }else{
      callback(pathname)
    }
  })
}

const travelForCsvFile = () =>{
  const files = []
  const dir = PATH
  travel(dir, (fileName) => {
    fileName.includes('csv') && files.push(fileName)
  })
  return files
}


function writeJson( file , data ){
	data = JSON.stringify(data);
  let filePath =  path.resolve(__dirname,  PATH + file);
	fs.writeFileSync(filePath , data);
}

async function readJson(file) {
	return new Promise(( resolve, reject ) => {
      let filePath =  path.resolve(__dirname,  PATH + file);
	  	fs.readFile(filePath , (err, data) => {
				if (err) {
		        reject( err )
	      	} else {
	     		resolve( JSON.parse(data) )
	        }
		})
	  })
}

module.exports = {
  csv : readCsv,
  file: readFile,
  csvFiles: travelForCsvFile,
  travel,
  jsonWrite: writeJson,
  jsonRead: readJson
}