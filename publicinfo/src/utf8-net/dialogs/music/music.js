

(function () {
    var music = {},
        uploadMusicList = [],
        isModifyUploadMusic = false,
        uploadFile;
    window.onload = function() {
        $focus($G("musicUrl"));
        initMusic();
        initUpload();
    };

    function initMusic() {
        addUrlChangeListener($G("musicUrl"));
        addOkListener();
        createPreviewMusic("");
        isModifyUploadVideo = true;
    }
    
    /**
    * 将单个音频信息插入编辑器中
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
    * 监听确认和取消两个按钮事件，用户执行插入或者清空正在播放的音频实例操作
    */
    function addOkListener() {
        dialog.onok = function() {
            if ($G('musicUrl').value != '') {
                var url = editor.options.UEDITOR_HOME_URL;
                $G("preview").innerHTML = "";
                //insertSingle();
              /*  var str = '<span class="musicPlayer">' +
                    '<embed id="musics" wmode="transparent" width="150" ' + 
                    'height="20" src="' + url + 'third-party/music/singlemp3player.swf?showDownload=true&file=' + 
                    $G('musicUrl').value + 
                    '&autoStart=false&backColor=000000&frontColor=00ff00&repeatPlay=no&songVolume=100" ' + 
                    'type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer"/></span>';*/
                // editor.execCommand('insertmusic', str);
                //var str = '<audio src="'+$G('musicUrl').value+'" controls></audio>';
                editor.execCommand('music',{
                    url:$G('musicUrl').value
                });
            }            
        };
        dialog.oncancel = function() {
            $G("preview").innerHTML = "";
        };
    }

    /**
    * 监听url改变事件
    * @param url
    */
    function addUrlChangeListener(url) {
        if (browser.ie) {
            url.onpropertychange = function() {
                createPreviewMusic(this.value);
            }
        } else {
            url.addEventListener("input", function() {
                createPreviewMusic(this.value);
            }, false);
        }
    }

    /**
    * 根据url生成音频预览
    * @param url
    */
    function createPreviewMusic(url) {
        if (!url) return;

      /*  $G("preview").innerHTML = '<embed class="previewVideo" id="musics" wmode="transparent"' +
             'src="../../third-party/music/singlemp3player.swf?showDownload=false&amp;'+
             'file=' + url + '&amp;'+
             'autoStart=false&amp;backColor=000000&amp;frontColor=00ff00&amp;repeatPlay=no&amp;songVolume=100"'+
             'type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer"' +
             'style="margin-top:20px;" height="20" width="150">';*/
      $G('preview').innerHTML = '<audio controls src="'+url+'"></audio>'
        //editor.execCommand('insertmusic', str);

        //$G("preview").innerHTML = '<audio src='+url+' width="100" height="30" controls preload/>';
    }

    /*初始化上传标签*/
    function initUpload() {
        uploadFile = new Music('queueList');
    }

    /* 上传附件 */
    function Music(target) {
        this.$wrap = target.constructor == String ? $('#' + target) : $(target);
        this.init();
    }
    
    Music.prototype = {
        init:function () {
            this.fileList = [];
            //this.initContainer();
            this.initUploader();
        },
        /* 初始化容器 */
        initUploader: function() {
            var _this = this,
                $ = jQuery,
                
                $filePicker = $('#filePickerReady'),
                
            // 可能有pedding, ready, uploading, confirm, done.
                state = '',
            // 所有文件的进度信息，key为file id
                percentages = {},
                
                // 总体进度条
                $progress = $('.progress').hide(),
                
                errorCode = '',
                
            // WebUploader实例
                uploader,
                address = editor.getOpt('ftpServerInfo');
                fileMaxSize = editor.getOpt('musicMaxSize'),
                acceptExtensions = (editor.getOpt('musicAllowFiles') || []).join('').replace(/\./g, ',').replace(/^[,]/, ''); 

            if (!WebUploader.Uploader.support()) {
                alert("系统检测到您的浏览器不支持WebUploader，上传功能已被禁止，请于Chrome、IE10+、Firefox下使用")
                return;
            }
            if (isNaN(fileMaxSize)) {
                $('#uploadTip').text('请选择50M以内.mp3/.aac/.wav/.wma/.mid格式的音频');
            } else {
                $('#uploadTip').text('请选择' + fileMaxSize / (1024 * 1024) + 'M以内.mp3格式的音频')
                //$('#uploadTip').text().replace('100', fileMaxSize / (1024 * 1024));
            }

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
                formData: { Guid: getUid("music"), method: "doUpload", threads: 1, diskName: "UEditor", chunkSize: 2, isPaused: 1 },
                duplicate: true,
                fileSingleSizeLimit: fileMaxSize,
                compress: false
            });

            //setState('pedding');
            $filePicker.on('change', function(e) {
                
                if (e.target.value.split('.').length == 1) {
                    if (e.target.value.split('.')[0] == '') {
                        uploader.reset();
                        return;
                    }
                    uploader.reset();
                    alert(lang.typeError);
                    errorCode = ''
                    return;                
                }

                if (!getIsLegal(e.target.value)) {
                    var str = '';
                    var allowFiles = editor.options.musicFileTypes || editor.getOpt('musicAllowFiles');
                    for (var i = 0, l = allowFiles.length; i < l; i++) {
                        if (i === allowFiles.length - 1) {
                            str += allowFiles[i];
                        } else {
                            str += allowFiles[i] + '、';
                        }
                    }
                    uploader.reset();
                    alert(lang.typeError);
                    return;
                }

                if (errorCode == 'sizeError') {
                    alert(lang.sizeError);
                    errorCode = '';
                    uploader.reset();
                    return;
                } else if (errorCode == 'serverError') {
                    alert(lang.serverError);
                    errorCode = '';
                    uploader.reset();
                    return;              
                }                
                
                if (state == 'uploading') {
                    alert(lang.uploading);
                } else {
                    uploader.upload();
                }
            })

            function getIsLegal(path) {
                var tmp = path.split('.');
                var ext = '.' + tmp[tmp.length - 1].toLowerCase();
                var allowFiles = editor.options.musicFileTypes || editor.getOpt('musicAllowFiles');
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
                uploader.reset();
                var spans = $progress.children();
                spans.eq(1).css('width', '0%');
            }

            uploader.on('uploadProgress', function(file, percentage) {
                setState('uploading');
                var $li = $('#' + file.id),
                    $percent = $li.find('.progress span');

                $percent.css('width', percentage * 100 + '%');
                updateTotalProgress(percentage);
            });

            uploader.on('uploadSuccess', function(file, ret) {
                uploader.options.formData.Guid = getUid("music")
                setState('stop');
                resetProgress();
                var $file = $('#' + file.id);
                var responseText = (ret._raw || ret);
                var json = utils.str2json(responseText);
                var fielUrl = address + 'UEditor/Attach/' + json.filePath;
                $('#musicUrl').val(fielUrl),
                createPreviewMusic(fielUrl);
            });

            uploader.on('uploadError', function(file, code) {
                setState('stop');
                resetProgress();
                errorCode = 'sizeError';
            });
            uploader.on('error', function(code, file) {
                if (code == 'F_EXCEED_SIZE') {
                    errorCode = 'sizeError';
                    //alert(lang.sizeError);
                } else {
                    errorCode = 'serverError';
                    //alert(lang.serverError);
                }
                setState('stop');
                resetProgress();
            });
            updateTotalProgress();
        },
    };
})();



