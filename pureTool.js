const isDate = (str="") => {
    return (str instanceof Date)	
}

const date2format = (str="") => {
	const TIME_ZONE = 3240 * 10000; // FOR KOREA TIME
	const d = strToDate(str)

	const date = new Date(+d + TIME_ZONE).toISOString().split('T')[0];
	const time = d.toTimeString().split(' ')[0];

	return date + ' ' + time
}

const strToDate = (str="") => {
    if(str == "") return new Date()
    return new Date(str)
}

const diffSec = (a="", b="") => {
    aDt = strToDate(a);
    bDt = strToDate(b);
    interval = aDt > bDt ? aDt.getTime() - bDt.getTime() : bDt.getTime() - aDt.getTime();
    return Math.floor(interval / 1000)
}
	

//salt와 str을 더해서 해시하고 base64 인코딩
const getEncodedHash = (str="", salt="") => {
    let newStr = salt + str.toString()
    let hash = SHA256(newStr)
    let base64 = btoa(hash)
    return base64
}

//함수 이름으로 실행
const executeFunctionByName = (functionName, context /*, args */) => {
    var args = Array.prototype.slice.call(arguments, 2);
    var namespaces = functionName.split(".");
    var func = namespaces.pop();
    for(var i = 0; i < namespaces.length; i++) {
      context = context[namespaces[i]];
    }
    return context[func].apply(context, args);
  }

// true인지 아닌지
// true, "true", "True", "TRUE", 1, '1'
const isTrue = (value) => { 
    //ERR : FALSE
    if(typeof value == "undefined") return false
    if(typeof value == "boolean") return value
    if(typeof value === 'string'){
        if(value.toLowerCase() == 'true') return true
        if(value == '1') return true
        return false
    } 
    return !!value
}

// 값이 없는지 있는지
const isNone = (value) =>{
    if(typeof value == "undefined") return true
    if(typeof value === 'string'){
        value = value.toLowerCase()
        if(value == 'null' || value == 'none' || value =='' ) return true
    }
    return false
}

// 배열인지 아닌지
const isArray = (array = "") =>{
    return Array.isArray(array)
}

// 배열 완전 복사 (복사 후 기존 배열에 영향을 끼치지 않도록 함)
const deepCopy = (object) =>{
    return JSON.parse(JSON.stringify(object))
}

/*
baseJA = [{
           key : 1,
           value1 : "a",
           value2 : "b" 
        },
    {
           key : 5,
           value1 : "a",
           value2 : "b" 
        }
    ]
        updateJA = [
            {
                key : 4,
                value3 : "h",
                value4 : "j"
            },
            {
                key : 7,
                value1 : "a",
                value3 : "k",
                value4 : "j"
            },
            {
                key : 3,
                value3 : "Cd",
                value4 : "Cg"
            },
            {
                myKey : 5,
                value3 : "C",
                value4 : "C",
                "json" : {
                    "a" : 1,
                    "json" : {
                        "b" : 2
                    }
                }
            },
            {
                key : 1,
                value1 : "z",
                value3 : "d",
                value4 : "e"
            }
        ]
*/

// 두 JSON 배열을 특정 키 값 기준으로 base에 합친다. 합치는 방식은 함수 아래 주석 참조
const joinJSONArr = (baseJA, updateJA, uniqueKey, uniqueKeyInUpdate) => {  
    //base의 키가 유니크하지 않은 경우 : 전부 업데이트
    //update의 키가 유니크 하지 않은 경우 : update 배열의 가장 앞쪽 걸로 업데이트하고 뒤는 보지 않는다.
    //base와 update가 동일한 키, 다른 value라면 update것으로 완전 덮어 쓰게 됨.
    //update 내부에 base에 없는 키가 있다면 update것을 추가함.
    //update에서 uniqueKey와 다른 키 이름으로 base를 참조하는 경우, uniqueKeyInUpdate를 지정 해 주면 됨.
    if(typeof uniqueKeyInUpdate == "undefined") uniqueKeyInUpdate = uniqueKey
    if(isNone(uniqueKey)) return baseJA
    if(!isArray(baseJA) || !isArray(updateJA)){
        console.log("base or update is not array")
        return baseJA
    } 
    let retBase = deepCopy(baseJA)
    const _KEY = 0
    const _VALUE = 1
    
    for(var i in retBase){
        for(var j in updateJA){
            if(!isNone(retBase[i][uniqueKey]) && !isNone(updateJA[j][uniqueKeyInUpdate]) 
                && retBase[i][uniqueKey] === updateJA[j][uniqueKeyInUpdate]){
                let arr_2 = Object.entries(updateJA[j]) //2차원 배열 [ [key, value], ...  ]
                for(var k in arr_2){
                    //if(arr_2[k][_KEY] != unique){
                        retBase[i][arr_2[k][_KEY]] = arr_2[k][_VALUE] 
                    //}
                }
                break; //찾았으면 종료, 더이상 append 하지 않음
            }
        }
    }
    return retBase
}

// JSON 배열에서 value를 기준으로 JSON 값을 찾아낸다
const getJSONFromJSONArr = (jsonArr, unique, value) =>{
    if(!isArray(jsonArr) || isNone(unique) || isNone(value)) return {};
    for(var i in jsonArr){
        if(jsonArr[i][unique] == value) return jsonArr[i]
    }
    return {};
}

// JSON 배열에서 Value로 찾아서 삭제 후 리턴
// deep copy 안함
const popJSONFromJSONArr = (jsonArr, key, uniqueValue) =>{
    if(!isArray(jsonArr) || isNone(key) || isNone(uniqueValue)) return {};
    for(var i in jsonArr){
        if(jsonArr[i][key] == uniqueValue){
            return jsonArr.splice(i, 1); 
        } 
    }
    return {};
}

/*
updateJA = [
            {key : 4,value3 : "h",value4 : "C"},
            {key : 7,value1 : "a",value3 : "k",value4 : "j"},
            {key : 3,value3 : "Cd",value4 : "Cg"},
            {myKey : 5,value3 : "C",value4 : "C","json" : { "a" : 1, "json" : { "b" : 2 }}},
            {key : 1,value1 : "z",value3 : "d",value4 : "e"}
        ]
        delJSONFromJSONArr(updateJA, "value4", "C")
        popJSONFromJSONArr(updateJA, "value4", "Cg")
*/

// JSON 배열에서 Value로 찾아서 삭제 후 삭제한 개수 리턴
// deep copy 안함
const delJSONFromJSONArr = (jsonArr, key, value) =>{
    if(!isArray(jsonArr) || isNone(key) || isNone(value)) return {};
    let cnt = 0
    for(var i in jsonArr){
        if(jsonArr[i][key] == value){
            cnt++
            jsonArr.splice(i, 1); 
        } 
    }
    return cnt;
}

// a와 b를 문자열로 비교한다. sort 함수를 위해 true, false로 나오지 않음
const compare = (a, compareStr, b) => {
    if(compareStr == "==" || compareStr == "=" || compareStr == "same"){
        return (a == b)
    } else if(compareStr == "<" || compareStr == "small" || compareStr == "little"){
        return a < b
    } else if(compareStr == ">" || compareStr == "large" || compareStr == "big" || compareStr == "many"){
        return b < a 
    } else {
        return false;
    }
}

/*
 myJA = [{bt:80, age:21, key:168}, {bt:80, age:20, key:168}, {bt:80, age:21, key:167}, {bt:80, age:21, key:168}, {bt:80, age:19, key:166}, {bt:90, age:23, key:168}, {bt:90, age:22, key:160}, {bt:90, age:22, key:169}, {bt:70, age:25, key:169}]
 sortJSONArr(myJA, ["bt", "age", "key"], ["big", "small", "large"])
 sortJSONArr(myJA, ["bt"], [">"])
*/
// json 배열을 우선 순위에 따라 정렬한다. 
const sortJSONArr = (jsonArr, keyArr = [], sortArr = []) =>{
    if(!isArray(jsonArr)) return jsonArr
    let retJA = deepCopy(jsonArr)
   retJA.sort( (a, b) => { 
        for(var i in keyArr){
            if(a[keyArr[i]] === b[keyArr[i]]){
                continue;
            } 
            let comp = compare(a[keyArr[i]],sortArr[i],b[keyArr[i]])
            if(comp) return -1;
            return 1;
        }
    })
    return retJA
}

// Hash 함수
const SHA256 = (s) =>{
	 
    var chrsz   = 8;
    var hexcase = 0;
 
    function safe_add (x, y) {
        var lsw = (x & 0xFFFF) + (y & 0xFFFF);
        var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
    }
 
    function S (X, n) { return ( X >>> n ) | (X << (32 - n)); }
    function R (X, n) { return ( X >>> n ); }
    function Ch(x, y, z) { return ((x & y) ^ ((~x) & z)); }
    function Maj(x, y, z) { return ((x & y) ^ (x & z) ^ (y & z)); }
    function Sigma0256(x) { return (S(x, 2) ^ S(x, 13) ^ S(x, 22)); }
    function Sigma1256(x) { return (S(x, 6) ^ S(x, 11) ^ S(x, 25)); }
    function Gamma0256(x) { return (S(x, 7) ^ S(x, 18) ^ R(x, 3)); }
    function Gamma1256(x) { return (S(x, 17) ^ S(x, 19) ^ R(x, 10)); }
 
    function core_sha256 (m, l) {
        
        var K = new Array(0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1, 
            0x923F82A4, 0xAB1C5ED5, 0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3, 
            0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174, 0xE49B69C1, 0xEFBE4786, 
            0xFC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA, 
            0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3, 0xD5A79147, 
            0x6CA6351, 0x14292967, 0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13, 
            0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85, 0xA2BFE8A1, 0xA81A664B, 
            0xC24B8B70, 0xC76C51A3, 0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070, 
            0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A, 
            0x5B9CCA4F, 0x682E6FF3, 0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208, 
            0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2);

        var HASH = new Array(0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19);

        var W = new Array(64);
        var a, b, c, d, e, f, g, h, i, j;
        var T1, T2;
 
        m[l >> 5] |= 0x80 << (24 - l % 32);
        m[((l + 64 >> 9) << 4) + 15] = l;
 
        for ( var i = 0; i<m.length; i+=16 ) {
            a = HASH[0];
            b = HASH[1];
            c = HASH[2];
            d = HASH[3];
            e = HASH[4];
            f = HASH[5];
            g = HASH[6];
            h = HASH[7];
 
            for ( var j = 0; j<64; j++) {
                if (j < 16) W[j] = m[j + i];
                else W[j] = safe_add(safe_add(safe_add(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])), W[j - 16]);
 
                T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]);
                T2 = safe_add(Sigma0256(a), Maj(a, b, c));
 
                h = g;
                g = f;
                f = e;
                e = safe_add(d, T1);
                d = c;
                c = b;
                b = a;
                a = safe_add(T1, T2);
            }
 
            HASH[0] = safe_add(a, HASH[0]);
            HASH[1] = safe_add(b, HASH[1]);
            HASH[2] = safe_add(c, HASH[2]);
            HASH[3] = safe_add(d, HASH[3]);
            HASH[4] = safe_add(e, HASH[4]);
            HASH[5] = safe_add(f, HASH[5]);
            HASH[6] = safe_add(g, HASH[6]);
            HASH[7] = safe_add(h, HASH[7]);
        }
        return HASH;
    }
 
    function str2binb (str) {
        var bin = Array();
        var mask = (1 << chrsz) - 1;
        for(var i = 0; i < str.length * chrsz; i += chrsz) {
            bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i%32);
        }
        return bin;
    }
 
    function Utf8Encode(string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";
 
        for (var n = 0; n < string.length; n++) {
 
            var c = string.charCodeAt(n);
 
            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
 
        }
 
        return utftext;
    }
 
    function binb2hex (binarray) {
        var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
        var str = "";
        for(var i = 0; i < binarray.length * 4; i++) {
            str += hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8+4)) & 0xF) +
            hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8  )) & 0xF);
        }
        return str;
    }
 
    s = Utf8Encode(s);
    return binb2hex(core_sha256(str2binb(s), s.length * chrsz));
 
}
