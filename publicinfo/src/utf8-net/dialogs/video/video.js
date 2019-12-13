/**
 * Created by JetBrains PhpStorm.
 * User: taoqili
 * Date: 12-2-20
 * Time: 上午11:19
 * To change this template use File | Settings | File Templates.
 */

(function () {

    var video = {},
        uploadVideoList = [],
        isModifyUploadVideo = false,
        uploadFile;

    window.onload = function () {
        $focus($G("videoUrl"));
        initVideo();
        initUpload();
    };

    function initVideo() {
        createAlignButton(["videoFloat", "upload_alignment"]);
        addUrlChangeListener($G("videoUrl"));
        addOkListener();
        createPreviewVideo("");
        isModifyUploadVideo = true;
        //编辑视频时初始化相关信息
        /*(function() {
        var img = editor.selection.getRange().getClosedNode(), url;
        if (img && img.className) {
        var hasFakedClass = (img.className == "edui-faked-video"),
        hasUploadClass = img.className.indexOf("edui-upload-video") != -1;
        if (hasFakedClass || hasUploadClass) {
        $G("videoUrl").value = url = img.getAttribute("_url");
        var align = domUtils.getComputedStyle(img, "float"),
        parentAlign = domUtils.getComputedStyle(img.parentNode, "text-align");
        updateAlignButton(parentAlign === "center" ? "center" : align);
        }
        if (hasUploadClass) {
        isModifyUploadVideo = true;
        }
        }
        createPreviewVideo(url);
        })();*/
    }

    /**
    * 监听确认和取消两个按钮事件，用户执行插入或者清空正在播放的视频实例操作
    */
    function addOkListener() {
        dialog.onok = function () {
            $G("preview").innerHTML = "";
            insertSingle();
        };
        dialog.oncancel = function () {
            $G("preview").innerHTML = "";
        };
    }

    /**
    * 依据传入的align值更新按钮信息
    * @param align
    */
    function updateAlignButton(align) {
        var aligns = $G("videoFloat").children;
        for (var i = 0, ci; ci = aligns[i++]; ) {
            if (ci.getAttribute("name") == align) {
                if (ci.className != "focus") {
                    ci.className = "focus";
                }
            } else {
                if (ci.className == "focus") {
                    ci.className = "";
                }
            }
        }
    }

    /**
    * 将单个视频信息插入编辑器中
    */
    function insertSingle() {
        var width = $G("videoWidth"),
            height = $G("videoHeight"),
            url = $G('videoUrl').value,
            align = 'none'; //findFocus("videoFloat", "name");
        if (!url) return false;
        if (!checkNum([width, height])) return false;
        editor.execCommand('insertvideo', {
            url: convert_url(url),
            width: 420,
            height: 280,
            align: align
        }, isModifyUploadVideo ? 'upload' : null);
    }

    /**
    * 将元素id下的所有代表视频的图片插入编辑器中
    * @param id
    */
    function insertSearch(id) {
        var imgs = domUtils.getElementsByTagName($G(id), "img"),
            videoObjs = [];
        for (var i = 0, img; img = imgs[i++]; ) {
            if (img.getAttribute("selected")) {
                videoObjs.push({
                    url: img.getAttribute("ue_video_url"),
                    width: 420,
                    height: 280,
                    align: "none"
                });
            }
        }
        editor.execCommand('insertvideo', videoObjs);
    }

    /**
    * 找到id下具有focus类的节点并返回该节点下的某个属性
    * @param id
    * @param returnProperty
    */
    function findFocus(id, returnProperty) {
        var tabs = $G(id).children,
                property;
        for (var i = 0, ci; ci = tabs[i++]; ) {
            if (ci.className == "focus") {
                property = ci.getAttribute(returnProperty);
                break;
            }
        }
        return property;
    }
    function convert_url(url) {
        if (!url) return '';
        url = utils.trim(url)
            .replace(/v\.youku\.com\/v_show\/id_([\w\-=]+)\.html/i, 'player.youku.com/player.php/sid/$1/v.swf')
            .replace(/(www\.)?youtube\.com\/watch\?v=([\w\-]+)/i, "www.youtube.com/v/$2")
            .replace(/youtu.be\/(\w+)$/i, "www.youtube.com/v/$1")
            .replace(/v\.ku6\.com\/.+\/([\w\.]+)\.html.*$/i, "player.ku6.com/refer/$1/v.swf")
            .replace(/www\.56\.com\/u\d+\/v_([\w\-]+)\.html/i, "player.56.com/v_$1.swf")
            .replace(/www.56.com\/w\d+\/play_album\-aid\-\d+_vid\-([^.]+)\.html/i, "player.56.com/v_$1.swf")
            .replace(/v\.pps\.tv\/play_([\w]+)\.html.*$/i, "player.pps.tv/player/sid/$1/v.swf")
            .replace(/www\.letv\.com\/ptv\/vplay\/([\d]+)\.html.*$/i, "i7.imgs.letv.com/player/swfPlayer.swf?id=$1&autoplay=0")
            .replace(/www\.tudou\.com\/programs\/view\/([\w\-]+)\/?/i, "www.tudou.com/v/$1")
            .replace(/v\.qq\.com\/cover\/[\w]+\/[\w]+\/([\w]+)\.html/i, "static.video.qq.com/TPout.swf?vid=$1")
            .replace(/v\.qq\.com\/.+[\?\&]vid=([^&]+).*$/i, "static.video.qq.com/TPout.swf?vid=$1")
            .replace(/my\.tv\.sohu\.com\/[\w]+\/[\d]+\/([\d]+)\.shtml.*$/i, "share.vrs.sohu.com/my/v.swf&id=$1");

        return url;
    }

    /**
    * 检测传入的所有input框中输入的长宽是否是正数
    * @param nodes input框集合，
    */
    function checkNum(nodes) {
        for (var i = 0, ci; ci = nodes[i++]; ) {
            var value = ci.value;
            if (!isNumber(value) && value) {
                alert(lang.numError);
                ci.value = "";
                ci.focus();
                return false;
            }
        }
        return true;
    }

    /**
    * 数字判断
    * @param value
    */
    function isNumber(value) {
        return /(0|^[1-9]\d*$)/.test(value);
    }

    /**
    * 创建图片浮动选择按钮
    * @param ids
    */
    function createAlignButton(ids) {
        for (var i = 0, ci; ci = ids[i++]; ) {
            var floatContainer = $G(ci),
                     nameMaps = { "none": lang['default'], "left": lang.floatLeft, "right": lang.floatRight, "center": lang.block };
            for (var j in nameMaps) {
                var div = document.createElement("div");
                div.setAttribute("name", j);
                if (j == "none") div.className = "focus";
                div.style.cssText = "background:url(images/" + j + "_focus.jpg);";
                div.setAttribute("title", nameMaps[j]);
                //floatContainer.appendChild( div );
            }
        }
    }

    /**
    * 监听url改变事件
    * @param url
    */
    function addUrlChangeListener(url) {
        if (browser.ie) {
            url.onpropertychange = function () {
                createPreviewVideo(this.value);
            }
        } else {
            url.addEventListener("input", function () {
                createPreviewVideo(this.value);
            }, false);
        }
    }

    /**
    * 根据url生成视频预览
    * @param url
    */
    function createPreviewVideo(url) {
        if (!url) return;

        var conUrl = convert_url(url);
        var userAgent = navigator.userAgent;
        if (userAgent.indexOf("Chrome") > -1) {
            //            $G("preview").innerHTML = '<div class="previewMsg"><span>Chrome浏览器无法预览，需要预览请使用火狐或者IE</span></div>' +
            //            '<embed class="previewVideo" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer"' +
            //            ' src="' + conUrl + '"' +
            //            ' width="' + 420 + '"' +
            //            ' height="' + 280 + '"' +
            //            ' wmode="transparent" play="true" loop="false" menu="false" allowscriptaccess="never" allowfullscreen="true" >' +
            //            '</embed>';
            //$G("preview").innerHTML = '<embed src="ckplayer.swf" flashvars="video=' + conUrl + '"  quality="high" width="550" height="280" align="middle" allowScriptAccess="always" allowFullscreen="true" type="application/x-shockwave-flash"></embed>';
            $G("preview").innerHTML = '<video src="'+conUrl+'" controls width="100%" height="100%"></video>';
        } else {
            //            $G("preview").innerHTML = '<object id="player" classid=\"clsid:9BE31822-FDAD-461B-AD51-BE1D1C159921\" class="previewVideo" codebase=\"http://downloads.videolan.org/pub/videolan/vlc/last/win32/vlc-2.2.5.1-win32.exe\"' +
            //            ' events=\"True\">' +
            //            "<param name=\"Src\" value=\"" + conUrl +
            //            "\" /><param name=\"ShowDisplay\" value=\"True\" />" +
            //            "<param name=\"AutoLoop\" value=\"False\" /><param name=\"AutoPlay\" value=\"true\" />" +
            //            '<embed type="application/x-vlc-plugin" pluginspage="http://www.videolan.org"' +
            //            ' src="' + conUrl + '" ' +
            //            'width="550" height="280" wmode="transparent" play="true" loop="false" menu="false" allowfullscreen="true">' +
            //            '</embed>' +
            //            '</object>';
            //            var player = document.getElementById('player');
            //            player.setAttribute("width", "550");
            //            player.setAttribute("height", "280");
            //            player.style.width = "550px";
            //            player.style.height = "280px";
            // $G("preview").innerHTML = '<embed src="ckplayer.swf" flashvars="video=' + conUrl + '"  quality="high" width="550" height="280" align="middle" allowScriptAccess="always" allowFullscreen="true" type="application/x-shockwave-flash"></embed>';
            $G("preview").innerHTML = '<video src="'+conUrl+'" controls width="100%" height="100%"></video>';
        }
    }


    /* 插入上传视频 */
    function insertUpload() {
        var videoObjs = [],
            uploadDir = editor.getOpt('videoUrlPrefix'),
            width = $G('upload_width').value || 420,
            height = $G('upload_height').value || 280,
            align = findFocus("upload_alignment", "name") || 'none';
        for (var key in uploadVideoList) {
            var file = uploadVideoList[key];
            videoObjs.push({
                url: uploadDir + file.url,
                width: width,
                height: height,
                align: align
            });
        }

        var count = uploadFile.getQueueCount();
        if (count) {
            $('.info', '#queueList').html('<span style="color:red;">' + '还有2个未上传文件'.replace(/[\d]/, count) + '</span>');
            return false;
        } else {
            editor.execCommand('insertvideo', videoObjs, 'upload');
        }
    }

    /*初始化上传标签*/
    function initUpload() {
        uploadFile = new UploadFile('queueList');
    }


    /* 上传附件 */
    function UploadFile(target) {
        this.$wrap = target.constructor == String ? $('#' + target) : $(target);
        this.init();
    }
    UploadFile.prototype = {
        init: function () {
            this.fileList = [];
            this.initContainer();
            this.initUploader();
        },
        initContainer: function () {
            this.$queue = this.$wrap.find('.filelist');
        },
        /* 初始化容器 */
        initUploader: function () {
            var _this = this,
                $ = jQuery,    // just in case. Make sure it's not an other libaray.
                $wrap = _this.$wrap,
            // 图片容器
                $queue = $wrap.find('.filelist'),
            // 状态栏，包括进度和控制按钮
                $statusBar = $wrap.find('.statusBar'),
            // 文件总体选择信息。
                $info = $statusBar.find('.info'),
            // 上传按钮
                $upload = $wrap.find('.uploadBtn'),
            // 上传按钮
                $filePickerBtn = $wrap.find('.filePickerBtn'),
            // 上传按钮
                $filePickerBlock = $wrap.find('.filePickerBlock'),
            // 没选择文件之前的内容。
                $placeHolder = $wrap.find('.placeholder'),
            // 总体进度条
                $progress = $('.progress').hide(),

                $filePicker = $('#filePickerReady'),
            // 添加的文件数量
                fileCount = 0,
            // 添加的文件总大小
                fileSize = 0,
            // 优化retina, 在retina下这个值是2
                ratio = window.devicePixelRatio || 1,
            // 缩略图大小
                thumbnailWidth = 113 * ratio,
                thumbnailHeight = 113 * ratio,
            // 可能有pedding, ready, uploading, confirm, done.
                state = '',
            // 所有文件的进度信息，key为file id
                percentages = {},
                supportTransition = (function () {
                    var s = document.createElement('p').style,
                        r = 'transition' in s ||
                            'WebkitTransition' in s ||
                            'MozTransition' in s ||
                            'msTransition' in s ||
                            'OTransition' in s;
                    s = null;
                    return r;
                })(),
            // WebUploader实例
                uploader,
                actionUrl = editor.getActionUrl(editor.getOpt('videoActionName')),
                fileMaxSize = editor.getOpt('videoMaxSize'),
                acceptExtensions = (editor.getOpt('videoAllowFiles') || []).join('').replace(/\./g, ',').replace(/^[,]/, ''); ;

            if (!WebUploader.Uploader.support()) {
                alert("系统检测到您的浏览器不支持WebUploader，上传功能已被禁止，请于Chrome、IE10+、Firefox下使用")
                return;
            }
            if (isNaN(fileMaxSize)) {
                $('#uploadTip').text('请选择500M以内.flv/.mp4(h264编码)/.f4v格式的视频');
            } else {
                $('#uploadTip').text('请选择' + fileMaxSize / (1024 * 1024) + 'M以内.mp4(h264编码)格式的视频');
            }

            //var address = editor.getOpt('ftpServerInfo');

            var  address = "/net/";

            uploader = _this.uploader = WebUploader.create({
                pick: {
                    id: '#filePickerReady',
                    label: lang.uploadSelectFile
                },
                //分片，默认为false，即不开启分片上传
                chunked: true,

                //分片大小,若不设置，默认为5M
                chunkSize: 2 * 1024 * 1024,

                //文件上传失败后，重新补传次数
                chunkRetry: 1,

                //并发上传数量，默认为3（浏览器都有最大并发数，并非设置越大越快）
                threads: 1,
                swf: '../../third-party/webuploader/Uploader.swf',
                //server: '../../net/UEditorUploadHandler.ashx',
                server: address + 'UEditorUploadHandler.ashx',
                //请求参数表，即后台（ashx）可直接通过Request["key"]获取到的参数
                formData: { Guid: getUid("video"), method: "doUpload", threads: 1, diskName: "UEditor", chunkSize: 2, isPaused: 1 },
                duplicate: true,
                fileSingleSizeLimit: fileMaxSize,
                compress: false
            });

            //setState('pedding');
            $filePicker.on('change', function (e) {
                if (e.target.value == '') {
                    return;
                }
                if (!getIsLegal(e.target.value)) {
                    var str = '';
                    var allowFiles = editor.options.videoFileTypes || editor.getOpt('videoAllowFiles');
                    for (var i = 0, l = allowFiles.length; i < l; i++) {
                        if (i === allowFiles.length - 1) {
                            str += allowFiles[i];
                        } else {
                            str += allowFiles[i] + '、';
                        }
                    }
                    uploader.reset();
                    alert('文件格式错误');
                    return;
                }
                if (state == 'uploading') {
                    alert('文件正在上传，请上传完毕后再试');
                } else {
                    uploader.upload();
                }
            })

            function getIsLegal(path) {
                var tmp = path.split('.');
                var ext = '.' + tmp[tmp.length - 1].toLowerCase();
                var allowFiles = editor.options.videoFileTypes || editor.getOpt('videoAllowFiles');
                /*var videoAllowFiles = [
                "flv", "swf", "mkv", "avi", "rm", "rmvb", "mpeg", "mpg",
                "ogg", "ogv", "mov", "wmv", "mp4", "webm", "wav", "mid"];*/
                for (var i = 0; i < allowFiles.length; i++) {
                    if (allowFiles[i] == ext) {
                        return true;
                    }
                }

                return false;
            }

            /**
            * 生成UID
            * @param {String} prefix
            */
            function getUid(prefix) {
                var counter = 0;
                var guid = (+new Date()).toString(32),
            i = 0;

                for (; i < 5; i++) {
                    guid += Math.floor(Math.random() * 65535).toString(32);
                }

                return (prefix || 'wu_') + guid + (counter++).toString(32);
            }

            function setState(val) {
                state = val;
                if (val == 'uploading') {
                    $progress.show()
                } else {
                    $progress.hide()
                }
            }

            function updateTotalProgress(percentage) {
                var loaded = 0,
                    total = 0,
                    spans = $progress.children();

                spans.eq(1).css('width', Math.round(percentage * 100) + '%');
            }

            function resetProgress() {
                var spans = $progress.children();
                spans.eq(1).css('width', '0%');
                uploader.reset();
            }

            uploader.on('uploadProgress', function (file, percentage) {
                setState('uploading');
                var $li = $('#' + file.id),
                    $percent = $li.find('.progress span');

                $percent.css('width', percentage * 100 + '%');
                updateTotalProgress(percentage);
            });

            uploader.on('uploadSuccess', function (file, ret) {
                uploader.options.formData.Guid = getUid("video")
                setState('stop');
                resetProgress();
                var $file = $('#' + file.id);
                var responseText = (ret._raw || ret);
                var json = utils.str2json(responseText);
                var fielUrl = address + 'UEditor/Attach/' + json.filePath;
                $('#videoUrl').val(fielUrl),
                createPreviewVideo(fielUrl);
            });

            uploader.on('uploadError', function (file, code) {
                setState('stop');
                resetProgress();
                alert('发生错误');
            });
            uploader.on('error', function (code, file) {
                if (code == 'F_EXCEED_SIZE') {
                    alert('文件大小超出');
                } else {
                    alert('发生错误');
                }
                setState('stop');
                resetProgress();
            });
            updateTotalProgress();
        },
        getQueueCount: function () {
            var file, i, status, readyFile = 0, files = this.uploader.getFiles();
            for (i = 0; file = files[i++]; ) {
                status = file.getStatus();
                if (status == 'queued' || status == 'uploading' || status == 'progress') readyFile++;
            }
            return readyFile;
        },
        refresh: function () {
            this.uploader.refresh();
        }
    };

})();
