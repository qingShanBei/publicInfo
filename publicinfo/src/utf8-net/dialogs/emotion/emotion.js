window.onload = function() {
    editor.setOpt({
        emotionLocalization: true
    });

    emotion.SmileyPath = editor.options.emotionLocalization === true ? 'images/' : "http://img.baidu.com/hi/";
    emotion.SmileyBox = createTabList(emotion.tabNum);
    emotion.tabExist = createArr(emotion.tabNum);

    initImgName();
    initEvtHandler("tabHeads");
};

function initImgName() {
    for (var pro in emotion.SmilmgName) {
        var tempName = emotion.SmilmgName[pro],
                tempBox = emotion.SmileyBox[pro],
                tempStr = "";

        if (tempBox.length) return;
        for (var i = 0; i <= tempName[1] - 1; i++) {
            tempStr = tempName[0];
            if (i < 10) tempStr = tempStr + '0';
            tempStr = tempStr + i + '.gif';
            tempBox.push(tempStr);
        }
    }
}

function initEvtHandler(conId) {
    var tabHeads = $G(conId);
    for (var i = 0, j = 0; i < tabHeads.childNodes.length; i++) {
        var tabObj = tabHeads.childNodes[i];
        if (tabObj.nodeType == 1) {
            domUtils.on(tabObj, "click", (function(index) {
                return function() {
                    switchTab(index);
                };
            })(j));
            j++;
        }
    }
    switchTab(0);
    $G("tabIconReview").style.display = 'none';
}

function InsertSmiley(url, evt) {
    var obj = {
        src: editor.options.emotionLocalization ? editor.options.UEDITOR_HOME_URL + "dialogs/emotion/" + url : url
    };
    obj._src = obj.src;
    editor.execCommand('insertimage', obj);
    if (!evt.ctrlKey) {
        dialog.popup.hide();
    }
}

function switchTab(index) {

    autoHeight(index);
    if (emotion.tabExist[index] == 0) {
        emotion.tabExist[index] = 1;
        createTab('tab' + index);
    }
    //获取呈现元素句柄数组
    var tabHeads = $G("tabHeads").getElementsByTagName("span"),
            tabBodys = $G("tabBodys").getElementsByTagName("div"),
            i = 0, L = tabHeads.length;
    //隐藏所有呈现元素
    for (; i < L; i++) {
        tabHeads[i].className = "";
        tabBodys[i].style.display = "none";
    }
    //显示对应呈现元素
    tabHeads[index].className = "focus";
    tabBodys[index].style.display = "block";
}

function autoHeight(index) {
    var iframe = dialog.getDom("iframe"),
            parent = iframe.parentNode.parentNode;
    switch (index) {
        case 0:
            iframe.style.height = "250px";
            parent.style.height = "250px";
            break;
        default:

    }
}


function createTab(tabName) {
    var faceVersion = "?v=1.1", //版本号
            tab = $G(tabName), //获取将要生成的Div句柄
            imagePath = emotion.SmileyPath + emotion.imageFolders[tabName], //获取显示表情和预览表情的路径
            positionLine = 11 / 2, //中间数
            iWidth = iHeight = 25, //图片长宽
            iColWidth = 3, //表格剩余空间的显示比例
            tableCss = emotion.imageCss[tabName],
            cssOffset = emotion.imageCssOffset[tabName],
            textHTML = ['<table class="smileytable">'],
            i = 0, imgNum = emotion.SmileyBox[tabName].length, imgColNum = 12, faceImage,
            sUrl, realUrl, posflag, offset, infor;
    for (; i < imgNum; ) {
        textHTML.push('<tr>');
        for (var j = 0; j < imgColNum; j++, i++) {
            faceImage = emotion.SmileyBox[tabName][i];
            if (faceImage) {
                sUrl = imagePath + faceImage + faceVersion;
                realUrl = imagePath + faceImage;
                posflag = j < positionLine ? 0 : 1;
                offset = cssOffset * i * (-1) - 1;
                infor = emotion.SmileyInfor[tabName][i];

                textHTML.push('<td  class="' + tableCss + '"   border="1" width="' + iColWidth + '%" style="border-collapse:collapse;" align="center"  bgcolor="transparent" onclick="InsertSmiley(\'' + realUrl.replace(/'/g, "\\'") + '\',event)" onmouseover="over(this,\'' + sUrl + '\',\'' + posflag + '\')" onmouseout="out(this)">');
                textHTML.push('<span>');
                if (i < 10) {
                    i = "0" + i;
                }
                textHTML.push('<img title="' + infor + '" src="images/qqface/png/ee_0' + i + '.png" width="' + iWidth + '" height="' + iHeight + '"></img>');
                textHTML.push('</span>');
            } else {
                textHTML.push('<td width="' + iColWidth + '%"   bgcolor="#FFFFFF">');
            }
            textHTML.push('</td>');
        }
        textHTML.push('</tr>');
    }
    textHTML.push('</table>');
    textHTML = textHTML.join("");
    tab.innerHTML = textHTML;
}

function over(td, srcPath, posFlag) {
    //td.style.backgroundColor = "#ACCD3C";
    td.style.border = "#ACCD3C thin solid";
    td.style.backgroundColor = "#FFF";
    $G('faceReview').style.backgroundImage = "url(" + srcPath + ")";
    if (posFlag == 1) $G("tabIconReview").className = "show";
    $G("tabIconReview").style.display = 'block';
}

function out(td) {
    //td.style.borderColor = "#889E3A";
    td.style.border = "#bac498 1px solid";
    td.style.backgroundColor = "transparent";
    var tabIconRevew = $G("tabIconReview");
    tabIconRevew.className = "";
    tabIconRevew.style.display = 'none';
}

function createTabList(tabNum) {
    var obj = {};
    for (var i = 0; i < tabNum; i++) {
        obj["tab" + i] = [];
    }
    return obj;
}

function createArr(tabNum) {
    var arr = [];
    for (var i = 0; i < tabNum; i++) {
        arr[i] = 0;
    }
    return arr;
}
