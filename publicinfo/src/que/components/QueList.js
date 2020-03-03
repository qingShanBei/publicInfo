import React, { Component } from 'react';
import Search from '../../common/compont/Search';
import './scss/QueList.scss';
import $ from 'jquery';
import { getData } from '../../common/js/fetch';
import { message, Modal, Radio, Checkbox } from 'antd';
import Alert from '../../common/compont/alert_dialog_wrapper';
import QueView from './QueView';

class QueList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            QtnList: [],
            Total: 0,
            chooseType1: 'QueList-choose-type',
            chooseType2: '',
            NameList: {},
            ServerDate: '',
            isOpen: false,
            isOpen1: false,
            isOpen2: false,
            isOpen3: false,
            isOpen4: false,
            isOpen5: false,
            QtnID: '',
            visible: false,
            // visible0: false,
            visible1: false,
            visible2: false,
            visible3: false,
            popupList: [],
            popupTotal: 0,
            popupType: 0,
            QueContent: {},
            QueViewid: '',
            value: '',
            openAddEvent:false,

        }
        this.objectListslice = this.objectListslice.bind(this);
        this.getChildrenMsg = this.getChildrenMsg.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleCancel1 = this.handleCancel1.bind(this);
        this.handleCancel2 = this.handleCancel2.bind(this);
        this.handleCancel3 = this.handleCancel3.bind(this);
        this.handleCancel4 = this.handleCancel4.bind(this);
        this.handleCancel6 = this.handleCancel6.bind(this);
        this.getPopupSearch = this.getPopupSearch.bind(this);


    }
    // 挂载前
    componentDidMount() {
        //检测用户是否有未保存问卷
        getData('PublicInfo/Que/PersonalQtnMgr/CheckTemporaryQtnExist', {
            UserID: sessionStorage.getItem('UserID'),
            UserType: sessionStorage.getItem('UserType'),
        }).then((res) => {
            return res.json()
        }).then((json) => {
            if (json.StatusCode === 200 && json.Data.BackCode == 1) {
                this.setState({
                    isOpen4: true
                })
            }
            if (json.Data.BackCode == 2) {
                this.getQuelist();
            }

        })

    }
    addEvent(elm, event, handler) {
        if (window.attachEvent) {
            elm.attachEvent("on" + event, handler);
        } else if (window.addEventListener) {
            elm.addEventListener(event, handler);
        } else {
            elm['on' + event] = handler;
        }
    }
    getQuelist() {
        getData('PublicInfo/Que/PersonalQtnMgr/GetQtnList', {
            UserID: sessionStorage.getItem('UserID'),
            UserType: sessionStorage.getItem('UserType'),
            QueryRange: 2,
            TitleKeyword: '',
            PageIndex: 1,
            PageSize: 9,
        }).then((res) => {
            return res.json()
        }).then((json) => {
            if (json.StatusCode === 200) {
                json.Data.QtnList.map((item, idx) => {
                    json.Data.QtnList[idx].ObjNamestr = this.objectListslice(item.ObjNameList)[0];
                    json.Data.QtnList[idx].NameList = this.objectListslice(item.ObjNameList)[1];
                })
                this.setState({
                    QtnList: json.Data.QtnList,
                    Total: json.Data.Total,
                    ServerDate: json.Data.ServerDate
                })
            } else {
                message.error(json.Msg, 3);
            }

        })
    }
    chooseType(id, classname) {
        $('.QueList-div-pupop').hide();
        // console.log(classname);
        if (!classname) {
            if (id === 2) {
                this.setState({
                    chooseType1: 'QueList-choose-type',
                    chooseType2: '',
                })
            } else {
                this.setState({
                    chooseType2: 'QueList-choose-type',
                    chooseType1: '',
                })
            }
            getData('PublicInfo/Que/PersonalQtnMgr/GetQtnList', {
                UserID: sessionStorage.getItem('UserID'),
                UserType: sessionStorage.getItem('UserType'),
                QueryRange: id,
                TitleKeyword: '',
                PageIndex: 1,
                PageSize: 9,
            }).then((res) => {
                return res.json()
            }).then((json) => {
                // console.log(json);
                json.Data.QtnList.map((item, idx) => {
                    json.Data.QtnList[idx].ObjNamestr = this.objectListslice(item.ObjNameList)[0];
                    json.Data.QtnList[idx].NameList = this.objectListslice(item.ObjNameList)[1];
                })
                this.setState({
                    QtnList: json.Data.QtnList,
                    Total: json.Data.Total,
                    ServerDate: json.Data.ServerDate
                })
            })
        }
    }
    //搜索相应的问卷
    getChildrenMsg(e, keyword,type) {
        // const hide = message.loading('正在加载..', 0);
       
        if (keyword === '') {

           if(!type){
            if (this.state.chooseType1 !== '' || this.state.chooseType2 !== '') {
                return;
            }
           }
            let QueryRange = 2;
            if(type==1){
                QueryRange = 1;
                this.setState({
                    chooseType1: '',
                    chooseType2: 'QueList-choose-type',
                })
            }else{
                this.setState({
                    chooseType1: 'QueList-choose-type',
                    chooseType2: '',
                })
            }
            getData('PublicInfo/Que/PersonalQtnMgr/GetQtnList', {
                UserID: sessionStorage.getItem('UserID'),
                UserType: sessionStorage.getItem('UserType'),
                QueryRange: QueryRange,
                TitleKeyword: '',
                PageIndex: 1,
                PageSize: 9,
            }).then((res) => {
                return res.json()
            }).then((json) => {
                // console.log(json);
                // hide();
                if (json.Data.QtnList.length > 0) {
                    json.Data.QtnList.map((item, idx) => {
                        json.Data.QtnList[idx].ObjNamestr = this.objectListslice(item.ObjNameList)[0];
                        json.Data.QtnList[idx].NameList = this.objectListslice(item.ObjNameList)[1];
                    })
                }
                this.setState({
                    QtnList: json.Data.QtnList,
                    Total: json.Data.Total,
                    ServerDate: json.Data.ServerDate,
                   
                })
            })
        } else {
            getData('PublicInfo/Que/PersonalQtnMgr/GetQtnList', {
                UserID: sessionStorage.getItem('UserID'),
                UserType: sessionStorage.getItem('UserType'),
                QueryRange: 3,
                TitleKeyword: encodeURIComponent(keyword),
                PageIndex: 1,
                PageSize: 9,
            }).then((res) => {
                return res.json()
            }).then((json) => {
                // console.log(json);
                // hide();
                if (json.Data.QtnList.length > 0) {
                    json.Data.QtnList.map((item, idx) => {
                        json.Data.QtnList[idx].ObjNamestr = this.objectListslice(item.ObjNameList)[0];
                        json.Data.QtnList[idx].NameList = this.objectListslice(item.ObjNameList)[1];
                    })
                }
                this.setState({
                    QtnList: json.Data.QtnList,
                    Total: json.Data.Total,
                    ServerDate: json.Data.ServerDate,
                    chooseType1: '',
                    chooseType2: '',
                })
            })

        }

    }
    //获取调查对象详情
    objectListslice(ObjNameList) {
        let ObjNameArr = ObjNameList.split('$');
        let ObjNamestr = [];
        let NameList = [];
        ObjNameArr.map((item) => {
            if (item.slice(0, 2) == '全部') {
                if (item.indexOf('(') > -1) {
                    ObjNamestr.push(item.slice(0, item.indexOf('(')));
                    NameList.push({ 'name': item.slice(2, item.indexOf('(')), 'all': '全部' })
                } else {
                    ObjNamestr.push(item.slice(0, item.indexOf('(')));
                    NameList.push({ 'name': item.slice(2, item.length), 'all': '全部' })
                }

            } else {
                ObjNamestr.push('部分' + item.slice(0, item.indexOf(':')));
                NameList.push({ 'name': item.slice(0, item.indexOf(':')), 'all': item.slice(item.indexOf(':') + 1, item.length).replace(/\|/g, ",").replace(/;/g, "、") })

            }
        })
        // console.log([ObjNamestr, NameList]);
        return [ObjNamestr, NameList]


    };

    //打开详情调查对象详情
    changeListObj(e) {
        this.closepopup();
        // console.log(e.target.className);
        if (e.target.className === 'obj-b-some') {
            $('.QueList-div-pupop').show();
            let $this = $(e.target).next('.QueList-list-obj');
            let $this1 = $(e.target).children('.bg-i');
            // console.log($this.attr('class'))
            if ($this.children('ul').css('display') == 'none') {
                $this.children().show();
                $this1.show();
            } else {
                this.closepopup();
            }

        } else {
            this.closepopup();
        }

    }
    //设置是否分享问卷
    changeIsShared(e, id) {
        this.closepopup();
        let $this = $(e.target);
        let SetStatus = '';
        if ($this.attr('class') === 'QueList-list-open') {
            $this.attr('class', 'QueList-list-close');
            SetStatus = 0;
        } else {
            $this.attr('class', 'QueList-list-open');
            SetStatus = 1;
        }
        getData('PublicInfo/Que/PersonalQtnMgr/SetQtnShareStatus', {
            UserID: sessionStorage.getItem('UserID'),
            UserType: sessionStorage.getItem('UserType'),
            QtnID: id,
            PageIndex: '',
            SetStatus: SetStatus,
        }).then((res) => {
            return res.json()
        }).then((json) => {
            // console.log(json);

            if (json.StatusCode === 200 && json.Data.BackCode === 1) {
                message.success('设置成功~', 2);
            }
        })
    }
    //打开问卷操作弹窗
    changeDoUl(e) {
        if (e.target.nodeName === 'SPAN') {
            this.closepopup();
            $('.QueList-div-pupop').show();
            let $this = $(e.target);
            if ($this.children('ul').attr('class') === 'QueList-do-ul displayNone') {
                $this.children('ul').attr('class', 'QueList-do-ul displayInline');
            } else {
                this.closepopup();
            }
        }
    }
    //关闭弹窗层
    closepopup() {
        $('.QueList-div-pupop').hide();
        $('.QueList-do-ul').attr('class', 'QueList-do-ul displayNone');
        $('.QueList-list-objlist').hide();
        $('.bg-i').hide();
    }
    //跳转到作答统计
    answeringOpen(id) {
        // alert(id);
        this.closepopup();
        let url = window.location.href.split('?')[0] + '#/AnswerInfo?lg_tk=' + sessionStorage.getItem('token') + '&QtnID=' + id;
        window.open(url, '_blank')
    }
    //导出问卷
    ExportQtn(id,name) {
        // console.log(id);
        // var url = window.location.href.split('?')[0].slice(7, window.location.href.split('?')[0].length);
        // var url2 = url.slice(0, url.indexOf('/'));
        // if(url2.indexOf('localhost:')>-1){
            this.closepopup();
            message.config({
                top:50,
            })
             const hide = message.loading('正在导出，请稍后..', 0); 
            getData('PublicInfo/Que/PersonalQtnMgr/ExportQtn', {
                UserID: sessionStorage.getItem('UserID'),
                UserType: sessionStorage.getItem('UserType'),
                QtnID: id,
                DataError:1,
            }).then((res) => {
                // res =res;
                return res.blob()
            }).then((blob) => {
                // console.log(blob.size);
                if (blob.size < 140) {
                    hide();
                    message.config({
                        top:200,
                    })
                    message.error('该问卷不存在~',2);
                    return;
                }
                hide();
                message.config({
                    top:200,
                })
                let alink = document.createElement('a');
                alink.style.display = 'none'
                alink.href = window.URL.createObjectURL(blob);
                let fileName = name + ".doc";
                alink.download = fileName;
                // alink.download = res.headers.get('Content-Disposition');   // 设置文件名
                document.body.appendChild(alink)
                alink.click();
                URL.revokeObjectURL(alink.href) // 释放URL 对象
                document.body.removeChild(alink);
            })
        // }else{
        //     let alink = document.createElement('a');
        //     alink.style.display = 'none';
        //     alink.href = '../../../Que/PersonalQtnMgr/ExportQtn?UserID='+ sessionStorage.getItem('UserID')+'&UserType='+ sessionStorage.getItem('UserType')+'&QtnID='+id;
        //     // let fileName = name ;
        //     // alink.download = fileName;
        //     // alink.download = res.headers.get('Content-Disposition');   // 设置文件名
        //     document.body.appendChild(alink)
        //     alink.click();
        //     // URL.revokeObjectURL(alink.href) // 释放URL 对象
        //     document.body.removeChild(alink);
        // }
       
      
    }
    //问卷提前结束
    SetQtnFinished(str) {
        if (str) {
            getData('PublicInfo/Que/PersonalQtnMgr/SetQtnFinished', {
                UserID: sessionStorage.getItem('UserID'),
                UserType: sessionStorage.getItem('UserType'),
                QtnID: this.state.QtnID,
            }).then((res) => {
                return res.json()
            }).then((json) => {

                // console.log(json);
                if (json.StatusCode === 200 && json.Data.BackCode === 1) {

                    getData('PublicInfo/Que/PersonalQtnMgr/GetQtnList', {
                        UserID: sessionStorage.getItem('UserID'),
                        UserType: sessionStorage.getItem('UserType'),
                        QueryRange: 2,
                        TitleKeyword: '',
                        PageIndex: 1,
                        PageSize: 9,
                    }).then((res) => {
                        return res.json()
                    }).then((json) => {
                        json.Data.QtnList.map((item, idx) => {
                            json.Data.QtnList[idx].ObjNamestr = this.objectListslice(item.ObjNameList)[0];
                            json.Data.QtnList[idx].NameList = this.objectListslice(item.ObjNameList)[1];
                        })
                        this.setState({
                            QtnList: json.Data.QtnList,
                            Total: json.Data.Total,
                            ServerDate: json.Data.ServerDate
                        })
                    })
                }
            })
        }
        this.setState({
            isOpen: false
        })
        this.closepopup();
    }
    //撤回问卷
    RevokeQtn(str) {
        if (str) {
            getData('PublicInfo/Que/PersonalQtnMgr/RevokeQtn', {
                UserID: sessionStorage.getItem('UserID'),
                UserType: sessionStorage.getItem('UserType'),
                QtnID: this.state.QtnID,
            }).then((res) => {
                return res.json()
            }).then((json) => {

                // console.log(json);
                if (json.StatusCode === 200 && json.Data.BackCode === 1) {
                    this.closepopup();
                    getData('PublicInfo/Que/PersonalQtnMgr/GetQtnList', {
                        UserID: sessionStorage.getItem('UserID'),
                        UserType: sessionStorage.getItem('UserType'),
                        QueryRange: 2,
                        TitleKeyword: '',
                        PageIndex: 1,
                        PageSize: 9,
                    }).then((res) => {
                        return res.json()
                    }).then((json) => {
                        json.Data.QtnList.map((item, idx) => {
                            json.Data.QtnList[idx].ObjNamestr = this.objectListslice(item.ObjNameList)[0];
                            json.Data.QtnList[idx].NameList = this.objectListslice(item.ObjNameList)[1];
                        })
                        this.setState({
                            QtnList: json.Data.QtnList,
                            Total: json.Data.Total,
                            ServerDate: json.Data.ServerDate
                        })
                    })
                }
            })
        }
        this.setState({
            isOpen1: false
        })

    }
    //撤回并删除问卷
    RevokeAndDeleteQtn(str) {
        if (str) {
            getData('PublicInfo/Que/PersonalQtnMgr/RevokeAndDeleteQtn', {
                UserID: sessionStorage.getItem('UserID'),
                UserType: sessionStorage.getItem('UserType'),
                QtnID: this.state.QtnID,
            }).then((res) => {
                return res.json()
            }).then((json) => {
                // console.log(json);
                if (json.StatusCode === 200 && json.Data.BackCode === 1) {
                    getData('PublicInfo/Que/PersonalQtnMgr/GetQtnList', {
                        UserID: sessionStorage.getItem('UserID'),
                        UserType: sessionStorage.getItem('UserType'),
                        QueryRange: 2,
                        TitleKeyword: '',
                        PageIndex: 1,
                        PageSize: 9,
                    }).then((res) => {
                        return res.json()
                    }).then((json) => {
                        json.Data.QtnList.map((item, idx) => {
                            json.Data.QtnList[idx].ObjNamestr = this.objectListslice(item.ObjNameList)[0];
                            json.Data.QtnList[idx].NameList = this.objectListslice(item.ObjNameList)[1];
                        })
                        this.setState({
                            QtnList: json.Data.QtnList,
                            Total: json.Data.Total,
                            ServerDate: json.Data.ServerDate
                        })
                    })
                }
            })
        }
        this.setState({
            isOpen2: false,
            isOpen5: false
        })

    }
    //删除问卷
    DeleteQtn(str) {
        if (str) {
            getData('PublicInfo/Que/PersonalQtnMgr/DeleteQtn', {
                UserID: sessionStorage.getItem('UserID'),
                UserType: sessionStorage.getItem('UserType'),
                QtnID: this.state.QtnID,
            }).then((res) => {
                return res.json()
            }).then((json) => {
                // console.log(json);
                if (json.StatusCode === 200 && json.Data.BackCode === 1) {
                    getData('PublicInfo/Que/PersonalQtnMgr/GetQtnList', {
                        UserID: sessionStorage.getItem('UserID'),
                        UserType: sessionStorage.getItem('UserType'),
                        QueryRange: 1,
                        TitleKeyword: '',
                        PageIndex: 1,
                        PageSize: 9,
                    }).then((res) => {
                        return res.json()
                    }).then((json) => {
                        json.Data.QtnList.map((item, idx) => {
                            json.Data.QtnList[idx].ObjNamestr = this.objectListslice(item.ObjNameList)[0];
                            json.Data.QtnList[idx].NameList = this.objectListslice(item.ObjNameList)[1];
                        })
                        this.setState({
                            QtnList: json.Data.QtnList,
                            Total: json.Data.Total,
                            ServerDate: json.Data.ServerDate
                        })
                        this.closepopup();
                    })
                }
            })

        }
        this.setState({
            isOpen3: false
        })

    }
    createQue() {
        this.setState({
            visible: true,
        })
    }
    crateQueType1() {
        let url = window.location.href.split('?')[0] + '#/EditQue?lg_tk=' + sessionStorage.getItem('token') + '&QueType=0';
        window.open(url, '_blank');
        let $this =this;
        
        if(!this.state.openAddEvent){
            this.setState({
                openAddEvent:true,
            })
            $this.addEvent(window, 'message', function(e) {
                try {
                    if(e.data==1&&$this.state.chooseType1==''){
                        $this.getChildrenMsg('','',1);
                    }else if(e.data==2&&$this.state.chooseType2==''){
                        $this.getChildrenMsg('','',2);
                    }
                } catch (ex) {
                }
            }, false);
        }
      
    }
    gottoEditQue(id, type) {
        let url = window.location.href.split('?')[0] + '#/EditQue?lg_tk=' + sessionStorage.getItem('token') + '&QueType=' + type + '&QueID=' + id;
        window.open(url, '_blank');
        // alert(1111);
        let $this =this;
        if(!this.state.openAddEvent){
            this.setState({
                openAddEvent:true,
            })
            $this.addEvent(window, 'message', function(e) {
                try {
                    if(e.data==1&&$this.state.chooseType1==''){
                        $this.getChildrenMsg('','',1);
                    }else if(e.data==2&&$this.state.chooseType2==''){
                        $this.getChildrenMsg('','',2);
                    }
                } catch (ex) {
                }
            }, false);
        }
    }
    crateQueType2() {
        getData('PublicInfo/Que/CreateQtn/GetSendedQtnList', {
            UserID: sessionStorage.getItem('UserID'),
            UserType: sessionStorage.getItem('UserType'),
            TitleKeyword: '',
            PageIndex: 1,
            PageSize: 9,
        }).then((res) => {
            return res.json()
        }).then((json) => {
            this.setState({
                popupList: json.Data.QtnList,
                popupTotal: json.Data.Total,
                visible1: true,
                popupType: 1,
            })
        })

    }
    crateQueType3() {
        getData('PublicInfo/Que/CreateQtn/GetSharedQtnList', {
            UserID: sessionStorage.getItem('UserID'),
            UserType: sessionStorage.getItem('UserType'),
            TitleKeyword: '',
            PageIndex: 1,
            PageSize: 9,
        }).then((res) => {
            return res.json()
        }).then((json) => {
            this.setState({
                popupList: json.Data.QtnList,
                popupTotal: json.Data.Total,
                visible2: true,
                popupType: 2,
            })
        })

    }
    crateQueType4() {
        getData('PublicInfo/Que/CreateQtn/GetQtnTemplateList', {
            UserID: sessionStorage.getItem('UserID'),
            UserType: sessionStorage.getItem('UserType'),
            TitleKeyword: '',
            PageIndex: 1,
            PageSize: 9,
        }).then((res) => {
            return res.json()
        }).then((json) => {
            this.setState({
                popupList: json.Data.QtnTemplateList,
                popupTotal: json.Data.Total,
                visible3: true,
                popupType: 3,
            })
        })

    }
    handleCancel() {
        this.setState({
            visible: false,
        })
    }
    handleCancel1() {
        this.setState({
            visible1: false,
        })
    }
    handleCancel2() {
        this.setState({
            visible2: false,
        })
    }
    handleCancel3() {
        this.setState({
            visible3: false,
        })
    }
    handleCancel4() {
        this.setState({
            visible4: false,
        })
    }
    handleCancel6() {
        this.setState({
            visible6: false,
        })
    }
    getPopupSearch(e, keyword) {
        if (this.state.popupType === 1) {
            getData('PublicInfo/Que/CreateQtn/GetSendedQtnList', {
                UserID: sessionStorage.getItem('UserID'),
                UserType: sessionStorage.getItem('UserType'),
                TitleKeyword: encodeURIComponent(keyword),
                PageIndex: 1,
                PageSize: 9,
            }).then((res) => {
                return res.json()
            }).then((json) => {
                // console.log(json);

                this.setState({
                    popupList: json.Data.QtnList,
                    popupTotal: json.Data.Total,
                })
            })
        }
        if (this.state.popupType === 2) {
            getData('PublicInfo/Que/CreateQtn/GetSharedQtnList', {
                UserID: sessionStorage.getItem('UserID'),
                UserType: sessionStorage.getItem('UserType'),
                TitleKeyword: encodeURIComponent(keyword),
                PageIndex: 1,
                PageSize: 9,
            }).then((res) => {
                return res.json()
            }).then((json) => {
                this.setState({
                    popupList: json.Data.QtnList,
                    popupTotal: json.Data.Total,
                })
            })
        } else if (this.state.popupType === 3) {
            getData('PublicInfo/Que/CreateQtn/GetQtnTemplateList', {
                UserID: sessionStorage.getItem('UserID'),
                UserType: sessionStorage.getItem('UserType'),
                TitleKeyword: encodeURIComponent(keyword),
                PageIndex: 1,
                PageSize: 9,
            }).then((res) => {
                return res.json()
            }).then((json) => {
                this.setState({
                    popupList: json.Data.QtnTemplateList,
                    popupTotal: json.Data.Total,
                })
            })
        }

    }

    queView(id, type) {
        let url = '';
        if (type === 2) {
            url = 'PublicInfo/Que/CreateQtn/GetSendedQtnContent';
        }
        else if (type === 3) {
            url = 'PublicInfo/Que/CreateQtn/GetQtnTemplateContent';
        }
        else if(type === 7){
            url ='PublicInfo/Que/CreateQtn/GetSharedQtnContent';
        }
        getData(url, {
            UserID: sessionStorage.getItem('UserID'),
            UserType: sessionStorage.getItem('UserType'),
            QtnID: id,
        }).then((res) => {
            return res.json()
        }).then((json) => {
            // console.log(json);
            let QueContent = json.Data.Questionnaire;
            this.setState({
                visible6: true,
                QueContent: QueContent,
                QueViewid: id,

            })
        })
    }
    change_radio(a, c, e) {
        console.log(a, c, e);
        // if(a==='checkbox'&&b.length>2){
        //     interface  options{}
        //     }else{
        //     }
    }
    gettoEditQue(id) {
        let url = window.location.href.split('?')[0] + '#/EditQue?lg_tk=' + sessionStorage.getItem('token') + '&QueType=1&QueID=' + id;
        window.open(url, '_blank');
        let $this =this;
        if(!this.state.openAddEvent){
            this.setState({
                openAddEvent:true,
            })
            $this.addEvent(window, 'message', function(e) {
                try {
                    if(e.data==1&&$this.state.chooseType1==''){
                        $this.getChildrenMsg('','',1);
                    }else if(e.data==2&&$this.state.chooseType2==''){
                        $this.getChildrenMsg('','',2);
                    }
                } catch (ex) {
                }
            }, false);
        }
      
      
    }
    gottoEditQueFn(data) {
        if (data) {
            let url = window.location.href.split('?')[0] + '#/EditQue?lg_tk=' + sessionStorage.getItem('token') + '&QueType=6';
            window.open(url, '_blank');
            let $this =this;
            if(!this.state.openAddEvent){
                this.setState({
                    openAddEvent:true,
                })
                $this.addEvent(window, 'message', function(e) {
                    try {
                        if(e.data==1&&$this.state.chooseType1==''){
                            $this.getChildrenMsg('','',1);
                        }else if(e.data==2&&$this.state.chooseType2==''){
                            $this.getChildrenMsg('','',2);
                        }
                    } catch (ex) {
                    }
                }, false);
            }
          
          
        } else {
            getData('PublicInfo/Que/PersonalQtnMgr/DeleteTemporaryQtn', {
                UserID: sessionStorage.getItem('UserID'),
                UserType: sessionStorage.getItem('UserType'),
            }).then((res) => {
                return res.json()
            }).then((json) => {

            })
        }
        this.setState({
            isOpen4: false
        })
        this.getQuelist();
    }
    render() {
        return (
            <div className='QueList-div clearfix'>
                <div>
                    <span className='Que-create-button' onClick={() => { this.createQue() }}><i></i>创建问卷</span>
                    <div className='QueList-Seacch'><Search getChildrenMsg={this.getChildrenMsg}></Search></div>
                </div>
                <span className='QueList-top-border'></span>
                <ul className='QueList-type'>
                    <li className={this.state.chooseType1} onClick={() => { this.chooseType(2, this.state.chooseType1) }}>已发问卷</li>
                    <li className={this.state.chooseType2} onClick={() => { this.chooseType(1, this.state.chooseType2) }} >未发问卷</li>
                </ul>
                {this.state.QtnList.length > 0 ? <ul className='QueList-list-ul QueList-list-Unissued clearfix'>
                    {this.state.QtnList.map((item, idx) => {
                        if (item.ReleaseStatus === 2) {
                            return <li key={idx} className={Date.parse(item.ExpireDate) >= Date.parse(this.state.ServerDate) ? 'QueList-list-li' : 'QueList-list-li QueList-list-liold'}>
                                <span><b>{item.QtnName}</b></span>
                                <span style={{position:'relative'}}><b>调查对象:</b>{item.ObjNamestr.map((item3, idx3) => {
                                    return <b className='obj-b' key={idx3}> <b className={item3.slice(0, 2) === '全部' ? 'obj-b-all' : 'obj-b-some'} onClick={(e) => { this.changeListObj(e) }}>{item3}<i className='bg-i'></i> </b> <i className='QueList-list-obj' >  <ul className='QueList-list-objlist' style={{ 'display': 'none' }}  >
                                    <li >  <i></i><span>{item.NameList[idx3].name}</span><b>{item.NameList[idx3].all}</b></li>
                                </ul></i><b className={item3.slice(0, 2) === '全部' ? 'obj-b-all obj-b2' : 'obj-b-some obj-b2'}>{idx3 === item.ObjNamestr.length - 1 ? '' : '、'}</b></b>
                                })}
                                {/* <i className='QueList-list-obj' onClick={(e) => { this.changeListObj(e) }}> <i className='bg-i'></i> <ul className='QueList-list-objlist' style={{ 'display': 'none' }}  >
                                    {item.NameList.map((it, id) => {
                                        return <li key={id}>  <i></i><span>{it.name}</span><b>{it.all}</b></li>
                                    })}
                                </ul></i> */}
                                </span>
                                <span><b>已收答卷:</b>{item.RespondentCount}份 </span>
                                <span><b>发布时间:</b> {item.PublishTime.slice(0, 16)}</span>
                                <span><b>截止日期:</b>{item.ExpireDate} </span>
                                <span><b>共享状态:</b><i className={item.IsShared === 0 ? 'QueList-list-close' : 'QueList-list-open'} onClick={(e) => { this.changeIsShared(e, item.QtnID) }}></i></span> {item.IsShared > 0 && item.SharedQtnUseCount > 0 ? <span className='SharedQtnUseCount'>已被使用<b>{item.SharedQtnUseCount}</b>次</span>
                                    : ''}
                                {Date.parse(item.ExpireDate) >= Date.parse(this.state.ServerDate) ? <i className='runningPng'></i> : <i className='finishPng'></i>}
                                <span className='QueList-list-message' onClick={() => { this.answeringOpen(item.QtnID) }}>作答统计</span>
                                {Date.parse(item.ExpireDate) >= Date.parse(this.state.ServerDate) ? <span className='QueList-list-do noselect' onClick={(e) => { this.changeDoUl(e) }}>
                                    <ul className='QueList-do-ul displayNone' >
                                        <li onClick={() => { this.setState({ isOpen: true, QtnID: item.QtnID }) }}> 提前结束</li>
                                        <li> </li>
                                        <li onClick={() => { this.ExportQtn(item.QtnID,item.QtnName) }}> 导出问卷</li>
                                        <li> </li>
                                        <li onClick={() => { this.setState({ isOpen1: true, QtnID: item.QtnID }) }}> 撤回</li>
                                        <li onClick={() => { this.setState({ isOpen2: true, QtnID: item.QtnID }) }}> 撤回并删除</li>
                                        <li> </li>
                                    </ul>

                                </span> : <span className='QueList-list-do noselect' onClick={(e) => { this.changeDoUl(e) }}>
                                        <ul className='QueList-do-ul displayNone' unselectable="on" >
                                            <li onClick={() => { this.ExportQtn(item.QtnID,item.QtnName) }}> 导出问卷</li>
                                            <li> </li>
                                            <li onClick={() => { this.setState({ isOpen5: true, QtnID: item.QtnID }) }}> 删除</li>
                                            <li> </li>
                                        </ul>

                                    </span>}
                            </li>
                        } else {
                            return <li key={idx} className='QueList-list-li  QueList-Unissued-li  clearfix'>
                                <span><b>{item.QtnName}</b></span>
                                <span><b>题目结构:</b>{item.TopicCount.split('|').length >= 1 && item.TopicCount.split('|')[0] > 0 ? <b>选择题<i>{item.TopicCount.split('|')[0]}</i>道 </b> : ''}{item.TopicCount.split('|').length >= 2 && item.TopicCount.split('|')[1] > 0 ? <b>{item.TopicCount.split('|')[0] > 0 ? '，' : ''}简答题<i>{item.TopicCount.split('|')[1]}</i>道 </b> : ''}</span>
                                <span><b>最后编辑:</b>{item.EditTime.slice(0, 16)}</span>
                                <span className='QueList-list-message' onClick={() => { this.gettoEditQue(item.QtnID) }} >编辑</span>
                                <span className='QueList-list-do noselect' onClick={(e) => { this.changeDoUl(e) }}>
                                    <ul className='QueList-do-ul displayNone' unselectable="on" >
                                        <li onClick={() => { this.ExportQtn(item.QtnID,item.QtnName) }} > 导出问卷</li>
                                        <li > </li>
                                        <li onClick={() => { this.setState({ isOpen3: true, QtnID: item.QtnID }) }}> 删除</li>
                                        <li> </li>
                                    </ul>
                                </span>
                            </li>
                        }
                    })}
                </ul> : <div style={{'minHeight':'400px'}}> <i className='empty-que-bg'></i> <p style={{ 'fontSize':'14px','lineHeight': '20px', 'textAlign': 'center' }}>暂无符合条件的资料~</p></div>}
                <div className='QueList-div-pupop' onClick={(e) => { this.closepopup(e) }}></div>
                <Alert message='您确定要提前结束该问卷调查么?' isOpen={this.state.isOpen} chooseFn={(data) => { this.SetQtnFinished(data) }}></Alert>
                <Alert message='您确定要撤回该问卷调查么?' isOpen={this.state.isOpen1} chooseFn={(data) => { this.RevokeQtn(data) }}></Alert>
                <Alert message={this.state.isOpen5 ? '您确定要删除该问卷调查么?' : '您确定要撤回并删除该问卷调查么?'} isOpen={this.state.isOpen2 || this.state.isOpen5} chooseFn={(data) => { this.RevokeAndDeleteQtn(data) }}></Alert>
                <Alert message='您确定要删除该问卷调查么?' isOpen={this.state.isOpen3} chooseFn={(data) => { this.DeleteQtn(data) }}></Alert>
                <Alert message='您有未保存的问卷，是否继续编辑?' isOpen={this.state.isOpen4} chooseFn={(data) => { this.gottoEditQueFn(data) }}></Alert>
                <Modal
                    className='create-QueModal'
                    title="请选择创建方式"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={null}
                    width='790px'
                    destroyOnClose={true}
                    centered={true}
                >
                    <span onClick={() => { this.crateQueType1() }}> </span>
                    <span onClick={() => { this.crateQueType2() }}></span>
                    <span onClick={() => { this.crateQueType3() }}> </span>
                    <span onClick={() => { this.crateQueType4() }}></span>
                </Modal>
                <Modal
                    className='create-QueModal1'
                    title="复制已发问卷"
                    visible={this.state.visible1}
                    onOk={this.handleOk1}
                    onCancel={this.handleCancel1}
                    footer={null}
                    width='824px'
                    destroyOnClose={true}
                    centered={true}
                    mask={false}
                >
                    <div className='createQue-Seacch  clearfix'><Search getChildrenMsg={this.getPopupSearch}></Search></div>
                    {this.state.popupType == 1 && this.state.popupList && this.state.popupList.length > 0 ? <div>
                        <table>
                            <thead>
                                <tr>
                                    <th width='433'>问卷标题</th>
                                    <th width='80'>题目数量</th>
                                    <th width='200'>最后编辑</th>
                                    <th width='200'>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.popupList.map((item) => {
                                    return <tr key={item.QtnID}>
                                        <td><i></i> <span title={item.QtnName}>{item.QtnName}</span> </td>
                                        <td>{item.TopicCount.split('|')[0]*1+item.TopicCount.split('|')[1]*1} </td>
                                        <td>{item.EditTime.slice(0, 16)} </td>
                                        <td><span onClick={() => { this.queView(item.QtnID, 2) }} >预览</span> <span onClick={() => { this.gottoEditQue(item.QtnID, 2) }}>复制</span> </td>
                                    </tr>
                                })}
                            </tbody>
                        </table></div> :<div style={{'minHeight':'400px'}}> <i style={{marginLeft:'260px'}} className='empty-que-bg'></i> <p style={{ 'fontSize':'14px','lineHeight': '20px', 'textAlign': 'center' }}>暂无符合条件的资料~</p></div>}
                </Modal>
                <Modal
                    className='create-QueModal2'
                    title="使用共享问卷"
                    visible={this.state.visible2}
                    onOk={this.handleOk2}
                    onCancel={this.handleCancel2}
                    footer={null}
                    width='990px'
                    destroyOnClose={true}
                    centered={true}
                    mask={false}
                >
                    <div className='createQue-Seacch  clearfix'><Search getChildrenMsg={this.getPopupSearch}></Search></div>
                    {this.state.popupType == 2 && this.state.popupList && this.state.popupList.length > 0 ? <div>
                        <table>
                            <thead>
                                <tr>
                                    <th width='343'>问卷标题</th>
                                    <th width='160'>共享者</th>
                                    <th width='120'>使用次数</th>
                                    <th width='120'>题目数量</th>
                                    <th width='210'>最后编辑时间</th>
                                    <th width='210'>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.popupList.map((item) => {
                                    return <tr key={item.QtnID}>
                                        <td><i></i> <span title={item.QtnName}>{item.QtnName}</span> </td>
                                        <td>{item.CreatorName} </td>
                                        <td>{item.SharedQtnUseCount ? item.SharedQtnUseCount : 0} </td>
                                        <td>{item.TopicCount.split('|')[0]*1+item.TopicCount.split('|')[1]*1} </td>
                                        <td>{item.EditTime.slice(0, 16)} </td>
                                        <td><span onClick={() => { this.queView(item.QtnID, 7) }} >预览</span> <span onClick={() => { this.gottoEditQue(item.QtnID, 7) }}>使用</span> </td>
                                    </tr>
                                })}
                            </tbody>
                        </table></div> : <div style={{'minHeight':'400px'}}> <i style={{marginLeft:'342px'}} className='empty-que-bg'></i> <p style={{ 'fontSize':'14px','lineHeight': '20px', 'textAlign': 'center' }}>暂无符合条件的资料~</p></div>}
                </Modal>
                <Modal
                    className='create-QueModal3'
                    title="使用问卷模板"
                    visible={this.state.visible3}
                    onOk={this.handleOk3}
                    onCancel={this.handleCancel3}
                    footer={null}
                    width='824px'
                    destroyOnClose={true}
                    centered={true}
                    mask={false}
                >
                    <div className='createQue-Seacch  clearfix'><Search getChildrenMsg={this.getPopupSearch}></Search></div>
                    {this.state.popupType == 3 && this.state.popupList && this.state.popupList.length > 0 ? <div>
                        <table>
                            <thead>
                                <tr>
                                    <th width='433'>问卷标题</th>
                                    <th width='160'>使用次数</th>
                                    <th width='160'>题目数量</th>
                                    <th width='200'>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.popupList.map((item) => {
                                    return <tr key={item.QtnID}>
                                        <td><i></i> <span title={item.QtnName}>{item.QtnName}</span> </td>
                                        <td>{item.SharedQtnUseCount ? item.SharedQtnUseCount : 0} </td>
                                        <td>{item.TopicCount.split('|')[0]*1+item.TopicCount.split('|')[1]*1} </td>
                                        <td><span onClick={() => { this.queView(item.QtnID, 3) }}>预览</span> <span onClick={() => { this.gottoEditQue(item.QtnID, 3) }}>使用</span> </td>
                                    </tr>
                                })}
                            </tbody>
                        </table></div> :<div style={{'minHeight':'400px'}}> <i style={{marginLeft:'260px'}} className='empty-que-bg'></i> <p style={{ 'fontSize':'14px','lineHeight': '20px', 'textAlign': 'center' }}>暂无符合条件的资料~</p></div>}
                </Modal>
                <QueView QueContent={this.state.QueContent} visible={this.state.visible6} handleCancel={this.handleCancel6} ></QueView>
            </div>
        )
    }
}
export default QueList;