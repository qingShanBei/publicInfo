import 'whatwg-fetch';
import 'es6-promise';
import CryptoJS from 'crypto-js';
import { COMMONKEY } from './SecretKey'
import md5 from 'md5'
import $ from 'jquery'
//import { type } from 'os';

//AES加密传输参数：post
function AESEncryptionBody(paramsObj, CRYPTOJSKEY = COMMONKEY, SecurityLevel, content_type) {//加密所使用的的key，需要与服务器端的解密key相对应
    if (content_type === 'json') {
        //let body = JSON.stringify(paramsObj);
        let plain = JSON.stringify(paramsObj);//json序列化
        // if (SecurityLevel === 4) {
        //     plain = getSign(paramsObj, CRYPTOJSKEY, randomString, 'post');
        // }

        // console.log(decrypt(encrypt(plain,CRYPTOJSKEY)))
        if (SecurityLevel === 3 || SecurityLevel === 4) {
            plain =JSON.stringify({ p: encrypt(plain, CRYPTOJSKEY) });
        }
        
        return plain;
    } else {
        //let body = JSON.stringify(paramsObj);
        let plain = $.param(paramsObj);//json序列化
        // if (SecurityLevel === 4) {
        //     plain = getSign(paramsObj, CRYPTOJSKEY, randomString, 'post');
        // }

        // console.log(decrypt(encrypt(plain,CRYPTOJSKEY)))
        if (SecurityLevel === 3 || SecurityLevel === 4) {
            plain = $.param({ p: encrypt(plain, CRYPTOJSKEY) });
        }

        return plain;
    }
}
//AES加密传输参数：get
function AESEncryptionUrl(url, CRYPTOJSKEY = COMMONKEY, SecurityLevel) {//加密所使用的的key，需要与服务器端的解密key相对应
    let newUrl = url;
    let urlArray = url.split('?');
    let params = urlArray[1];
    let host = urlArray[0];

    if (SecurityLevel === 3 || SecurityLevel === 4) {
        newUrl = host + '?p=' + encrypt(params, CRYPTOJSKEY);//参数加密处理
    }

    return newUrl;
}

//请求安全，根据安全级别SecurityLevel返回token+签名
function requestSecure(params, securityKey, SecurityLevel = 1) {
    let token = sessionStorage.getItem('token')||getQueryVariable('lg_tk');
    let Autorization = null;

    if (!token && SecurityLevel !== 1) {
        console.log('token无效，请重新登录');//后期会进行无token的事件操作
        return;
    }

    if (SecurityLevel === 1) {//级别1为不做任何安全认证
        return Autorization;
    } else if (SecurityLevel === 2) {//级别2为带上token
        Autorization = "X-Token=" + token;
    } else if (SecurityLevel === 3) {//级别2为带上token和签名
        Autorization = "X-Token=" + token + '&sign=' + getSign(token, params, securityKey);
    } else if (SecurityLevel === 4) {//级别4为带上token+随机字符串+时间戳+签名
        let timeStamp = formatDate('http://192.168.2.248:8075/Global/GetTimestramp');//生成统一的时间戳
        let randomString = getRandomString(8, timeStamp);
        Autorization = "X-Token=" + token + '&randomString=' + randomString + '&sign=' + getSign(token, params, securityKey, randomString);
    } else {
        console.log('SecurityLevel有误，请重新设置');
    }
    //console.log(Autorization)
    return Autorization;
}

//生成随机字符串和时间戳(前端本地时间)
function getRandomString(len, timeStamp) {
    len = len || 8;//默认8位

    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    let $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    let maxPos = $chars.length;
    let randomStr = '';
    for (let i = 0; i < len; i++) {
        randomStr += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return randomStr + timeStamp;
}

function getSign(token, params, securityKey, randomString) {  // 获取签名   返回一个包含"?"的参数串
    try {

        let param = handleParam(params);//处理params,返回序列化后的params
        // if (method === 'get') {
        //     // 判断是否有参数
        //     if (param != null && param.length > 0) {
        //         param = "randomString=" + randomString + "&" + param;
        //     } else {
        //         param = "randomString=" + randomString;
        //     }
        //     return "?randomString=" + randomString + "&sign=" + calculateSign(param, securityKey);
        // } else if (method === 'post') {
        //     param['randomString'] = randomString;
        //     let newParam = $.param(param);//JSON序列化为字符串：a=1&b=2
        //     let sign = calculateSign(newParam, securityKey, token, randomString);
        //     //return JSON.stringify(param);
        //     return newParam + '&' + sign;
        // }
        let sign = calculateSign(param, securityKey, token, randomString);
        return sign;
    }
    catch (err) {
        console.log(err);
    }

}


// 生成sign
function calculateSign(param, securityKey, token, randomString) {//等级3时是不需要randomString
    // if ('string' === typeof param) {//参数一般都是string
    //     let params = param.split("&");
    //     param = params.sort().join("").replace(/=/g, "");
    // } else {
    //     param = JSON.stringify(param);
    // }

    console.info(param);

    return md5(token + param + securityKey + randomString);//签名顺序：token + 参数 + 秘钥 + randomString
}


//格式化日期,
function formatDate(url) {
    let date = new Date();
    let fmt = 'yyyyMMddHH'
    var o = {
        "M+": date.getMonth() + 1,                 //月份
        "d+": date.getDate(),                    //日
        "H+": date.getHours(),                   //小时
        "m+": date.getMinutes(),                 //分
        "s+": date.getSeconds(),                 //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));

    let nonce = fetch(url, {
        method: 'get',//*post、get、put、delete，此项为请求方法相关的配置
        mode: 'no-cors',//no-cors(跨域模式但服务器端不支持cors),*cors(跨域模式，需要服务器通过Access-control-Allow-Origin来
        //允许指定的源进行跨域),same-origin(同源)
        cache: 'no-cache',//*no-cache,default,reload,force-cache,only-ifcached,此项为缓存相关配置
        credentials: 'include',//*include(携带cookie)、same-origin(cookie同源携带)、omit(不携带)

        headers: {
            'Accept': 'application/json, text/plain, */*',//请求头，代表的、发送端（客户端）希望接收的数据类型
            'Content-Type': 'application/x-www-form-urlencodeed',//实体头，代表发送端（客户端|服务器）发送的实体数据的数据类型
        },
        redirect: 'follow',//manual、*follow(自动重定向)、error，此项为重定向的相关配置
        // referrer: 'no-referrer',//该首部字段会告知服务器请求的原始资源的URI
        // 注意post时候参数的形式  
    })


    console.log(nonce)
    return nonce;
}
// 加密
function encrypt(plaintText, CRYPTOJSKEY) {
    var options = {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    };
    var key = CryptoJS.enc.Utf8.parse(CRYPTOJSKEY);
    var encryptedData = CryptoJS.AES.encrypt(plaintText, key, options);
    var encryptedBase64Str = encryptedData.toString().replace(/\//g, "_");
    encryptedBase64Str = encryptedBase64Str.replace(/\+/g, "-");
    return encryptedBase64Str;
};
//解密
// eslint-disable-next-line
function decrypt(encryptedBase64Str, CRYPTOJSKEY) {
    // eslint-disable-next-line
    var vals = encryptedBase64Str.replace(/\-/g, '+').replace(/_/g, '/');
    var options = {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    };
    var key = CryptoJS.enc.Utf8.parse(CRYPTOJSKEY);
    var decryptedData = CryptoJS.AES.decrypt(vals, key, options);
    var decryptedStr = CryptoJS.enc.Utf8.stringify(decryptedData);
    return decryptedStr
};

//解析是get或post传进来的是url还是param，返回序列化字符串
function handleParam(params) {
    console.log(typeof params)
    let param = '';
    if ('string' == typeof params) {
        let urlArray = params.split('?');
        param = urlArray[1];

    } else if ('object' == typeof params) {
        param = $.param(params)
    } else {
        console.log('参数不合法')
    }
    return param;
}


//获取url参数
function getQueryVariable(variable) {
    var query = window.location.search.substring(1) || window.location.href.split('?')[1]||window.location.href;

    console.log(query)
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] === variable) { return pair[1]; }
    }
    return (false);
}

export {
    requestSecure,
    AESEncryptionBody,
    AESEncryptionUrl
}