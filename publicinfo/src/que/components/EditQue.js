import React, { Component } from 'react';
import Footer from '../../common/compont/Footer';
import Header from '../../common/compont/Header';
import Alert from '../../common/compont/alert_dialog_wrapper';
import QueView from './QueView';
import AddQueTopic from './AddQueTopic';
import AddQueMore from './AddQueMore';
import ReleaseQue from './ReleaseQue';

// import QueList from './QueList';
import './scss/Quemain.scss';
import './scss/EditQue.scss';
import './scss/QueList.scss';
import { getData, getQueryVariable, postData } from '../../common/js/fetch';
import { message, Modal, Radio, Checkbox } from 'antd';
import Item from 'antd/lib/list/Item';
import $ from 'jquery';
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
let tiemr2 = null;
class EditQue extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chooseQueList: [],
            listchooseCount: 1,
            QueContent: {
                QtnName: '',
                QtnExplanation: '',
                QtnTopicList: [],
                QtnID: '',
            },
            QueViewid: '',
            QtnTopicList: [],
            message: '是否删除该题目？',
            open: false,
            className1: 'QueEdit-left-choose',
            className2: '',
            className3: 'QueEdit-li-choose',
            className4: '',
            openCollectClass: 'QueEidt-left-popup',
            needFixed: false,
            visible: false,
            visibleAdd: false,
            TopicLibList: [],
            chooseCollect: [],
            AddType: 1,
            EditQueArr: [],
            visibleAddMore: false,
            visibleRelease: false,
            Questionnaire: {},
            EditQueName: false,
            EditQueIdx:'',
            chooseCollectId:'',

        }
        this.handleCancel = this.handleCancel.bind(this);
        this.closeAddFn = this.closeAddFn.bind(this);
        this.AddQueTopicFn = this.AddQueTopicFn.bind(this);
        this.OpenAddMore = this.OpenAddMore.bind(this);
        this.closeAddMoreFn = this.closeAddMoreFn.bind(this);
        this.AddQueTopicMoreFn = this.AddQueTopicMoreFn.bind(this);
        this.hideModalRelease = this.hideModalRelease.bind(this);

        // this.getChildrenMsg = this.getChildrenMsg.bind(this);
    }
    componentWillMount() {
        this.someFunction();
        this.SaveTemporaryQtnFn();
        if (getQueryVariable('QueType') === '0') {
            return;
        }
        let url = '';
        if (getQueryVariable('QueType') === '1') {
            url = 'PublicInfo/Que/PersonalQtnMgr/GetQtnContent';
        }
        if (getQueryVariable('QueType') === '2') {
            url = 'PublicInfo/Que/CreateQtn/GetSendedQtnContent';
        }
        if (getQueryVariable('QueType') === '3') {
            url = 'PublicInfo/Que/CreateQtn/GetQtnTemplateContent';
        }
        if (getQueryVariable('QueType') === '6') {
            url = 'PublicInfo/Que/PersonalQtnMgr/GetTemporaryQtnContent';
        }
        if (getQueryVariable('QueType') === '7') {
            url = 'PublicInfo/Que/CreateQtn/GetSharedQtnContent';
        }

        getData(url, {
            UserID: sessionStorage.getItem('UserID'),
            UserType: sessionStorage.getItem('UserType'),
            QtnID: getQueryVariable('QueID'),
        }).then((res) => {
            return res.json()
        }).then((json) => {
            // console.log(json);
            if (json.StatusCode === 200 && (json.Data.BackCode === 1 || !json.Data.BackCode)) {
                let QueContent = {};
                if (json.Data.Questionnaire) {
                    QueContent = json.Data.Questionnaire;
                } else {
                    QueContent = json.Data.QtnContent;
                }
                if (QueContent.QtnTopicList) {
                    this.setState({
                        QueContent: QueContent,
                        QtnTopicList: QueContent.QtnTopicList,
                        QueViewid: QueContent.QtnID,
                    })
                    sessionStorage.setItem('QueID', QueContent.QtnID);
                } else {
                    this.setState({
                        QueContent: QueContent,
                        QueViewid: QueContent.QtnID,
                    })
                    sessionStorage.setItem('QueID', QueContent.QtnID);
                }
                console.log(QueContent);

            } else {
                message.error(json.Msg, 3);
            }

        })
    }
    //自动保存
    SaveTemporaryQtnFn() {
        tiemr2 = setInterval(() => {
            if (sessionStorage.getItem('isPublishQtn') === 'true') {
                return;
            }
            if (!this.state.QueContent.QtnName && !this.state.QueContent.QtnExplanation && !this.state.QtnTopicList.length > 0) {
                return;
            }
            let QueContent = this.state.QueContent;
            QueContent.QtnTopicList = this.state.QtnTopicList;
            QueContent.QtnTopicList.map((item, idx) => {
                QueContent.QtnTopicList[idx].OrderNO = idx + 1;
                if(QueContent.QtnTopicList[idx].QtnTopicAttachment.length>0){
                    for(let i =0;i<QueContent.QtnTopicList[idx].QtnTopicAttachment.length;i++){
                        if(QueContent.QtnTopicList[idx].QtnTopicAttachment[i].AttachmentUrl.indexOf('http://')==-1){
                            QueContent.QtnTopicList[idx].QtnTopicAttachment[i].AttachmentUrl=sessionStorage.getItem('ResourceServerAddr')+QueContent.QtnTopicList[idx].QtnTopicAttachment[i].AttachmentUrl
                        }
                    }
                }
            })
            postData('PublicInfo/Que/CreateQtn/SaveTemporaryQtn', {
                UserID: sessionStorage.getItem('UserID'),
                UserType: sessionStorage.getItem('UserType'),
                QtnContent: JSON.stringify(QueContent),
            }).then((res) => {
                return res.json()
            }).then((json) => {
                // console.log(json);
                if (json.StatusCode === 200) {
                } else {
                    message.error(json.Msg, 3);
                }
            })
        }, 80000)
    }
    change_radio() {

    }
    up(id) {
        let QtnTopicList = [];
        let QtnTopicList1 = this.state.QtnTopicList;
        //    console.log(QtnTopicList1);
        QtnTopicList1.map((item, idx) => {

            if (idx === id - 1) {
                QtnTopicList.push(QtnTopicList1[id]);
            } else if (idx === id) {
                QtnTopicList.push(QtnTopicList1[id - 1]);
            } else {
                QtnTopicList.push(item);
            }

        })
        this.setState({
            QtnTopicList: QtnTopicList,
        })
    }
    down(id) {
        let QtnTopicList = [];
        let QtnTopicList1 = this.state.QtnTopicList;
        //    console.log(QtnTopicList1);
        QtnTopicList1.map((item, idx) => {

            if (idx === id) {
                QtnTopicList.push(QtnTopicList1[id + 1]);
            } else if (idx === id + 1) {
                QtnTopicList.push(QtnTopicList1[id]);
            } else {
                QtnTopicList.push(item);
            }

        })
        this.setState({
            QtnTopicList: QtnTopicList,
        })
    }
    del(id) {
        let QtnTopicList = this.state.QtnTopicList;
        QtnTopicList.splice(id, 1);
        this.setState({
            QtnTopicList: QtnTopicList,
        })
    }
    collect(item, e) {
        let dom = e.target;
        if (e.target.className != 'uncollection') {
            let id = e.target.className.split(' ')[1];
            getData('PublicInfo/Que/TopicLibMgr/CancelCollectTopic', {
                UserID: sessionStorage.getItem('UserID'),
                UserType: sessionStorage.getItem('UserType'),
                TopicID: id,
            }).then((res) => {
                return res.json()
            }).then((json) => {
                // console.log(json);
                if (json.StatusCode === 200) {
                    // message.success('取消收藏成功~', 1.5);

                    dom.className = 'uncollection';
                } else {
                    message.error(json.Msg, 3);
                }
            })
            //    console.log(id);

            return;
        }
        //    e.target.className='collection';

        item.TopicID = null;
        if (item.QtnTopicAttachment.length > 0) {
            item.QtnTopicAttachment.map((it, idx) => {
                if (it.AttachmentUrl.indexOf(sessionStorage.getItem('ResourceServerAddr')) > -1) {
                    it.AttachmentUrl = it.AttachmentUrl.slice(sessionStorage.getItem('ResourceServerAddr').length, it.AttachmentUrl.length);
                }
            })
        }
        if (item.QtnTopicOption.length > 0) {
            item.QtnTopicOption.map((it, idx) => {
                it.OptionID = null;
                if (it.OptionImgPath.indexOf(sessionStorage.getItem('ResourceServerAddr')) > -1) {
                    it.OptionImgPath = it.OptionImgPath.slice(sessionStorage.getItem('ResourceServerAddr').length, it.OptionImgPath.length);
                }
            })
        }
        item = JSON.stringify(item);
        postData('PublicInfo/Que/TopicLibMgr/CollectTopic', {
            UserID: sessionStorage.getItem('UserID'),
            UserType: sessionStorage.getItem('UserType'),
            QtnTopic: item,
        }).then((res) => {
            return res.json()
        }).then((json) => {
            // console.log(json);
            if (json.StatusCode === 200) {
                // message.success('收藏成功~', 1.5);
                dom.className = 'collection ' + json.Data.TopicID;
            } else {
                message.error(json.Msg, 3);
            }
        })
    }
    changeClassName(id) {
        this.closeCollect();
        if (id === 1 && this.state.className1 === '') {
            this.setState({
                className1: 'QueEdit-left-choose',
                className2: ''
            })
        }
        if (id === 2 && this.state.className2 === '') {
            this.setState({
                className2: 'QueEdit-left-choose',
                className1: ''
            })
        }
    }
    //跳转到相应的模块
    scrollToAnchor = (anchorName) => {
        if (anchorName) {
            let anchorElement = document.getElementById(anchorName);
            if (anchorElement) { anchorElement.scrollIntoView(); }
        }
    }
    //随鼠标滚动固定在顶部
    someFunction = () => {
        const fixedTop = 150;
        window.onscroll = () => {
            let scrollTop = Math.max(document.body.scrollTop, document.documentElement.scrollTop);
            //控制元素块A随鼠标滚动固定在顶部
            if (scrollTop >= fixedTop) {
                this.setState({ needFixed: true })
            } else if (scrollTop < fixedTop) {
                this.setState({ needFixed: false })
            }
        }
    }
    handleCancel() {
        this.setState({
            visible: false
        })
    }
    changeOpen() {
        let QueContent = {}
        QueContent = this.state.QueContent;
        QueContent.QtnTopicList = this.state.QtnTopicList;
        this.setState({
            visible: true,
            QueContent: QueContent,
        })
    }
    openCollect(id) {
        
        // if (this.state.openCollectClass !== 'QueEidt-left-popup QueEidt-left-popup1') {
            if(id==0){
                this.setState({
                    chooseCollect: [],
                    chooseCollectType:'',
                    chooseCollectid:0,
                }, function () {
                    this.getCollectContect(1);
                  
                })
            }else{
                this.setState({
                    chooseCollect: [],
                    chooseCollectid:id,
                }, function () {
                    this.getCollectContect1(id);
                })
            }
            
        // }

    }
    getCollectContect1(id){
        getData('PublicInfo/Que/TopicLibMgr/GetTopicGroup', {
            UserType: sessionStorage.getItem('UserType'),
        }).then((res) => {
            return res.json()
        }).then((json) => {
            let type =json.Data.TopicGroupList[id-1].TopicGroupID;
            this.setState({
                chooseCollectType:type,
            })
            getData('PublicInfo/Que/TopicLibMgr/GetTopicList', {
                UserID: sessionStorage.getItem('UserID'),
                UserType: sessionStorage.getItem('UserType'),
                TopicGroupID:type ,
                TopicType: id,
                PageIndex: 1,
                PageSize: 1000,
            }).then((res) => {
                return res.json()
            }).then((json) => {
                // console.log(json);
                if (json.StatusCode === 200) {
                    if (id === 1) {
                        this.setState({
                            className3: 'QueEdit-li-choose',
                            className4: '',
                            chooseCollect: [],
                            openCollectClass: 'QueEidt-left-popup QueEidt-left-popup1',
                            TopicLibList: json.Data.TopicLibList,
                        }, () => {
                            this.refs.collect.scrollTop = 0;
                        })
                    } else {
                        this.setState({
                            className4: 'QueEdit-li-choose',
                            className3: '',
                            chooseCollect: [],
                            openCollectClass: 'QueEidt-left-popup QueEidt-left-popup1',
                            TopicLibList: json.Data.TopicLibList,
                        }, () => {
                            this.refs.collect.scrollTop = 0;
                        })
                    }
                   
    
                } else {
                    message.error(json.Msg, 3);
                }
            })
        })

      
    }
    getCollectContect(id) {
        getData('PublicInfo/Que/TopicLibMgr/GetTopicList', {
            UserID: sessionStorage.getItem('UserID'),
            UserType: sessionStorage.getItem('UserType'),
            TopicGroupID: this.state.chooseCollectType,
            TopicType: id,
            PageIndex: 1,
            PageSize: 1000,
        }).then((res) => {
            return res.json()
        }).then((json) => {
            // console.log(json);
            if (json.StatusCode === 200) {
                if (id === 1) {
                    this.setState({
                        className3: 'QueEdit-li-choose',
                        className4: '',
                        chooseCollect: [],
                        openCollectClass: 'QueEidt-left-popup QueEidt-left-popup1',
                        TopicLibList: json.Data.TopicLibList,
                    }, () => {
                        this.refs.collect.scrollTop = 0;
                    })
                } else {
                    this.setState({
                        className4: 'QueEdit-li-choose',
                        className3: '',
                        chooseCollect: [],
                        openCollectClass: 'QueEidt-left-popup QueEidt-left-popup1',
                        TopicLibList: json.Data.TopicLibList,
                    }, () => {
                        this.refs.collect.scrollTop = 0;
                    })
                }
               

            } else {
                message.error(json.Msg, 3);
            }
        })
    }
    closeCollect() {
        this.setState({
            className3: 'QueEdit-li-choose',
            className4: '',
            openCollectClass: 'QueEidt-left-popup',
            TopicLibList: [],
        })
    }
    changeCollectClass(id) {
        if (id === 1) {
            if (this.state.className3 === '') {
                this.getCollectContect(1);
            }
        } else {
            if (this.state.className4 === '') {
                this.getCollectContect(2);
            }
        }
    }
    delCollect(id, e) {
        let $this = $(e.target);
        let this1 =this;
        //    $('.Que-Collect-mian .QueEdit-content-li').eq(idx).remove();
        getData('PublicInfo/Que/TopicLibMgr/CancelCollectTopic', {
            UserID: sessionStorage.getItem('UserID'),
            UserType: sessionStorage.getItem('UserType'),
            TopicID: id,
        }).then((res) => {
            return res.json()
        }).then((json) => {
            // console.log(json);
            if (json.StatusCode === 200) {
                // $this.parent().parent().remove();
                message.success('取消收藏成功~', 1.5);
                let chooseCollect =this1.state.chooseCollect;
                if(chooseCollect.length>0){
                    chooseCollect.map((item,idx)=>{
                        if(item.TopicID==id){
                            chooseCollect.splice(idx,1);
                            this1.setState({
                                chooseCollect:chooseCollect
                            })
                        }
                    })

                }
                let TopicLibList =this1.state.TopicLibList;
                console.log(TopicLibList);
                if(TopicLibList.length>0){
                    TopicLibList.map((item,idx)=>{
                        if(item.TopicID==id){
                            TopicLibList.splice(idx,1);
                            this1.setState({
                                TopicLibList:TopicLibList
                            })
                        }
                    })

                }
                
            } else {
                message.error(json.Msg, 3);
            }
        })
    }
    downCollect(e) {
        var $this = $(e.target);
        if (e.target.className == 'EditQue-down-collect') {
            e.target.className = 'EditQue-up-collect';
            $this.parent().next().hide();
            $this.parent().next().next().hide();
        } else {
            e.target.className = 'EditQue-down-collect';
            $this.parent().next().show();
            $this.parent().next().next().show();
        }
    }
    AddCollect(item, e) {
        if (e.target.className === 'QueEdit-add-collect') {
            e.target.className = 'QueEdit-unadd-collect';
            let arr = this.state.chooseCollect;
            arr.push(item);
            console.log(arr);
            this.setState({
                chooseCollect: arr,
            })
        } else {
            let $this = this;
            let editID = item.TopicID;
            let arr = this.state.chooseCollect;
            let num = arr.map((it, idx) => {
                if (it.TopicID === editID) {
                    return idx;
                }
            })
            arr.splice(num, 1);
            $this.setState({
                chooseCollect: arr,
            })
            e.target.className = 'QueEdit-add-collect';
        }
    }
    collectAddQue() {
        if (this.state.chooseCollect.length > 0) {
            let arr = this.state.QtnTopicList;
            let arr1 = this.state.chooseCollect;
            arr1.map((item) => {
                arr.push(item);
            })
            this.setState({
                QtnTopicList: arr,
                chooseCollect: [],
            })
            this.closeCollect();
            message.success('添加成功~', 1.5);
        } else {
            message.warning('您没有选择题目哦~', 1.5);
        }

    }
    //添加题目 或编辑题目
    AddQueTopicFn(data) {
        let QtnTopicList = this.state.QtnTopicList;
        if(this.state.EditQueIdx===''){
            // message.success('添加成功~', 1.5);
            QtnTopicList.push(data);
        }else{
            // message.success('编辑成功~', 1.5);
            QtnTopicList[this.state.EditQueIdx]=data;
        }
    
        this.setState({
            visibleAdd: false,
            QtnTopicList: QtnTopicList,
            EditQueIdx:'',
        })

    }
    closeAddFn() {
        this.setState({
            visibleAdd: false,
            EditQueIdx:''
        })
    }
    OpenAdd(id) {
        this.setState({
            visibleAdd: true,
            AddType: id,
            EditQueArr: [],
        })
    }
    EditQueFn(item,idx) {
        this.setState({
            visibleAdd: true,
            AddType: 4,
            EditQueArr: item,
            EditQueIdx:idx,
        })
    }
    OpenAddMore() {
        this.setState({
            visibleAddMore: true
        })
    }
    closeAddMoreFn() {
        this.setState({
            visibleAddMore: false,
        })
    }

    AddQueTopicMoreFn(data) {
        let QtnTopicList = this.state.QtnTopicList;
        if (data.length > 0) {
            data.map((item) => {
                item.OrderNO = QtnTopicList.length + 2;
                QtnTopicList.push(item);
            })
            this.setState({
                QtnTopicList: QtnTopicList,
                visibleAddMore: false,
              
            })
            message.success('添加成功', 1.5);
        }

    }
    ReleaseQue() {
        let QueContent = this.state.QueContent;
        let QtnTopicList = this.state.QtnTopicList;
        if (QtnTopicList.length > 0) {
            QtnTopicList.map((item, idx) => {
                if (item.QtnTopicAttachment.length > 0) {
                    item.QtnTopicAttachment.map((it, id) => {
                        if (it.AttachmentUrl.indexOf('http://') !== -1) {
                            QtnTopicList[idx].QtnTopicAttachment[id].AttachmentUrl = it.AttachmentUrl.slice(sessionStorage.getItem('ResourceServerAddr').length, it.AttachmentUrl.length);
                        }
                    })
                }
                if (item.IsImgOption !== 0) {
                    if (item.QtnTopicOption.length > 0) {
                        item.QtnTopicOption.map((it, id) => {
                            if (it.OptionImgPath.indexOf('http://') !== -1) {
                                QtnTopicList[idx].QtnTopicOption[id].OptionImgPath = it.OptionImgPath.slice(sessionStorage.getItem('ResourceServerAddr').length, it.OptionImgPath.length);
                            }
                        })
                    }
                }
            })
        }else{
            message.error('问卷内容不能为空~',1.5);
            return;
        }

        QueContent.QtnTopicList = QtnTopicList;
        if(!QueContent.QtnName){
            message.error('问卷题目不能为空~',1.5);

            return;
        }
        if(!QueContent.QtnExplanation){
            message.error('问卷说明不能为空~',1.5);
            

        }
        if (getQueryVariable('QtnType') !== '1') {
            this.setState({
                visibleRelease: true,
                QueContent: QueContent,
            })
            return;
        }

        getData('PublicInfo/Que/CreateQtn/CheckQtn', {
            UserID: sessionStorage.getItem('UserID'),
            UserType: sessionStorage.getItem('UserType'),
            QtnID: sessionStorage.getItem('QueID'),
        }).then((res) => {
            return res.json()
        }).then((json) => {
            // console.log(json);
            if (json.StatusCode === 200) {
                if (json.Data.BackCode === 1) {
                    let QueContent = this.state.QueContent;
                    let QtnTopicList = this.state.QtnTopicList;
                    QueContent.QtnTopicList = QtnTopicList;
                    this.setState({
                        visibleRelease: true,
                        QueContent: QueContent,
                        Questionnaire: json.Data.Questionnaire,
                    })
                } else {
                    message.error(json.Msg, 1.5);
                }


            } else {
                message.error(json.Msg, 3);
            }
        })
    }
    hideModalRelease() {
        this.setState({
            visibleRelease: false,

        })

    }
    CHangeQtnExplanation(e) {
        let QueContent = this.state.QueContent;
        QueContent.QtnExplanation = e.target.value;
        this.setState({
            QueContent: QueContent,
        })
    }
    ChangeQtnName(e) {
        let QueContent = this.state.QueContent;
        QueContent.QtnName = e.target.value;
        this.setState({
            QueContent: QueContent,
        })
    }
    a() {
        this.setState({ EditQueName: true }
            , function () {
                document.getElementById('myInput').focus();
            });
        //     console.log(document.getElementById('myInput'))
        // //   
        //     // this.myInput.focus();
    }
    SaveQtn() {
        let $this = this;
  
        if (!this.state.QueContent.QtnName) {
            message.error('问卷题目不能为空', 1.5);
            return;
        }
        if (!this.state.QueContent.QtnExplanation) {
            message.error('问卷说明不能为空', 1.5);
            return;
        }
        if (!this.state.QtnTopicList.length > 0) {
            message.error('问卷内容不能为空', 1.5);
            return;
        }
        // console.log( this.state.QtnTopicList);
        let QtnTopicList =[];
        QtnTopicList =this.state.QtnTopicList;
       QtnTopicList.map((item, idx) => {
            QtnTopicList[idx].OrderNO = idx + 1;
            if(QtnTopicList[idx].QtnTopicAttachment.length>0){
                for(let i=0;i<QtnTopicList[idx].QtnTopicAttachment.length;i++){
                    // console.log(QtnTopicList[idx].QtnTopicAttachment[i].AttachmentUrl);
                    if (QtnTopicList[idx].QtnTopicAttachment[i].AttachmentUrl.indexOf('http://') !== -1) {
                        QtnTopicList[idx].QtnTopicAttachment[i].AttachmentUrl =  QtnTopicList[idx].QtnTopicAttachment[i].AttachmentUrl.slice(sessionStorage.getItem('ResourceServerAddr').length,  QtnTopicList[idx].QtnTopicAttachment[i].AttachmentUrl.length);
                    }
                    // console.log(QtnTopicList[idx].QtnTopicAttachment[i].AttachmentUrl);
                }
            }
        })
        postData('PublicInfo/Que/CreateQtn/SaveQtn', {
            UserID: sessionStorage.getItem('UserID'),
            SchoolID: sessionStorage.getItem('SchoolID'),
            UserName: decodeURIComponent(sessionStorage.getItem('UserName')),
            UserType: sessionStorage.getItem('UserType'),
            QtnID: getQueryVariable('QueType') === '1'|| getQueryVariable('QueType') === '6'? sessionStorage.getItem('QueID')  : '',//QtnType 0 创建 1  未发  2  复制  7 共享  3 模板 6 未保存
            QtnName: this.state.QueContent.QtnName,
            QtnExplanation: this.state.QueContent.QtnExplanation,
            OriginalQtnID: getQueryVariable('QueType') === '2' || getQueryVariable('QueType') === '3' || getQueryVariable('QueType') === '7' ? sessionStorage.getItem('QueID')  : '',
            QtnTopicList: JSON.stringify(QtnTopicList),
        }).then((res) => {
            return res.json();
        }).then((json) => {
            if (json.StatusCode === 200 && json.Data.BackCode === 1) {
                //    this.uploadFn();
                message.success('保存问卷成功~', 2);
                window.opener.postMessage('1', '*');
            } else {
                message.error(json.Msg, 2);
            }

        })
    }
    render() {
        return (
            <div>
                <div>
                    <Header headerStyle={2}></Header>
                    <div className="Quemain-div">
                        <div className='QueEdit-main clearfix'>
                            <div className={this.state.needFixed ? 'QueEdit-left fixed' : 'QueEdit-left'} id='QueEidt-left'>
                                <ul className='QueEdit-left-ul' >
                                    <li className={this.state.className1} onClick={() => { this.changeClassName(1) }}>问卷大纲</li>
                                    <li className={this.state.className2} onClick={() => { this.changeClassName(2) }}>题库</li>
                                </ul>
                                <div className='QueEdit-left-model'>
                                    {this.state.className1 === '' ? <div>
                                        <span onClick={() => { this.openCollect(0) }}><i></i>收藏</span>
                                        <span  onClick={() => { this.openCollect(1) }}><i></i>人口属性</span>
                                        <span  onClick={() => { this.openCollect(2) }}><i></i>用户行为</span>
                                        <span  onClick={() => { this.openCollect(3) }}><i></i>用户满意度</span>
                                    </div>
                                        : <div>
                                            {this.state.QtnTopicList.length > 0 ? <ul className="fixed-ul">
                                                {this.state.QtnTopicList.map((item3, idx) => {
                                                    return (
                                                        <li key={idx} ><a onClick={() => this.scrollToAnchor('Q' + idx)} title={item3.TopicContent.length>32?item3.TopicContent:''} >Q{idx + 1}. {item3.TopicContent.length>32?item3.TopicContent.slice(0,30)+'..':item3.TopicContent}</a></li>
                                                    )
                                                })}
                                            </ul> : ''}
                                        </div>}
                                </div>
                                <div className={this.state.openCollectClass} style={this.state.chooseCollectid==1||this.state.chooseCollectid==3?{left:'262px'}:{} }  >
                                    <div>
                                        <ul className='left-popup-ul'><li><span className={this.state.className3} onClick={() => { this.changeCollectClass(1) }}>选择题</span> <b></b></li><li><span className={this.state.className4} onClick={() => { this.changeCollectClass(2) }}>简答题</span></li> <li onClick={() => this.closeCollect()}><i ></i></li> <b style={this.state.chooseCollectid==2||this.state.chooseCollectid==3?{top:'155px'}:{}}></b></ul>
                                    </div >
                                    <div className='QueEdit-main Que-Collect-mian' ref='collect'>
                                        <div className='QueEdit-right'>
                                            {this.state.TopicLibList && this.state.TopicLibList.length > 0 ? <div className="QueEdit-content">
                                                {this.state.TopicLibList.map((item, idx) => {
                                                    return <div className='QueEdit-content-li clearfix' key={item.TopicID} id={item.TopicID}>
                                                        <div className='checkbox-TopicContent'> <i className='QueEdit-add-collect' onClick={(e) => { this.AddCollect(item, e) }}></i> <span className='checkbox-TopicContent-span' title={item.TopicContent}>{item.TopicContent}</span><i></i><i className='EditQue-down-collect' onClick={(e) => { this.downCollect(e) }}></i> <i className='EditQue-del-collect' onClick={(e) => { this.delCollect(item.TopicID, e) }}></i></div>
                                                        {item.QtnTopicAttachment && item.QtnTopicAttachment.length > 0 ? <div className='clearfix'>
                                                            {item.QtnTopicAttachment.map((item2, idx2) => {
                                                                return (
                                                                    <div key={idx2}>
                                                                        {item2.AttachmentType === 1 ? <img className='checkbox-title-img' src={item2.AttachmentUrl.indexOf('http') > -1 ? item2.AttachmentUrl : sessionStorage.getItem('ResourceServerAddr') + item2.AttachmentUrl} alt="图片丢失" /> : item2.AttachmentType === 2 ? <audio src={item2.AttachmentUrl.indexOf('http') > -1 ? item2.AttachmentUrl : sessionStorage.getItem('ResourceServerAddr') + item2.AttachmentUrl}   controls >
                                                                        <track kind="captions" />  您的浏览器不支持 audio 标签。
                                            </audio> : item2.AttachmentType === 3 ? <video src={item2.AttachmentUrl.indexOf('http') > -1 ? item2.AttachmentUrl : sessionStorage.getItem('ResourceServerAddr') + item2.AttachmentUrl} controls="controls">
                                                                                您的浏览器不支持 video 标签。
</video> : ''}
                                                                    </div>
                                                                )
                                                            })}
                                                        </div> : ''}
                                                        <ul className='checkbox-ul'>
                                                            {
                                                                item.TopicType === 1 ?
                                                                    <RadioGroup name="radiogroup" onChange={this.change_radio.bind(this)}>
                                                                        {
                                                                            item.QtnTopicOption.length > 0 ?
                                                                                item.QtnTopicOption.map((item1, id) => {
                                                                                    return (
                                                                                        <li className='checkbox-li clearfix' key={id} style={{ minWidth: 100 / item.OptionCountPerRow + '%' }}>
                                                                                            <div className='checkbox-choose'>

                                                                                                <Radio
                                                                                                    value={item1.OrderNO}
                                                                                                > <span>{`${String.fromCharCode(item1.OrderNO + 64)}.`}</span>{item1.OptionContent} {item1.IsBlank === 1 ? <input className='choose-input'></input> : ''}</Radio>

                                                                                            </div>
                                                                                            {item.IsImgOption===1&&item1.OptionImgPath ? <img className='checkbox-img' src={item1.OptionImgPath.indexOf('http') > -1 ? item1.OptionImgPath : sessionStorage.getItem('ResourceServerAddr') + item1.OptionImgPath} alt="图片丢失" /> : ''}
                                                                                        </li>
                                                                                    )
                                                                                }) : ''
                                                                        }
                                                                    </RadioGroup> : item.TopicType === 2 ?
                                                                        <CheckboxGroup onChange={() => { this.change_radio(idx, 'checkbox') }}>
                                                                            {
                                                                                item.QtnTopicOption.length > 0 ?
                                                                                    item.QtnTopicOption.map((item1, id) => {
                                                                                        return (
                                                                                            <li className='checkbox-li clearfix' key={id} style={{ minWidth: 100 / item.OptionCountPerRow + '%' }}>
                                                                                                <div className='checkbox-choose' >
                                                                                                    <Checkbox
                                                                                                        value={item1.OrderNO}
                                                                                                    > <span>{`${String.fromCharCode(item1.OrderNO + 64)}.`}</span>{item1.OptionContent}</Checkbox>
                                                                                                </div>
                                                                                                {item.IsImgOption===1&&item1.OptionImgPath ? <img className='checkbox-img' src={item1.OptionImgPath.indexOf('http') > -1 ? item1.OptionImgPath : sessionStorage.getItem('ResourceServerAddr') + item1.OptionImgPath} alt="图片丢失" /> : ''}
                                                                                            </li>
                                                                                        )
                                                                                    }) : ''
                                                                            }
                                                                        </CheckboxGroup>
                                                                        : <div key={idx}>
                                                                            <textarea name="" id="" cols="80" rows="4" className='checkbox-textarea'></textarea>
                                                                        </div>}

                                                        </ul>
                                                    </div>
                                                })}
                                            </div> : <div style={{ margin: '100px 300px', textAlign: 'center',fontSize:'16px' }}> <i className='empty-que-bg' style={{marginLeft:'-13px'}}></i> <p>暂无{this.state.chooseCollectid==0?'收藏':this.state.chooseCollectid==1?'人口属性':this.state.chooseCollectid==2?'用户行为':'用户满意度'}内容~</p></div>}

                                        </div>
                                    </div>
                                    <div className='QueEdit-footer'> <span className='QueEdit-footer-span1'>已选 <b>{this.state.chooseCollect.length}</b> 道题</span> <span className='QueEdit-footer-span2' onClick={() => { this.closeCollect() }}>取消</span> <span className='QueEdit-footer-span3' onClick={() => { this.collectAddQue() }}>添加</span>
                                    </div>

                                </div>
                            </div>
                            <div className='QueEdit-right  clearfix'>
                                <div className='QueEdit-right-top clearfix'>
                                    <ul className='QueEdit-right-ul1'>
                                        <li onClick={() => { this.OpenAdd(1) }}>
                                            <i></i><span>添加选择题</span> <b></b></li>
                                        <li onClick={() => { this.OpenAdd(2) }}><i></i><span>添加简答题</span> <b></b></li>
                                        <li onClick={() => { this.OpenAddMore() }}><i></i><span>批量添加题目</span></li>
                                    </ul>
                                    <ul className='QueEdit-right-ul2'>
                                        <li onClick={() => { this.changeOpen() }}>预览</li>
                                        <li onClick={() => { this.SaveQtn() }}>保存</li>
                                        <li onClick={() => { this.ReleaseQue() }}>发布</li>
                                    </ul>
                                </div>
                                <div className='clearfix'>
                                    <div className='QueEidt-tilte' title={this.state.QueContent.QtnName} onClick={() => { this.a() }}>{this.state.QueContent.QtnName ? this.state.QueContent.QtnName : '点击编辑问卷题目...'}</div>
                                    {this.state.EditQueName ? <div className='QueEidt-tilte1'> <input value={this.state.QueContent.QtnName} onChange={(e) => { this.ChangeQtnName(e) }} placeholder='点击编辑问卷题目...' onBlur={() => { this.setState({ EditQueName: false, }) }} id='myInput'></input> </div> : ''}
                                    <div className='QueEidt-QtnExplanation'> <textarea className='QueEidt-QtnExplanation1' value={this.state.QueContent.QtnExplanation} placeholder='请输入问卷说明...' cols="75" rows='4' maxLength='300' onChange={(e) => { this.CHangeQtnExplanation(e) }} ></textarea> </div>
                                    {this.state.QtnTopicList && this.state.QtnTopicList.length > 0 ? <div className="QueEdit-content">
                                        {this.state.QtnTopicList.map((item, idx) => {
                                            return <div className='QueEdit-content-li clearfix' key={idx} id={'Q' + idx}>
                                                <div className='checkbox-TopicContent'>Q{idx + 1}. {item.TopicContent}</div>
                                                {item.QtnTopicAttachment && item.QtnTopicAttachment.length > 0 ? <div className='clearfix'>
                                                    {item.QtnTopicAttachment.map((item2, idx2) => {
                                                        return (
                                                            <div key={idx2}>
                                                                {item2.AttachmentType === 1 ? <img className='checkbox-title-img' src={item2.AttachmentUrl.indexOf('http') > -1 ? item2.AttachmentUrl : sessionStorage.getItem('ResourceServerAddr') + item2.AttachmentUrl} alt="图片丢失" /> : item2.AttachmentType === 2 ? <audio src={item2.AttachmentUrl.indexOf('http') > -1 ? item2.AttachmentUrl : sessionStorage.getItem('ResourceServerAddr') + item2.AttachmentUrl}  controls >
                                                                <track kind="captions" />
                                                                    您的浏览器不支持 audio 标签。
                                            </audio> : item2.AttachmentType === 3 ? <video src={item2.AttachmentUrl.indexOf('http') > -1 ? item2.AttachmentUrl : sessionStorage.getItem('ResourceServerAddr') + item2.AttachmentUrl} controls="controls">
                                                                        您的浏览器不支持 video 标签。</video> : ''}
                                                            </div>
                                                        )
                                                    })}
                                                </div> : ''}
                                                <ul className='checkbox-ul'>
                                                    {
                                                        item.TopicType === 1 ?
                                                            <RadioGroup name="radiogroup" onChange={this.change_radio.bind(this)}>
                                                                {
                                                                    item.QtnTopicOption.length > 0 ?
                                                                        item.QtnTopicOption.map((item1, id) => {
                                                                            return (
                                                                                <li className='checkbox-li clearfix' key={id} style={{ minWidth: 100 / item.OptionCountPerRow + '%' }}>
                                                                                    <div className='checkbox-choose'>

                                                                                        <Radio
                                                                                            value={item1.OrderNO}
                                                                                        > <span>{`${String.fromCharCode(item1.OrderNO + 64)}.`}</span>{item1.OptionContent} {item1.IsBlank === 1 ? <input className='choose-input'></input> : ''}</Radio>

                                                                                    </div>
                                                                                    {item.IsImgOption===1&&item1.OptionImgPath ? <img className='checkbox-img' src={item1.OptionImgPath.indexOf('http') > -1 ? item1.OptionImgPath : sessionStorage.getItem('ResourceServerAddr') + item1.OptionImgPath} alt="图片丢失" /> : ''}
                                                                                </li>
                                                                            )
                                                                        }) : ''
                                                                }
                                                            </RadioGroup> : item.TopicType === 2 ?
                                                                <CheckboxGroup onChange={() => { this.change_radio(idx, 'checkbox') }}>
                                                                    {
                                                                        item.QtnTopicOption.length > 0 ?
                                                                            item.QtnTopicOption.map((item1, id) => {
                                                                                return (
                                                                                    <li className='checkbox-li clearfix' key={id} style={{ minWidth: 100 / item.OptionCountPerRow + '%' }}>
                                                                                        <div className='checkbox-choose' >
                                                                                            <Checkbox
                                                                                                value={item1.OrderNO}
                                                                                            > <span>{`${String.fromCharCode(item1.OrderNO + 64)}.`}</span>{item1.OptionContent}</Checkbox>
                                                                                        </div>
                                                                                        {item.IsImgOption===1&&item1.OptionImgPath ? <img className='checkbox-img' src={item1.OptionImgPath.indexOf('http') > -1 ? item1.OptionImgPath : sessionStorage.getItem('ResourceServerAddr') + item1.OptionImgPath} alt="图片丢失" /> : ''}
                                                                                    </li>
                                                                                )
                                                                            }) : ''
                                                                    }
                                                                </CheckboxGroup>
                                                                : <div key={idx}>
                                                                    <textarea name="" id="" cols="80" rows="4" className='checkbox-textarea'></textarea>
                                                                </div>}
                                                    <div className='choose-change'>
                                                        <span onClick={() => { this.EditQueFn(item,idx) }}><i></i>编辑</span>
                                                        <span className='uncollection' onClick={(e) => { this.collect(item, e) }}><i></i>收藏</span>
                                                        <span className='del' onClick={() => { this.del(idx) }}><i></i>删除</span>
                                                        {idx !== 0 ? <span className='up' onClick={() => { this.up(idx) }} ><i></i>上移</span> : ''}
                                                        {idx !== this.state.QtnTopicList.length - 1 ? <span className='down' onClick={() => { this.down(idx) }} ><i></i>下移</span> : ''}
                                                    </div>
                                                </ul>
                                            </div>
                                        })}
                                    </div> : <div> <i className='empty-que-bg' style={{marginLeft:'300px'}}></i> <p style={{textAlign:'center'}}> 此问卷暂无内容哦~</p> </div>}
                                </div>
                            </div>
                        </div>
                        <Footer></Footer>
                        <QueView QueContent={this.state.QueContent} visible={this.state.visible} handleCancel={this.handleCancel} ></QueView>
                        <Modal
                            className='create-QueSubject'
                            title="添加题目"
                            visible={this.state.visible2}
                            onOk={this.handleOk2}
                            onCancel={this.handleCancel2}
                            // footer={null}
                            width='851px'
                            destroyOnClose={true}
                            centered={true}
                        // mask={false}
                        >
                            <div>

                            </div>
                        </Modal>
                        {this.state.visibleRelease ? <ReleaseQue visible={this.state.visibleRelease} hideModal={this.hideModalRelease} QueContent={this.state.QueContent} Questionnaire={this.state.Questionnaire} ></ReleaseQue>
                            : ''}     <AddQueMore visible={this.state.visibleAddMore} AddMoreTopic={this.AddQueTopicMoreFn} closeAddMore={this.closeAddMoreFn}></AddQueMore>
                        <AddQueTopic visible={this.state.visibleAdd} AddQueTopic={this.AddQueTopicFn} closeAdd={this.closeAddFn} AddType={this.state.AddType} Data={this.state.EditQueArr} ></AddQueTopic>
                        <Alert message={this.state.message} isOpen={this.state.isOpen} chooseFn={(data) => { this.CreateNoticeFn(data) }}></Alert>
                    </div>
                    {this.state.openCollectClass === 'QueEidt-left-popup QueEidt-left-popup1' ? <div className='Quemain-div-popup' style={{ height: document.documentElement.clientHeight + 'px' }} onClick={() => { this.closeCollect() }} ></div> : ''}
                </div>
            </div>
        )

    }

}

export default EditQue;