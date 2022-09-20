const fs = require('fs')
const axios = require("axios")
const crypto = require('crypto')

//salt와 str을 합쳐서 해시 후 base64 인코딩
const getEncodedHash = (str="", salt="") => {
    let newStr = salt + str.toString()
    let hash = crypto.createHash('sha256').update(newStr).digest('base64');
    return hash
}

//호출자의 공인 IP를 얻어온다
async function getMyIP(){
    const response = await axios.get('https://api.ipify.org');
    const data = response.data; 
    if(!net.isIPv4(data)){
      data = '4.4.4.4'
    }
    return data;
  }
  
//특정 디렉토리의 파일들을 검색해 배열로 리턴
const ls = function(dir) {
    var results = [];
    var list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = dir + '/' + file;
        var stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            /* Recurse into a subdirectory */
            results = results.concat(ls(file));
        } else { 
            /* Is a file */
            file_type = file.split(".").pop();
            file_name = file.split(/(\\|\/)/g).pop();
            file = file.replace(/\\/gi,"/"); // for windows
            results.push({"fullPath":file, "type":file_type, "filename":file_name});
        }
    });
    return results;
  }

// express request 를 기반으로 IP를 리턴 
function getIPFromReq(req){
    return ip = req.headers['x-forwarded-for'] ||
     req.socket.remoteAddress ||
     null;
}

// 냅다 실행 후 setInterval  
const startInterval = (callback, ms) => // awiat startInterval(myFunction, 1000)
{ 
    callback(); 
    return setInterval(callback, ms); 
}

// delay만큼 쉬기
const _sleep = (delay) => // awiat sleep(ms)
new Promise((resolve) => setTimeout(resolve, delay)); 

module.exports = {
    ls,
    _sleep,
    startInterval,
    getIPFromReq,
    getMyIP,
    getEncodedHash
}