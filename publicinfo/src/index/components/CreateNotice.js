import React, { Component } from 'react';
import { Modal, Upload, message, Button, Icon, DatePicker, TimePicker } from 'antd';
import moment from 'moment';
import './scss/CreateNotice.scss';
import { getData, postData, GUID } from "../common/js/fetch";
import $ from 'jquery';
import UEditor from './UEditor';
const format = 'HH:mm';

window.jquery = $;
class CreateNotice extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            option1: 'notice-create-choose',
            option2: 'notice-create-unchoose',
            time: '12:30',
            objectList: [],
            noticeObjectList: [],
            ObjNameList: [],
            objectTypeList: [],
            ObjIDList: [],
            ObjUniqID: [],
            ObjUniqIDList: '',
            noticeTitle: '',
            fileList: [],
            ObjNameListAll: [],
            id: '',
            EffectType: 1,
            EffectTime: '',
            AttachmentID: '',
            AttachmentUrl: '',
            AttachmentName: '',
            AttachmentSize: '',
            isupload: false,
            serverTime: '',
            TemplateList: [],
            NoticeContent: '',
            NoticeMain: 0,
        };
        this.createNotice = this.createNotice.bind(this);
        this.clearObject = this.clearObject.bind(this);
        this.formDataRemind = this.formDataRemind.bind(this);

    }
    // hideModal = () => {
    //     this.setState({
    //         visible: false,
    //     });
    // };
    option1Click = () => {
        if (this.state.option1 !== 'notice-create-choose') {
            this.setState({
                option1: 'notice-create-choose',
                option2: 'notice-create-unchoose',
                EffectType: 1,
            });
        }

    }

    option2Click = () => {
        if (this.state.option2 !== 'notice-create-choose') {
            this.setState({
                option2: 'notice-create-choose',
                option1: 'notice-create-unchoose',
                EffectType: 2,

            });
        }

    }
    changeNoticeTitle(e) {
        this.setState({
            noticeTitle: e.target.value
        })
    }
    showModal = () => {
        if (this.state.objectList.length === 1) {
            this.objectChoose(this.state.objectList[0].id);
        }
        this.setState({
            visible: true,
        });

    };
    showModal1 = () => {
        $('.object-choose-true').attr('class', 'object-choose-false');
        $('.object-choose-some').attr('class', 'object-choose-false');
        if (this.state.objectList.length === 1) {
            this.objectChoose(this.state.objectList[0].id);
        }
        this.setState({
            visible: true,
            ObjNameList: [],
        });

    };
    objectChoose(id, e) {
        $('.object-choose-li').attr('class', 'object-choose-li');
        if (e) {
            e.target.className = 'object-choose-li object-choose-li1';
        }
        $('.object-choose-true').attr('class', 'object-choose-false');
        $('.object-choose-some').attr('class', 'object-choose-false');
        getData('PublicInfo/Notice/CreateNotice/GetObjNodeInfo', {
            UserID: sessionStorage.getItem('UserID'),
            SchoolID: sessionStorage.getItem('SchoolID'),
            PublisherIdentity: id,
            ObjUniqIDList: this.state.ObjUniqIDList,
        }).then((res) => {
            return res.json();
        }).then((json) => {
            if (json.StatusCode === 200) {
                this.setState({
                    noticeObjectList: json.Data.Item,
                    id: id
                })
            } else {
                message.error(json.Msg);
                this.setState({
                    noticeObjectList: [],
                })
            }

        })
    }
    //教师对象选择方式的转换
    chooseObjectType(e, num) {
        let ee = $(e.currentTarget);
        console.log(ee);
        if (num == 1) {
            ee.parent().parent().parent().next().children().children('a').css('transform', 'rotateZ(90deg)');
            ee.parent().parent().parent().next().children('ul').show();
            ee.parent().parent().parent().next().attr('class', 'object-choose-all');
        } else {
            ee.parent().parent().parent().prev().children().children('a').css('transform', 'rotateZ(90deg)');
            ee.parent().parent().parent().prev().children('ul').show();
            ee.parent().parent().parent().prev().attr('class', 'object-choose-all');
        }
        ee.parent().parent().parent().attr('class', 'object-one-none');

    }
    clearObject(idx, num) {
        let ObjNameList = this.state.ObjNameList;
       
        ObjNameList.splice(idx, 1);
        if(this.state.NoticeMain===1){
            let ObjTypeList = this.state.objectTypeList;
            let ObjIDList = this.state.ObjIDList;
            let ObjNameListAll = this.state.ObjNameListAll;
            let ObjUniqID = this.state.ObjUniqID;
            console.log(ObjTypeList);
             ObjTypeList = ObjTypeList.split('$');
             ObjIDList = ObjIDList.split('$');
             ObjNameListAll = ObjNameListAll.split('$');
             ObjUniqID = ObjUniqID.split('$');
             ObjIDList.splice(idx, 1);
             ObjTypeList.splice(idx, 1);
             ObjNameListAll.splice(idx, 1);
             ObjUniqID.splice(idx, 1);
             ObjIDList = ObjIDList.join('$');
             ObjTypeList = ObjTypeList.join('$');
             ObjNameListAll = ObjNameListAll.join('$');
             ObjUniqID = ObjUniqID.join('$');
             
             this.setState({
                objectTypeList : ObjTypeList,
                ObjIDList : ObjIDList,
                ObjNameListAll : ObjNameListAll,
                ObjUniqID : ObjUniqID,
             })
             
        }else{
        
        $('.object-choose-all:eq(' + num + ') .object-choose-true').attr('class', 'object-choose-false');
        $('.object-choose-all:eq(' + num + ') .object-choose-some').attr('class', 'object-choose-false');
        this.hideModal1();
        }
        this.setState({
            ObjNameList: ObjNameList,
        })
        
    }
    changeOneUl(e) {
        let ee = $(e.target);
        if (ee.parent().next().css('display') == 'none') {
            ee.parent().next().show();
            ee.css('transform', 'rotateZ(90deg)');
        } else {
            ee.parent().next().hide();
            ee.css('transform', 'rotateZ(0)');
        }
    }
    //点击选择对象
    chooseObjectinfo(e) {
        let $e = $(e.currentTarget);
        let $this = $(e.target);
        //第二层子节点
        if ($e.attr('class') === 'object-choose-two') {
            if ($e.children().children('i').attr('class') != 'object-choose-true') {
                $e.children().children('i').attr('class', 'object-choose-true');
                this.chooseObjectFn($e, 1);
            } else {
                $e.children().children('i').attr('class', 'object-choose-false');
                this.chooseObjectFn($e, 2);
            }
        }
        //只有一层子节点
        else if ($e.attr('class') === 'object-choose-one' && $e.children('.object-two-ul').length === 0) {
            if ($e.children().children('i').attr('class') != 'object-choose-true') {
                $e.children().children('i').attr('class', 'object-choose-true');
                this.chooseObjectFn($e, 3);
            } else {
                $e.children().children('i').attr('class', 'object-choose-false');
                this.chooseObjectFn($e, 4);
            }
        }
        //第一层子节点
        else if ($this.attr('name') == 1) {
            if ($e.children().children('i').attr('class') != 'object-choose-true') {
                $e.children().children('i').attr('class', 'object-choose-true');
                this.chooseObjectFn($e, 5);
            } else {
                $e.children().children('i').attr('class', 'object-choose-false');
                this.chooseObjectFn($e, 6);
            }
        }
        //父节点
        else if ($this.attr('name') == 0) {
            if ($e.children().children('i').attr('class') != 'object-choose-true') {
                $e.children().children('i').attr('class', 'object-choose-true');
                this.chooseObjectFn($e, 7);
            } else {
                $e.children().children('i').attr('class', 'object-choose-false');
                this.chooseObjectFn($e, 8);
            }
        }
        if (e.stopPropagation) {
            // 针对 Mozilla 和 Opera
            e.stopPropagation();
        } else if (window.event) {
            // 针对 IE
            window.event.cancelBubble = true;
        }

    }
    hideModal = () => {
        this.setState({
            visible: false,
        });
    };
    hideModal1 = () => {
        let objectTypeList = '';
        let ObjIDList = '';
        let ObjNameList = '';
        let ObjUniqID = '';
        let objChooseUl = [];
        for (let i = 0; i < $('.object-choose-all').length; i++) {
            if ($('.object-choose-all').eq(i).children().children('i').attr('class') == 'object-choose-true') {
                objChooseUl.push(i);
                objectTypeList += $('.object-choose-all').eq(i).attr('data-objtype') + '$';
                if ($('.object-choose-all').eq(i).children('ul').length > 0) {
                    ObjIDList += $('.object-choose-all').eq(i).attr('data-objid') + '(';
                    ObjNameList += '全部' + $('.object-choose-all').eq(i).attr('data-objname') + '(';
                    ObjUniqID += $('.object-choose-all').eq(i).attr('data-objuniqid') + '(';
                    for (let h = 0; h < $('.object-choose-all').eq(i).children('ul').children('li').length; h++) {
                        ObjIDList += $('.object-choose-all').eq(i).children('ul').children('li').eq(h).attr('data-objid') + '+';
                        ObjNameList += $('.object-choose-all').eq(i).children('ul').children('li').eq(h).attr('data-objname') + '+';
                        ObjUniqID += $('.object-choose-all').eq(i).children('ul').children('li').eq(h).attr('data-ObjUniqID') + '+';
                    }
                    ObjIDList = ObjIDList.slice(0, -1);
                    ObjIDList += ')$';
                    ObjNameList = ObjNameList.slice(0, -1);
                    ObjNameList += ')$';
                    ObjUniqID = ObjUniqID.slice(0, -1);
                    ObjUniqID += ')$';
                } else {
                    ObjIDList += $('.object-choose-all').eq(i).attr('data-objid') + '$';
                    ObjNameList += '全部' + $('.object-choose-all').eq(i).attr('data-objname') + '$';
                    ObjUniqID += $('.object-choose-all').eq(i).attr('data-objuniqid') + '$';
                }
            } else if ($('.object-choose-all').eq(i).children().children('i').attr('class') == 'object-choose-some') {
                objChooseUl.push(i);
                ObjNameList += $('.object-choose-all').eq(i).attr('data-objname') + ':';
                for (let j = 0; j < $('.object-choose-all').eq(i).children('ul').children('li').length; j++) {
                    if ($('.object-choose-all').eq(i).children('ul').children('li').eq(j).children().children('i').attr('class') == 'object-choose-true') {
                        objectTypeList += $('.object-choose-all').eq(i).children('ul').children('li').eq(j).attr('data-objtype') + ';';
                        ObjIDList += $('.object-choose-all').eq(i).attr('data-objid') + '&' + $('.object-choose-all').eq(i).children('ul').children('li').eq(j).attr('data-objid') + ';';
                        ObjNameList += $('.object-choose-all').eq(i).children('ul').children('li').eq(j).attr('data-objname') + ';';

                        ObjUniqID += $('.object-choose-all').eq(i).children('ul').children('li').eq(j).attr('data-objuniqid') + ';';
                    } else if ($('.object-choose-all').eq(i).children('ul').children('li').eq(j).children().children('i').attr('class') == 'object-choose-some') {
                        objectTypeList += $('.object-choose-all').eq(i).children('ul').children('li').eq(j).children('ul').children('li').attr('data-objtype') + ';';
                        let jj = '';
                        for (let k = 0; k < $('.object-choose-all').eq(i).children('ul').children('li').eq(j).children('ul').children('li').length; k++) {
                            if (jj !== j) {
                                ObjIDList += $('.object-choose-all').eq(i).attr('data-objid') + '&' + $('.object-choose-all').eq(i).children('ul').children('li').eq(j).attr('data-objid') + ':';
                                ObjNameList += $('.object-choose-all').eq(i).children('ul').children('li').eq(j).attr('data-objname') + '(';
                                jj = j;
                            }
                            if ($('.object-choose-all').eq(i).children('ul').children('li').eq(j).children('ul').children('li').eq(k).children().children('i').attr('class') == 'object-choose-true') {
                                ObjIDList += $('.object-choose-all').eq(i).children('ul').children('li').eq(j).children('ul').children('li').eq(k).attr('data-objid') + '|';
                                ObjNameList += $('.object-choose-all').eq(i).children('ul').children('li').eq(j).children('ul').children('li').eq(k).attr('data-objname') + '|';
                                ObjUniqID += $('.object-choose-all').eq(i).children('ul').children('li').eq(j).children('ul').children('li').eq(k).attr('data-objuniqid') + '|';
                            }

                        }
                        ObjIDList = ObjIDList.slice(0, -1);
                        ObjNameList = ObjNameList.slice(0, -1);
                        ObjUniqID = ObjUniqID.slice(0, -1);
                        ObjIDList += ';';
                        ObjNameList += ');';
                        ObjUniqID += ';';
                    }

                }
                if (ObjIDList.slice(ObjIDList.length - 1, ObjIDList.length) == ';') {
                    ObjIDList = ObjIDList.slice(0, -1);
                }
                if (objectTypeList.slice(objectTypeList.length - 1, objectTypeList.length) == ';') {
                    objectTypeList = objectTypeList.slice(0, -1);
                }
                if (ObjNameList.slice(ObjNameList.length - 1, ObjNameList.length) == ';') {
                    ObjNameList = ObjNameList.slice(0, -1);
                }
                if (ObjUniqID.slice(ObjUniqID.length - 1, ObjUniqID.length) == ';') {
                    ObjUniqID = ObjUniqID.slice(0, -1);
                }
                objectTypeList += '$';
                ObjIDList += '$';
                ObjNameList += '$';
                ObjUniqID += '$';
            }
        }
        if (objectTypeList.slice(objectTypeList.length - 1, objectTypeList.length) == '$') {
            objectTypeList = objectTypeList.slice(0, -1);
        } if (objectTypeList.slice(objectTypeList.length - 1, objectTypeList.length) == ';') {
            objectTypeList = objectTypeList.slice(0, -1);
        }
        if (ObjIDList.slice(ObjIDList.length - 1, ObjIDList.length) == '$') {
            ObjIDList = ObjIDList.slice(0, -1);
        } if (ObjIDList.slice(ObjIDList.length - 1, ObjIDList.length) == ';') {
            ObjIDList = ObjIDList.slice(0, -1);
        }
        if (ObjNameList.slice(ObjNameList.length - 1, ObjNameList.length) == '$') {
            ObjNameList = ObjNameList.slice(0, -1);
        } if (ObjNameList.slice(ObjNameList.length - 1, ObjNameList.length) == ';') {
            ObjNameList = ObjNameList.slice(0, -1);
        }
        if (ObjUniqID.slice(ObjUniqID.length - 1, ObjUniqID.length) == '$') {
            ObjUniqID = ObjUniqID.slice(0, -1);
        } if (ObjUniqID.slice(ObjUniqID.length - 1, ObjUniqID.length) == ';') {
            ObjUniqID = ObjUniqID.slice(0, -1);
        }
        // console.log(objectTypeList);
        // console.log(ObjIDList);
        // console.log(ObjNameList);
        // console.log(ObjUniqID);
        this.setState({
            ObjNameListAll: ObjNameList,
        })
        ObjNameList = ObjNameList.replace(/\|/g, '，');
        ObjNameList = ObjNameList.replace(/\+/g, '、');
        ObjNameList = ObjNameList.replace(/\;/g, '、');
        ObjNameList = ObjNameList.split('$');

        let ObjNameList2 = [];
        ObjNameList.map((item) => {
            if (item.indexOf('全部') > -1) {
                let sliceLength = '';
                if (item.indexOf('(') == -1) {
                    sliceLength = item.length;
                } else {
                    sliceLength = item.indexOf('(')
                }
                ObjNameList2.push(item.slice(0, sliceLength));
            } else {
                ObjNameList2.push(item);
            }

        })

        let ObjNameList1 = [];
        ObjNameList2.map((item, idx) => {
            ObjNameList1[idx] = {
                num: objChooseUl[idx],
                'name': item
            };
        })
        if (ObjNameList[0]) {
            this.setState({
                ObjNameList: ObjNameList1,
                objectTypeList: objectTypeList,
                ObjIDList: ObjIDList,
                ObjUniqID: ObjUniqID,
                visible: false,
            })
        } else {
            this.setState({
                ObjNameList: [],
                visible: false,
            })
        }

    };
    getDataNYR(data1, data) {
        this.setState({
            EffectTime: data,
        })
    }
    getDataHM(data1, data) {
        this.setState({
            time: data,
        })
    }
    ImportHover() {
        getData('PublicInfo/Notice/TemplateMgr/GetTemplateList', {
            UserID: sessionStorage.getItem('UserID'),
            UserType: sessionStorage.getItem('UserType'),
            PageIndex: 1,
            PageSize: 10,
        }).then((res) => {
            return res.json()
        }).then((json) => {
            if (json.Data) {
                this.setState({
                    TemplateList: json.Data.Item.TemplateList,
                })
            }
        })
    }
    importTemplate(id) {
        let TemplateContent = '';
        getData('PublicInfo/Notice/TemplateMgr/GetTemplateContent', {
            UserID: sessionStorage.getItem('UserID'),
            UserType: sessionStorage.getItem('UserType'),
            TemplateID: id,
        }).then((res) => {
            return res.json()
        }).then((json) => {
            if (json.StatusCode === 200) {
                if (json.Data.BackCode === 1) {
                    TemplateContent = json.Data.Item.NoticeTemplate[0].TemplateContent;
                    let ue = window.UE.getEditor('editor');
                    ue.ready(() => {
                        ue.setContent(TemplateContent)
                    })
                }
            }
        })
    }
    componentDidMount() {
        let UserType = sessionStorage.getItem('UserType');
        let UserClass = sessionStorage.getItem('UserClass');
        let objectList = [];
        if (UserType === '0') {
            if (UserClass === '2') {
                objectList.push({ id: 'A0', name: '超级网管' });
            }
            if (UserClass === '1') {
                // objectList.push('超级网管');
                objectList.push({ id: 'A1', name: '普通网管' });
            }
        }
        if (UserType === '7') {
            // objectList.push('领导');
            objectList.push({ id: 'L1', name: '领导' });
        }
        if (UserType === '1') {
            if (UserClass.charAt(4) === '1') {
                objectList.push({ id: 'T0', name: '教研主任' });
                // objectList.push('教研主任');
            }
            if (UserClass.charAt(2) === '1') {
                objectList.push({ id: 'T2', name: '班主任' });
                // objectList.push('班主任');
            }
            if (UserClass.charAt(1) === '1') {
                objectList.push({ id: 'T1', name: '任课老师' });

                // objectList.push('任课老师');
            }
        }
        console.log(objectList);

        this.setState({
            objectList: objectList,
        })


    }
    //选择对象后的开关逻辑变换 e为目标所在li元素，state为不同的逻辑
    chooseObjectFn(e, state) {
        if (state == 1) {
            if (e.parent().children().children().children('i').length == e.parent().children().children().children('.object-choose-true').length) {
                e.parent().parent().children('span').children('i').attr('class', 'object-choose-true');
            } else {
                e.parent().parent().children('span').children('i').attr('class', 'object-choose-some');
            }
            if (e.parent().parent().parent().children().children('span').children('i').length == e.parent().parent().parent().children().children('span').children('.object-choose-true').length) {
                e.parent().parent().parent().prev().children('i').attr('class', 'object-choose-true');
            } else {
                e.parent().parent().parent().prev().children('i').attr('class', 'object-choose-some');
            }
        }
        else if (state == 2) {
            if (e.parent().children().children().children('.object-choose-true').length > 0) {
                e.parent().parent().children('span').children('i').attr('class', 'object-choose-some');
            } else {
                e.parent().parent().children('span').children('i').attr('class', 'object-choose-false');
            }
            if (e.parent().parent().parent().children().children('span').children('.object-choose-true').length > 0 || e.parent().parent().parent().children().children('span').children('.object-choose-some').length > 0) {
                e.parent().parent().parent().prev().children('i').attr('class', 'object-choose-some');
            } else {
                e.parent().parent().parent().prev().children('i').attr('class', 'object-choose-false');
            }
        }
        else if (state == 3) {
            if (e.parent().children().children().children('i').length == e.parent().children().children().children('.object-choose-true').length) {
                e.parent().parent().children('span').children('i').attr('class', 'object-choose-true');
            } else {
                e.parent().parent().children('span').children('i').attr('class', 'object-choose-some');
            }
        }
        else if (state == 4) {
            if (e.parent().children().children().children('.object-choose-true').length > 0 || e.parent().children().children().children('.object-choose-some').length > 0) {
                e.parent().parent().children('span').children('i').attr('class', 'object-choose-some');
            } else {
                e.parent().parent().children('span').children('i').attr('class', 'object-choose-false');
            }
        }
        else if (state == 5) {
            e.children().children().children('span').children('i').attr('class', 'object-choose-true');
            if (e.parent().children().children().children('i').length == e.parent().children().children().children('.object-choose-true').length) {
                e.parent().parent().children('span').children('i').attr('class', 'object-choose-true');
            } else {
                e.parent().parent().children('span').children('i').attr('class', 'object-choose-some');
            }
        }
        else if (state == 6) {
            e.children().children().children('span').children('i').attr('class', 'object-choose-false');
            if (e.parent().children().children().children('.object-choose-true').length > 0 || e.parent().children().children().children('.object-choose-some').length > 0) {
                e.parent().parent().children('span').children('i').attr('class', 'object-choose-some');
            } else {
                e.parent().parent().children('span').children('i').attr('class', 'object-choose-false');
            }
        }
        else if (state == 7) {
            e.children('ul').children().children('span').children('i').attr('class', 'object-choose-true');
            e.children('ul').children().children('ul').children().children('span').children('i').attr('class', 'object-choose-true');
        }
        else if (state == 8) {
            e.children('ul').children().children('span').children('i').attr('class', 'object-choose-false');
            e.children('ul').children().children('ul').children().children('span').children('i').attr('class', 'object-choose-false');
        }
    }

    formDataRemind(e) {
        let $this = this;
        let file = $('#file')[0].files[0];
        if (!file) {
            $this.setState({
                AttachmentID: '',
                AttachmentUrl: '',
                AttachmentName: '',
                AttachmentSize: '',
            })
            $('#file').val('');
            return;
        }
        if (file.size > 1024 * 10240) {
            message.error('上传附件不能大于10MB~');
            $this.setState({
                AttachmentID: '',
                AttachmentUrl: '',
                AttachmentName: '',
                AttachmentSize: '',
            })
            $('#file').val('');
            return;
        }
        let uploadType = ['jpg', 'jpeg', 'png', 'bmp', 'gif', 'mp3', 'mp4', 'zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'cab', 'iso', 'mp4', 'mp3', 'txt', 'doc', 'docx', 'docs', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf'];
        if (uploadType.indexOf(file.name.slice(file.name.lastIndexOf('.') + 1, file.name.length)) === -1) {
            message.error('上传文件格式不正确~');
            $this.setState({
                AttachmentID: '',
                AttachmentUrl: '',
                AttachmentName: '',
                AttachmentSize: '',
            })
            $('#file').val('');
            return;
        }
        $this.setState({
            isupload: 'true',
        })
        getData('/PublicInfo/GetServerDate', {},
        ).then((res) => {
            return res.json();
        }).then((json) => {
            if (json.StatusCode === 200) {
                console.log(json.Data.ServerDate);
                let guid = new GUID().newGUID();
                let formData = new FormData($('#uploadImg')[0]);
                let diskName = 'Notice/Attachment/' + json.Data.ServerDate.slice(0, 4) + json.Data.ServerDate.slice(5, 7);
                formData.append('method', 'doUpload_WholeFile');
                formData.append('guid', guid);
                formData.append('name', file.name);
                formData.append('id', '');
                formData.append('type', '');
                formData.append('lastModifiedDate', file.lastModifiedDate);
                formData.append('diskName', diskName);
                formData.append('size', file.size);
                // formData.append('file', file);
                $.ajax({
                    url: 'http://192.168.129.1:30101/lgftp/PsnInfo_WebUploadHandler.ashx',
                    type: 'POST',
                    cache: false,
                    data: formData,
                    //dataType: 'json',
                    //async: false,
                    processData: false,
                    contentType: false,
                }).done(function (res) {
                    $this.setState({
                        AttachmentID: guid,
                        AttachmentUrl: diskName + '/' + guid + file.name.slice(file.name.lastIndexOf('.'), file.name.length),
                        AttachmentName: file.name,
                        AttachmentSize: file.size,
                        isupload: false,
                    })
                    message.success('上传附件成功~');
                }).fail(function (res) {
                    $this.setState({
                        AttachmentID: '',
                        AttachmentUrl: '',
                        AttachmentName: '',
                        AttachmentSize: '',
                        isupload: false,
                    })
                    message.error('上传附件失败~');
                });
            } else {
                message.error(json.Msg, 3);
                $this.setState({
                    isupload: false,
                })
            }

        })
        // let imgName = ['jpg','jpeg','png','bmp','gif'];
        // if(imgName.indexOf(file.name.slice(file.name.lastIndexOf('.')+1,file.name.length))!=-1&&file.size>1024*2048){
        //     message.error('上传图片不能大于2MB~');
        //     $this.setState({
        //         AttachmentID: '',
        //         AttachmentUrl: '',
        //         AttachmentName:'',
        //         AttachmentSize: '',
        //     })
        //     $('#file').val('');
        //     return;
        // }


    }
    uploadDel() {
        let $this = this;
        $.ajax({
            url: 'http://192.168.129.1:30101/lgftp/PsnInfo_WebUploadHandler.ashx',
            type: 'POST',
            // cache: false,
            data: {
                method: 'doDelete',
                params: this.state.AttachmentUrl,
            },
            //dataType: 'json',
            //async: false,
            // processData: false,
            // contentType: false,
        }).done(function (res) {
            $this.setState({
                AttachmentID: '',
                AttachmentUrl: '',
                AttachmentName: '',
                AttachmentSize: '',
                isupload: false,
            })
            $('#file').val('');
            message.success('附件删除成功~');
        }).fail(function (res) {
            $('#file').val('');
            message.error('附件删除失败~');
        });
    }
    createNotice() {
        var $this = this;
        let EffectTime = '';
        if (!this.state.noticeTitle) {
            message.error('通知标题不能为空~');
            let count = 0;
            let timer = setInterval(() => {
                count++;
                setTimeout(() => {
                    if (count === 3) {
                        clearInterval(timer);
                    }
                    $('.notice-create-title').focus();
                }, 200);
                $('.notice-create-title').blur();
            }, 400);
            return;
        }
        if (this.state.ObjNameListAll.length === 0) {
            message.error('发布对象不能为空~');
            let count = 0;
            let timer = setInterval(() => {
                count++;
                setTimeout(() => {
                    if (count === 3) {
                        clearInterval(timer);
                    }
                    $('.notice-create-object').css('background', '#f5f5f5');
                }, 200);
                $('.notice-create-object').css('background', '#0099ff');
            }, 400);
            return;
        }
        if (this.state.EffectType === 2) {

            if (this.state.EffectTime) {
                EffectTime = this.state.EffectTime + ' ' + this.state.time;
            } else {
                message.error('日期不能为空');
                $('.ant-calendar-picker-input').click();
                return;
            }
            if (!this.state.time) {
                message.error('时间不能为空');
                $('.ant-time-picker-input').click();
                return;
            }
            getData('/PublicInfo/GetServerDate', {},
            ).then((res) => {
                return res.json();
            }).then((json) => {
                if (json.StatusCode === 200) {
                    //    console.log(json.Data.ServerDate);
                    if (Date.parse(EffectTime) > Date.parse(json.Data.ServerDate)) {
                        postData('/PublicInfo/Notice/CreateNotice/PublishNotice', {
                            UserID: sessionStorage.getItem('UserID'),
                            SchoolID: sessionStorage.getItem('SchoolID'),
                            UserType: sessionStorage.getItem('UserType'),
                            NoticeTitle: this.state.noticeTitle,
                            NoticeContent: window.UE.getEditor('editor').getContent(),
                            PublisherID: sessionStorage.getItem('UserID'),
                            PublisherName: decodeURIComponent(sessionStorage.getItem('UserName')),
                            PublisherIdentity: this.state.id,
                            EffectType: this.state.EffectType,
                            EffectTime: EffectTime,
                            AttachmentID: this.state.AttachmentID,
                            AttachmentUrl: this.state.AttachmentUrl,
                            AttachmentName: this.state.AttachmentName,
                            AttachmentSize: this.state.AttachmentSize,
                            ObjTypeList: this.state.objectTypeList,
                            ObjIDList: this.state.ObjIDList,
                            ObjNameList: this.state.ObjNameListAll,
                            ObjUniqIDList: this.state.ObjUniqID,
                            PublishFrom: 1,
                        }, '1', 'json').then((res) => {
                            return res.json();
                        }).then((json) => {

                            if (json.StatusCode === 200 && json.Data.BackCode === 1) {
                                $this.props.hideModal();
                                // $this.props.uploadFn();
                                message.success('发布通知成功', 3);
                               setTimeout(()=>{
                                if(this.state.NoticeMain===1){
                                    window.opener=null;
                                 window.open('','_self');
                                 window.close();
                                }
                               },2000)

                            } else {
                                message.error(json.Msg, 3);
                            }

                        })
                    } else {
                        message.error('定时生效时间不能小于当前时间', 3);
                    }
                }
            })
        } else {
            postData('/PublicInfo/Notice/CreateNotice/PublishNotice', {
                UserID: sessionStorage.getItem('UserID'),
                SchoolID: sessionStorage.getItem('SchoolID'),
                UserType: sessionStorage.getItem('UserType'),
                NoticeTitle: this.state.noticeTitle,
                NoticeContent: window.UE.getEditor('editor').getContent(),
                PublisherID: sessionStorage.getItem('UserID'),
                PublisherName: decodeURIComponent(sessionStorage.getItem('UserName')),
                PublisherIdentity: this.state.id,
                EffectType: this.state.EffectType,
                EffectTime: EffectTime,
                AttachmentID: this.state.AttachmentID,
                AttachmentUrl: this.state.AttachmentUrl,
                AttachmentName: this.state.AttachmentName,
                AttachmentSize: this.state.AttachmentSize,
                ObjTypeList: this.state.objectTypeList,
                ObjIDList: this.state.ObjIDList,
                ObjNameList: this.state.ObjNameListAll,
                ObjUniqIDList: this.state.ObjUniqID,
                PublishFrom: 1,
            }, '1', 'json').then((res) => {
                return res.json();
            }).then((json) => {
                if (json.StatusCode === 200 && json.Data.BackCode === 1) {
                    $this.props.hideModal();
                    //    this.uploadFn();
                    message.success('发布通知成功', 3);
                    setTimeout(()=>{
                        if(this.state.NoticeMain===1){
                            window.opener=null;
                         window.open('','_self');
                         window.close();
                        }
                       },2000)
                } else {
                    message.error(json.Msg, 3);
                }

            })
        }

    }
    //如果条件不存在必须要返回null   
    static getDerivedStateFromProps(props, current_state) {
        if (props.NoticeMain !== 0 && current_state.NoticeMain === 0) {
            let NoticeContent = props.NoticeMain.NoticeContent;
            let timer = setInterval(function () {
                if ($('#editor').length > 0) {
                    let ue = window.UE.getEditor('editor');
                    ue.ready(() => {
                        ue.setContent(NoticeContent);
                        clearInterval(timer);
                    })
                }
            }, 300)
            let ObjNameListAll = props.NoticeMain.ObjNameList.split('$');
            let ObjNameList = [];
            ObjNameListAll.map((item, idx) => {
                if (item.indexOf('全部') > -1&&item.indexOf('(')>-1) {
                    ObjNameList.push({ 'name': item.slice(0, item.indexOf('(')), 'num': idx })
                } else {
                    item.replace(/|/g, ",");
                    item.replace(/;/g, "、");
                    ObjNameList.push({ 'name': item, 'num': idx });
                }
            })
            return {
                ObjNameList: ObjNameList,
                NoticeMain: 1,
                noticeTitle: props.NoticeMain.NoticeTitle,
                AttachmentID: props.NoticeMain.AttachmentID,
                AttachmentName: props.NoticeMain.AttachmentName,
                AttachmentSize: props.NoticeMain.AttachmentSize,
                AttachmentUrl: props.NoticeMain.AttachmentUrl,
                ObjIDList: props.NoticeMain.ObjIDList,
                ObjUniqID: props.NoticeMain.ObjUniqIDList,
                ObjUniqIDList: encodeURIComponent(props.NoticeMain.ObjUniqIDList),
                objectTypeList: props.NoticeMain.ObjTypeList,
                ObjNameListAll: props.NoticeMain.ObjNameList,
                NoticeContent: props.NoticeMain.NoticeContent,
                id:props.NoticeMain.PublisherIdentity,
            }
        }
        return null
    }
    render() {
        // console.log(this.props.NoticeMain)
        return (
            <div className='notice-create'>
                <Modal
                    title="创建通知"
                    visible={this.props.visible}
                    onOk={this.createNotice}
                    onCancel={this.props.hideModal}
                    okText="发布"
                    cancelText="取消"
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                    centered
                    width='1000px'
                    maskClosable={false}
                // wrapClassName='notice-create-Modal'
                >
                    {/* <UEditor ref="ueditor" initData={this.state.initData} /> */}
                    <label><span className="notice-create-span">标题:</span> <input maxLength='50' className="notice-create-title" placeholder="请输入通知标题" value={this.state.noticeTitle} onChange={(e) => { this.changeNoticeTitle(e) }} /><b className="notice-title-length" >{this.state.noticeTitle.length}/50</b></label>
                    <div className='notice-object-div'>
                        <span className="notice-create-span1">发布对象:</span> <span className="notice-create-object"><ul className='show-choose-object'>
                            {this.state.ObjNameList.length > 0 ? this.state.ObjNameList.map((item, idx) => {
                                return <li key={idx}><span title={item.name}>{item.name}</span><i onClick={() => { this.clearObject(idx, item.num) }}></i></li>
                            }) : ''}
                        </ul>  {this.state.ObjNameList.length > 0 ? <span><b onClick={this.showModal}>修改</b> <b onClick={this.showModal1} >重选</b></span> : <b onClick={this.showModal1} >选择</b>}    </span>
                    </div>
                    <div className="create-time-div" ><span className="notice-create-span">生效类型:</span> <span className={this.state.option1} onClick={this.option1Click}><i></i>立即生效</span> <span className={this.state.option2} onClick={this.option2Click}><i></i>定时生效</span>{this.state.option2 === 'notice-create-choose' ? <span ><DatePicker onChange={(value, mode) => { this.getDataNYR(value, mode) }} /> <TimePicker defaultValue={moment(this.state.time, format)} format={format} onChange={(data, value) => { this.getDataHM(data, value) }} /> </span> : ''}</div>
                    <form id="uploadImg">
                        附件:
                        <input name="file" type="file" id="file" onChange={(e) => { this.formDataRemind(e) }} />
                        {!this.state.AttachmentID ? '' : <span className='upload-success-span'><i className={this.state.AttachmentName.slice(this.state.AttachmentName.lastIndexOf('.') + 1, this.state.AttachmentName.length)}></i><b title={this.state.AttachmentName}>{this.state.AttachmentName}</b><b>{this.state.AttachmentSize / 1024 / 1024 > 1 ? '[' + (this.state.AttachmentSize / 1024 / 1024).toFixed(2) + 'MB]' : '[' + (this.state.AttachmentSize / 1024).toFixed(0) + 'KB]'}</b><b onClick={() => { this.uploadDel() }}>x</b></span>}
                        {this.state.isupload == 'true' ? <span className='upload-success-span'>正在上传，请稍等~</span> : ''}
                    </form>
                    <span className="create-content">正文:</span><UEditor id='editor'></UEditor>
                    <div className="Import-template" onMouseEnter={() => { this.ImportHover() }} ><span><i></i><b>导入模板</b></span>
                        <span className="Import-template-hover"></span>
                        {this.state.TemplateList && this.state.TemplateList.length > 0 ? <ul className="Import-template-ul">
                            {this.state.TemplateList.map((item, id) => {
                                return <li key={id}><i></i> <span>{item.TemplateTitle}</span> <span>{item.EditTime.slice(0, 16)}</span> <i onClick={() => { this.importTemplate(item.TemplateID) }}></i></li>
                            })}
                        </ul> : <div className="template-empty"><img src={require('./images/占位图-空空如也.png')} /><p className="notice-people-message">空空如也，暂时还没有可用的模板～</p></div>}</div>
                </Modal>
                <Modal
                    className="notice-people-list"
                    title="请选择发布对象"
                    visible={this.state.visible}
                    onOk={this.hideModal1}
                    onCancel={this.hideModal}
                    okText="确定"
                    cancelText="取消"
                    centered
                    width='720px'
                // wrapClassName='notice-people-list'
                >
                    {this.state.objectList && this.state.objectList.length > 1 ? <div className="notice-people-listLeft " >
                        <p >请选择发布身份:</p>
                        <ul>{this.state.objectList && this.state.objectList.map((item, idx) => {
                            return <li className='object-choose-li ' key={item.id} onClick={(e) => { this.objectChoose(item.id, e) }}><i></i>{item.name}</li>
                        })}
                        </ul>
                    </div> : ''}
                    <div className="notice-people-listRight " style={this.state.objectList.length > 1 ? { 'width': '75%' } : { 'width': '98%' }}>
                        {this.state.noticeObjectList.length == 0 ? <div> <img src={require('./images/占位图-请选择发布身份~.png')} /><p className="notice-people-message">请选择发布身份~</p></div> : <div>
                            <ul className="object-all-ul"  >
                                {this.state.noticeObjectList.map((item, idx) => {
                                    return (
                                        <li style={item.ChildrenNode.length === 0 ? { 'backgroundColor': '#ffffff' } : { 'backgroundColor': '#f5f5f5' }} data-objtype={item.ObjType} data-objid={item.ObjId} data-objname={item.ObjName} data-objuniqid={item.ObjUniqID} key={idx} className={item.TreeType != 32 ? "object-choose-all" : "object-one-none"} onClick={(e) => { this.chooseObjectinfo(e) }} > <span > {item.ChildrenNode.length == 0 ? '' : <a name='3' onClick={(e) => { this.changeOneUl(e) }} className='one-info' />}   <i name='0' className={item.NodeSelectState === 'unselected' ? "object-choose-false" : item.NodeSelectState === 'selected' ? "object-choose-true" : "object-choose-some"}></i><p name='0'>{item.ObjName}</p>{(item.TreeType === 31 && idx + 2 <= this.state.noticeObjectList.length && this.state.noticeObjectList[idx + 1].TreeType === 32) ? <b> <p> <i className='type-choose-true'></i>按学科</p>  <p onClick={(e) => { this.chooseObjectType(e, 1) }}><i className='type-choose-false' ></i>按年级</p></b> : ''} {item.TreeType == 32 ? <b><p onClick={(e) => { this.chooseObjectType(e, 2) }}><i className='type-choose-false' ></i>按学科</p> <p><i className='type-choose-true' ></i>按年级</p></b> : ''}</span>
                                            {item.ChildrenNode.length === 0 ? '' :
                                                <ul className="object-one-ul">
                                                    {item.ChildrenNode.map((it, id) => {
                                                        return (<li data-objtype={it.ObjType} data-objid={it.ObjId} data-objname={it.ObjName} data-objuniqid={it.ObjUniqID} data-objparentuniqid={it.ObjParentUniqID} key={id} className="object-choose-one" onClick={(e) => { this.chooseObjectinfo(e) }} ><span name='1'><i className={it.NodeSelectState === 'unselected' ? "object-choose-false" : it.NodeSelectState === 'selected' ? "object-choose-true" : "object-choose-some"} name='1'></i>{it.ObjName}{it.ChildrenNode.length == 0 ? '' : <b></b>}</span>
                                                            {it.ChildrenNode.length === 0 ? '' :
                                                                <ul className="object-two-ul">
                                                                    {it.ChildrenNode.map((t, d) => {
                                                                        return (<li data-objtype={t.ObjType} data-objid={t.ObjId} data-objname={t.ObjName} data-objuniqid={t.ObjUniqID} data-objparentuniqid={t.ObjParentUniqID} key={d} className="object-choose-two" onClick={(e) => { this.chooseObjectinfo(e) }} ><span><i name='2' className={t.NodeSelectState === 'unselected' ? "object-choose-false" : t.NodeSelectState === 'selected' ? "object-choose-true" : "object-choose-some"} ></i>{t.ObjName}</span>
                                                                        </li>);
                                                                    })
                                                                    }
                                                                </ul>
                                                            }

                                                        </li>);
                                                    })
                                                    }
                                                </ul>
                                            }
                                        </li>
                                    )
                                })
                                }
                            </ul>
                        </div>}
                    </div>
                    <div className="notice-people-listHight" ></div>
                </Modal>
            </div>
        )
    }
}

export default CreateNotice;