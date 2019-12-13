const fs = require("fs");
const fsExtra = require("fs-extra");
const path = require("path");
const   SOURCES_DIRECTORY = path.resolve(__dirname,"../");  //源目录
const DIRECT_DIRECTORY = path.resolve(__dirname,"../build/JS/App");
var copy=function(src,dst){
    let paths = fs.readdirSync(src); //同步读取当前目录
    paths.forEach(function(path){
        if (path.indexOf("node_modules")!=0&&path.indexOf("build")!=0&&path.indexOf(".idea")!=0&&path.indexOf(".gitignore")!=0&&path.indexOf("README.md")!=0){
            var _src=src+'/'+path;
            var _dst=dst+'/'+path;

            fs.stat(_src,function(err,stats){  //stats  该对象 包含文件属性
                if(err)throw err;
                if(stats.isFile()){ //如果是个文件则拷贝
                    let  readable=fs.createReadStream(_src);//创建读取流
                    let  writable=fs.createWriteStream(_dst);//创建写入流
                    readable.pipe(writable);
                }else if(stats.isDirectory()){ //是目录则 递归
                    checkDirectory(_src,_dst,copy);
                }
            });
        }
    });
}
//递归创建目录 同步方法
var mkdirsSync =  function  (dirname) {
    //console.log(dirname);
    if (fs.existsSync(dirname)) {
        return true;
    } else {
        if (mkdirsSync(path.dirname(dirname))) {
            fs.mkdirSync(dirname);
            return true;
        }
    }
};

var checkDirectory=function(src,dst,callback){
    fs.access(dst, fs.constants.F_OK, (err) => {
        if(err){
            mkdirsSync(dst);
            callback(src,dst);

        }else{
            callback(src,dst);
        }
    });
};

checkDirectory(SOURCES_DIRECTORY,DIRECT_DIRECTORY,copy);
