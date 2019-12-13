'use strict';

const path = require('path');
const fs = require('fs');
const url = require('url');
const globby = require('globby');
// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebook/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

const envPublicUrl = process.env.PUBLIC_URL;

function ensureSlash(inputPath, needsSlash) {
  const hasSlash = inputPath.endsWith('/');
  if (hasSlash && !needsSlash) {
    return inputPath.substr(0, inputPath.length - 1);
  } else if (!hasSlash && needsSlash) {
    return `${inputPath}/`;
  } else {
    return inputPath;
  }
}

const getPublicUrl = appPackageJson =>
  envPublicUrl || require(appPackageJson).homepage;

// We use `PUBLIC_URL` environment variable or "homepage" field to infer
// "public path" at which the app is served.
// Webpack needs to know it to put the right <script> hrefs into HTML even in
// single-page apps that may serve index.html for nested URLs like /todos/42.
// We can't use a relative path in HTML because we don't want to load something
// like /todos/42/static/js/bundle.7289d.js. We have to know the root.
function getServedPath(appPackageJson) {
  const publicUrl = getPublicUrl(appPackageJson);
  const servedUrl =
    envPublicUrl || (publicUrl ? url.parse(publicUrl).pathname : '/');
  return ensureSlash(servedUrl, true);
}

const moduleFileExtensions = [
  'web.mjs',
  'mjs',
  'web.js',
  'js',
  'web.ts',
  'ts',
  'web.tsx',
  'tsx',
  'json',
  'web.jsx',
  'jsx',
];

// Resolve file paths in the same order as webpack
const resolveModule = (resolveFn, filePath) => {
  const extension = moduleFileExtensions.find(extension =>
    fs.existsSync(resolveFn(`${filePath}.${extension}`))
  );

  if (extension) {
    return resolveFn(`${filePath}.${extension}`);
  }

  return resolveFn(`${filePath}.js`);
};


function getDirs(mypath){

    const items = fs.readdirSync(mypath);

    let result = [];



    // 遍历当前目录中所有的文件和文件夹

    items.map(item => {

        let temp = path.join(mypath, item);



        // 若当前的为文件夹

        if( fs.statSync(temp).isDirectory() ){

            result.push( item ); // 存储当前文件夹的名字

        }

    });

    return result;

}   //查找所有的一级子目录
Array.prototype.indexOf = function(val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) return i;
    }
    return -1;
};  //数组去除一个元素1
Array.prototype.remove = function(val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};  //数组去除一个元素2

const htmlArray = globby.sync([path.posix.join(resolveApp('src')+'/*/index.html').replace(/\\/g,'/')]); //获取所有的入口html的地址
const jsArray = globby.sync([path.posix.join(resolveApp('src'),'/*/index.js').replace(/\\/g,'/')]); //获取所有的入口index.js的地址

  /* globby([path.posix.join(resolveApp('src'),'/!*!/index.js').replace(/\\/g,'/')]).then(function (res) {
       console.log(res);
   });*/



/*const commonImgArray = getDirs(resolveApp('src/common/images'));    //获取common公共目录下的images目录
const imgArray = getDirs(resolveApp('src'));    //获取src下的所有的目录，作为打包后images目录名称
imgArray.remove('common');  //去除common下的image的目录，common下的image后面处理*/
jsArray.remove(resolveApp('src/common/index.js').replace(/\\/g,'/')); //去除所有入口index.js路径里面的common的路径，common的index.js不作为入口文件



// config after eject: we're in ./config/
module.exports = {
  dotenv: resolveApp('.env'),
  appPath: resolveApp('.'),
  appBuild: resolveApp('build'),
  appPublic: resolveApp('public'),
  appHtml: resolveApp('public/index.html'),
  appIndexJs: resolveModule(resolveApp, 'src/index/index'),
  appPackageJson: resolveApp('package.json'),
  appSrc: resolveApp('src'),
  appTsConfig: resolveApp('tsconfig.json'),
  appJsConfig: resolveApp('jsconfig.json'),
  yarnLockFile: resolveApp('yarn.lock'),
  testsSetup: resolveModule(resolveApp, 'src/setupTests'),
  proxySetup: resolveApp('src/setupProxy.js'),
  appNodeModules: resolveApp('node_modules'),
  publicUrl: getPublicUrl(resolveApp('package.json')),
  servedPath: getServedPath(resolveApp('package.json')),
  htmlArray,
  jsArray,
/*  commonImgArray,
  imgArray*/
};



module.exports.moduleFileExtensions = moduleFileExtensions;
