import 'whatwg-fetch';
import 'es6-promise';
import $ from 'jquery';
import {
    TESTKEY
} from './SecretKey'
import {
    AESEncryptionBody,
    AESEncryptionUrl,
    // requestSecure
} from './util'
import {
    // stringify
} from 'querystring';
import {
    createHashHistory
} from 'history';
import {
    message
} from 'antd';
// let base = "http://192.168.2.107:8080/publicinfo";
// let base = "http://192.168.129.75:8080/publicinfo";
// let base = "http://192.168.129.224:10105/publicinfo";
//生产环境
let base = ""; 
// 参数
// url:请求服务对象
// paramsObj：请求的参数，格式为json
// SecurityLevel:请求的安全等级，分1,2,3,4四个等级
// content_type：请求的实体的数据的媒体类型，默认urlencoded格式，支持json

function postData(url1, paramsObj = {}, SecurityLevel = 1, content_type = 'urlencoded') {
    // console.log(url1,paramsObj);
    // if(base==='/'&&url1.indexOf('PublicInfo')!==-1){
    //     url1 ='..'+url1.slice(10,url1.length);
    // }
    // if(base==='/'&&url1.slice(0,10)==='PublicInfo'){
    //     url1 ='..'+url1.slice(10,url1.length);
    // }
    // console.log(url1);
    if (url1.slice(0, 10) === 'PublicInfo' && !base) {
        url1 = '../../..' + url1.slice(10, url1.length);
    } else {
        url1 = url1.slice(10, url1.length);
    }
    // console.log(paramsObj);
    if (paramsObj.unloading) {
        delete(paramsObj['unloading']);
    } else {
        $('.example').show();
    }
    //  console.log(url1);
    // $('.example').show();
    let url = base + url1;
    // console.log(url);
    let token = sessionStorage.getItem('token') || getQueryVariable('lg_tk');
    sessionStorage.setItem('token', token);
    // url = url+'?token='+token;
    // if (!token && SecurityLevel !== 1) {
    //     console.log('token无效，请重新登录');//后期会进行无token的事件操作
    //     return new Promise(function (resolve, reject) {
    //         if (resolve) {
    //             resolve(stringify({ 'Status': 4001, 'Msg': "token无效，请重新登录" }));
    //         } else {
    //             reject(stringify({ 'Status': 4000, 'Msg': "错误！" }));
    //         }
    //     });
    // }
    let ContentTypeArr = ['application/x-www-form-urlencoded', 'application/json']
    let ContentType = '';
    if (content_type === 'urlencoded') {
        ContentType = ContentTypeArr[0]
    } else if (content_type === 'json') {
        ContentType = ContentTypeArr[1]
    } else {
        ContentType = ContentTypeArr[0]
    }
    let result = fetch(url, {
        method: 'post', //*post、get、put、delete，此项为请求方法相关的配置 
        mode: 'cors', //no-cors(跨域模式但服务器端不支持cors),*cors(跨域模式，需要服务器通过Access-control-Allow-Origin来
        //允许指定的源进行跨域),same-origin(同源)
        cache: 'no-cache', //*no-cache,default,reload,force-cache,only-ifcached,此项为缓存相关配置
        credentials: 'omit', //*include(携带cookie)、same-origin(cookie同源携带)、omit(不携带)

        headers: {
            'Accept': 'application/json, text/plain, */*', //请求头，代表的、发送端（客户端）希望接收的数据类型
            'Content-Type': ContentType, //实体头，代表发送端（客户端|服务器）发送的实体数据的数据类型
            'Authorization': 'X-Token=' + token,
        },
        redirect: 'follow', //manual、*follow(自动重定向)、error，此项为重定向的相关配置
        // referrer: 'no-referrer',//该首部字段会告知服务器请求的原始资源的URI
        // 注意post时候参数的形式 
        body: AESEncryptionBody(paramsObj, TESTKEY, SecurityLevel, content_type) //此处需要和headers里的"Content-Type"相对应
    })

    // result.then(res => {//做提前处理
    //     console.log(res)
    //     return res;
    // }, err => {

    // })
    result.then(res => { //做提前处理
        // console.log(res)
        let res2 = res.clone();
        return res2.json();
    }).then((json) => {
            setTimeout(function () {
                $('.example').hide();
            }, 300)
            //    console.log(json);
            if (json.StatusCode === 401) {
                let url = window.location.href;
                url = url.split('?');
                if (url.length > 1 && url[1].indexOf('&') > -1) {
                    let pram = url[1].split('&');
                    url = url[0] + '?';
                    pram.map((item) => {
                        if (item.indexOf('lg_tk=') === -1) {
                            url += item + '&';
                        }
                    })
                    url.slice(0, -1);
                } else {
                    url = url[0];
                }

                url = encodeURIComponent(url);
                getData('PublicInfo/GetServerInfo', {}, ).then((res) => {
                    return res.json();
                }).then((json) => {
                    sessionStorage.removeItem('token');
                    // alert('未认证用户信息，请重新登录~');
                    window.open(json.Data.MainServerAddr + '/UserMgr/Login/Login.aspx?lg_sysid=' + json.Data.SysID + '&lg_preurl=' + url, '_self');
                })

                // alert(  this.state.data.MainServerAddr +'/UserMgr/Login/Login.aspx?lg_sysid='+this.state.data.SysID+'&lg_preurl='+url)\


            }
            if (json.StatusCode === 403) {
                const history = createHashHistory();
                history.push('/Error');
                return
            }
        }


    ).catch(function (e) {
        if (url.indexOf('PublicInfo/GetUserInfo') === -1) {
            $('.example').hide();
            message.error('请求出错', 3);
        } else {
            //    window.open(window.location.href.split('?')[0]+'404','_self');
            return
        }
    });
    return result;
}

function getData(url1, paramsObj = {}, SecurityLevel = 1, mode = 'cors') {
    // console.log(url1);
    if (url1.slice(0, 10) === 'PublicInfo' && !base) {
        url1 = '../../..' + url1.slice(10, url1.length);
    } else {
        url1 = url1.slice(10, url1.length);
    }
    // console.log(url1);
    // console.log(url1);
    // console.log(paramsObj);
    if (paramsObj.unloading) {
        delete(paramsObj['unloading']);
    } else {
        $('.example').show();
    }
    let DataError =0;
    if (paramsObj.DataError) {
        delete(paramsObj['DataError']);
        DataError=1;
        console.log(1111);
    }
    
    let url = base + url1;

    let token = sessionStorage.getItem('token') || getQueryVariable('lg_tk');
    sessionStorage.setItem('token', token);
    url = url + '?';
    Object.keys(paramsObj).forEach(function (key) {
        url = url + key + '=' + paramsObj[key] + '&';
    });
    url = url.slice(0, -1);
    // console.log(url);
    //    console.log(token);
    // if (!token && SecurityLevel !== 1) {
    //     console.log('token无效，请重新登录');//后期会进行无token的事件操作
    //     return new Promise(function (resolve, reject) {
    //         if (resolve) {
    //             resolve(stringify({ 'Status': 4001, 'Msg': "token无效，请重新登录" }));
    //         } else {
    //             reject(stringify({ 'Status': 4000, 'Msg': "错误！" }));
    //         }
    //     });
    // }


    let result = fetch(AESEncryptionUrl(url, TESTKEY, SecurityLevel), {

        method: 'get', //*post、get、put、delete，此项为请求方法相关的配置 
        mode: mode, //no-cors(跨域模式但服务器端不支持cors),*cors(跨域模式，需要服务器通过Access-control-Allow-Origin来
        //允许指定的源进行跨域),same-origin(同源)
        cache: 'no-cache', //*no-cache,default,reload,force-cache,only-ifcached,此项为缓存相关配置
        credentials: 'omit', //*include(携带cookie)、same-origin(cookie同源携带)、omit(不携带)

        headers: {
            'Accept': 'application/json, text/plain, */*', //请求头，代表的、发送端（客户端）希望接收的数据类型
            'Content-Type': 'application/x-www-form-urlencoded', //实体头，代表发送端（客户端|服务器）发送的实体数据的数据类型
            'Authorization': 'X-Token=' + token,
        },
        redirect: 'follow', //manual、*follow(自动重定向)、error，此项为重定向的相关配置
        // referrer: 'no-referrer',//该首部字段会告知服务器请求的原始资源的URI

    })

    if (!DataError) {
        result.then(res => { //做提前处理
            // console.log(res)
            let res2 = res.clone();
            return res2.json();
        }).then((json) => {
                setTimeout(function () {
                    $('.example').hide();
                }, 300)
                //    console.log(json);
                if (json.StatusCode === 401) {
                    let url = window.location.href;
                    url = url.split('?');
                    if (url.length > 1 && url[1].indexOf('&') > -1) {
                        let pram = url[1].split('&');
                        url = url[0] + '?';
                        pram.map((item) => {
                            if (item.indexOf('lg_tk=') === -1) {
                                url += item + '&';
                            }
                        })
                        url.slice(0, -1);
                    } else {
                        url = url[0];
                    }

                    url = encodeURIComponent(url);

                    getData('PublicInfo/GetServerInfo', {}, ).then((res) => {
                        return res.json();
                    }).then((json) => {
                        sessionStorage.removeItem('token');
                        // alert('未认证用户信息，请重新登录~');
                        window.open(json.Data.MainServerAddr + '/UserMgr/Login/Login.aspx?lg_sysid=' + json.Data.SysID + '&lg_preurl=' + url, '_self');
                    })

                    // alert(  this.state.data.MainServerAddr +'/UserMgr/Login/Login.aspx?lg_sysid='+this.state.data.SysID+'&lg_preurl='+url)
                }
                if (json.StatusCode === 403) {
                    const history = createHashHistory();
                    history.push('/Error');
                    return
                }
            }

        ).catch(function (e) {
            if (url.indexOf('PublicInfo/GetUserInfo') === -1) {
                $('.example').hide();
                if (url.indexOf('PublicInfo/Que/PersonalQtnMgr/ExportQtn') === -1) {
                    message.error('请求出错', 3);
                }
            } else {
                //    window.open(window.location.href.split('?')[0]+'404','_self');
                return
            }
        });
    }else{
        $('.example').hide();
    }

    //    setTimeout(()=>{
    //     result2.then(res => { //做提前处理

    //         console.log(res)
    //     
    //     })
    //    
    // console.log(result)
    // }, 1)
    return result;
}

//获取url参数
function getQueryVariable(variable) {
    var query = window.location.search.substring(1) || window.location.href.split('?')[1] || window.location.href;
    // console.log(query)
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] === variable) {
            return pair[1];
        }
    }
    return (false);
}

function GUID() {
    this.date = new Date(); /* 判断是否初始化过，如果初始化过以下代码，则以下代码将不再执行，实际中只执行一次 */
    if (typeof this.newGUID != 'function') {
        /* 生成GUID码 */
        GUID.prototype.newGUID = function () {
            this.date = new Date();
            var guidStr = '';
            let sexadecimalDate = this.hexadecimal(this.getGUIDDate(), 16);
            let sexadecimalTime = this.hexadecimal(this.getGUIDTime(), 16);
            for (var i = 0; i < 9; i++) {
                guidStr += Math.floor(Math.random() * 16).toString(16);
            }
            guidStr += sexadecimalDate;
            guidStr += sexadecimalTime;
            while (guidStr.length < 32) {
                guidStr += Math.floor(Math.random() * 16).toString(16);
            }
            return this.formatGUID(guidStr);
        }
        /* * 功能：获取当前日期的GUID格式，即8位数的日期：19700101 * 返回值：返回GUID日期格式的字条串 */
        GUID.prototype.getGUIDDate = function () {
            return this.date.getFullYear() + this.addZero(this.date.getMonth() + 1) + this.addZero(this.date.getDay());
        }
        /* * 功能：获取当前时间的GUID格式，即8位数的时间，包括毫秒，毫秒为2位数：12300933 * 返回值：返回GUID日期格式的字条串 */
        GUID.prototype.getGUIDTime = function () {
            return this.addZero(this.date.getHours()) + this.addZero(this.date.getMinutes()) + this.addZero(this.date.getSeconds()) + this.addZero(parseInt(this.date.getMilliseconds() / 10));
        }
        /* * 功能: 为一位数的正整数前面添加0，如果是可以转成非NaN数字的字符串也可以实现 * 参数: 参数表示准备再前面添加0的数字或可以转换成数字的字符串 * 返回值: 如果符合条件，返回添加0后的字条串类型，否则返回自身的字符串 */
        GUID.prototype.addZero = function (num) {
            if (Number(num).toString() !== 'NaN' && num >= 0 && num < 10) {
                return '0' + Math.floor(num);
            } else {
                return num.toString();
            }
        }
        /*  * 功能：将y进制的数值，转换为x进制的数值 * 参数：第1个参数表示欲转换的数值；第2个参数表示欲转换的进制；第3个参数可选，表示当前的进制数，如不写则为10 * 返回值：返回转换后的字符串 */
        GUID.prototype.hexadecimal = function (num, x, y) {
            if (y !== undefined) {
                return parseInt(num.toString(), y).toString(x);
            } else {
                return parseInt(num.toString()).toString(x);
            }
        }
        /* * 功能：格式化32位的字符串为GUID模式的字符串 * 参数：第1个参数表示32位的字符串 * 返回值：标准GUID格式的字符串 */
        GUID.prototype.formatGUID = function (guidStr) {
            var str1 = guidStr.slice(0, 8) + '-',
                str2 = guidStr.slice(8, 12) + '-',
                str3 = guidStr.slice(12, 16) + '-',
                str4 = guidStr.slice(16, 20) + '-',
                str5 = guidStr.slice(20);
            return str1 + str2 + str3 + str4 + str5;
        }
    }
}
export {
    postData,
    getData,
    GUID,
    getQueryVariable,
}

// function loadScriptOrCss(urlArr, num) {
//     if (!num) {
//         num = 0;
//     }
//     //正则判断是否是css;
//     var reg = RegExp(/.css/);
//     if (reg.test(urlArr[num])) {
//         // 动态生成css
//         var scriptOrCss = document.createElement('link');
//         scriptOrCss.type = 'text/css';
//         scriptOrCss.async = 'async';
//         scriptOrCss.href = urlArr[num];
//         scriptOrCss.rel = "stylesheet";
//         document.getElementsByTagName("head")[0].appendChild(scriptOrCss);

//     } else {
//         // 动态生成js
//         var scriptOrCss = document.createElement('script');
//         scriptOrCss.type = 'text/javascript';
//         scriptOrCss.async = 'async';
//         scriptOrCss.src = urlArr[num];
//         document.body.appendChild(scriptOrCss);
//     }
//     if (scriptOrCss.readyState) {
//         //IE下
//         scriptOrCss.onreadystatechange = function () {
//             if (scriptOrCss.readyState == 'complete' || scriptOrCss.readyState == 'loaded') {
//                 scriptOrCss.onreadystatechange = null;
//                 num++;
//                 if (num == urlArr.length) {
//                     return;
//                 } else {
//                     loadScriptOrCss(urlArr, num);
//                 }
//             }
//         }
//     } else {
//         //其他浏览器
//         scriptOrCss.onload = function () {
//             num++;
//             if (num == urlArr.length) {
//                 return;
//             } else {
//                 loadScriptOrCss(urlArr, num);
//             }
//         }
//     }
// }