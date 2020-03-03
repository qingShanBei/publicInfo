import React, { Component } from 'react';
import { getData, getQueryVariable } from '../../common/js/fetch';
import Search from '../../common/compont/Search';
import ReadNoticeInfo from './ReadNoticeInfo';
import CreateNotice from './CreateNotice';
import { Pagination, message, Spin } from 'antd';
import { createHashHistory } from 'history';
import Alert from '../../common/compont/alert_dialog_wrapper';
import { getInputClassName } from 'antd/lib/input/Input';
import $ from 'jquery';
class Noticeissued extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            NoticeID: '',
            echartsLeftList: [],
            visible1: false,
            message: '',
            isOpen: false,
            NoticeMain: 0,
            button: 0,
            buttonType: '',
            NoticeList: [],
            Total: 1,
            PageIndex: 1,
            Keyword: '',
            islooding: true,
            nullFull:1,
            openAddEvent:false,
        }
        this.onChangePage = this.onChangePage.bind(this);
        this.openEcheats = this.openEcheats.bind(this);

    }
    CreateNoticeFn(data) {
        if (data === 'true') {

            if (this.state.buttonType === 1) {
                getData('PublicInfo/Notice/PublishedNoticeMgr/RevokeNotice', {
                    UserID: sessionStorage.getItem('UserID'),
                    UserType: sessionStorage.getItem('UserType'),
                    NoticeID: this.state.NoticeID,
                }).then((res) => {
                    return res.json();
                }).then((json) => {
                    if (json.StatusCode === 200 && json.Data.BackCode === 1) {

                        message.success('撤回通知成功~', 3);
                        this.onChangePage(this.state.PageIndex);
                    }
                    this.setState({
                        isOpen: false,
                    });
                })

            }
            if (this.state.buttonType === 3) {
                getData('PublicInfo/Notice/PublishedNoticeMgr/DeleteNotice', {
                    UserID: sessionStorage.getItem('UserID'),
                    UserType: sessionStorage.getItem('UserType'),
                    NoticeID: this.state.NoticeID,
                }).then((res) => {
                    return res.json();
                }).then((json) => {
                    if (json.StatusCode === 200 && json.Data.BackCode === 1) {
                        message.success('删除通知成功~', 3);
                        this.onChangePage(this.state.PageIndex);
                    }
                    this.setState({
                        isOpen: false,
                    });
                })
            }


            //     getData('PublicInfo/Notice/PublishedNoticeMgr/DeleteNotice',{
            //         UserID:sessionStorage.getItem('UserID'),
            //         UserType:sessionStorage.getItem('UserType'),
            //         NoticeID:this.props.NoticeID,
            //     }).then((res) => {
            //     return res.json();
            // }).then((json) => {
            //    if(json.StatusCode===200&&json.Data.BackCode===1){
            //     const history = createHashHistory();
            //     history.push('/404');
            //    } 
            // })

        } else {
            this.setState({
                isOpen: false,
            })
        }
    }
    hideModal1 = () => {
        this.setState({
            visible1: false,
        });
    };
    onChangePage(page = 1) {
        getData('PublicInfo/Notice/PublishedNoticeMgr/GetSendedNoticeList', {
            UserID: sessionStorage.getItem('UserID'),
            UserType: sessionStorage.getItem('UserType'),
            Keyword:  encodeURIComponent(this.state.Keyword),
            PageIndex: page,
            PageSize: 10,
        }).then((res) => {
            return res.json()
        }).then((json) => {

            this.setState({
                PageIndex: page,
                Total: json.Data.Item.Total,
            })
            this.chamgeNoticeList(json.Data.Item.NoticeList);
        })
        // console.log( this.state.value);
    }
    openEcheats(e, NoticeID, ObjNameList, ObjId, ObjUniqIDList) {
        e.stopPropagation();
        ObjUniqIDList = ObjUniqIDList.split('$');
        ObjUniqIDList.map((item, idx) => {
            if (item.indexOf('(') !== -1) {
                item = item.slice(item.indexOf('(') + 1, -1);
            }
            ObjUniqIDList[idx] = item;
        })
        let ObjUniqID = '';
        let echartsLeftList = [['总览', 0]];
        if (ObjId === 'A0') {
            if (ObjNameList.indexOf('管理员') !== -1) {
                let ObjNameList2 = ObjNameList.split('$');
                let num = '';
                ObjNameList2.map((item, idx) => {
                    if (item.indexOf('管理员') !== -1) {
                        num = idx;
                    }
                });
                ObjUniqID = ObjUniqIDList[num].split(',')[0];
                echartsLeftList.push(['管理员阅读详情', ObjUniqID]);
            }
            if (ObjNameList.indexOf('领导') !== -1) {
                let ObjNameList2 = ObjNameList.split('$');
                let num = '';
                ObjNameList2.map((item, idx) => {
                    if (item.indexOf('领导') !== -1) {
                        num = idx;
                    }
                });
                ObjUniqID = ObjUniqIDList[num].split(',')[0];
                echartsLeftList.push(['领导阅读详情', ObjUniqID]);
            }
        } else if (ObjId === 'A1') {
            if (ObjNameList.indexOf('领导') !== -1) {
                let ObjNameList2 = ObjNameList.split('$');
                let num = '';
                ObjNameList2.map((item, idx) => {
                    if (item.indexOf('领导') !== -1) {
                        num = idx;
                    }
                });
                ObjUniqID = ObjUniqIDList[num].split(',')[0];
                echartsLeftList.push(['领导阅读详情', ObjUniqID]);
            }

        } else if (ObjId === 'L1') {
            if (ObjNameList.indexOf('教研组长') !== -1) {
                let ObjNameList2 = ObjNameList.split('$');
                let num = '';
                ObjNameList2.map((item, idx) => {
                    if (item.indexOf('教研组长') !== -1) {
                        num = idx;
                    }
                });
                ObjUniqID = ObjUniqIDList[num].split(',')[0];
                echartsLeftList.push(['教研组长阅读详情', ObjUniqID]);
            }
            if (ObjNameList.indexOf('班主任') !== -1) {
                let ObjNameList2 = ObjNameList.split('$');
                let num = '';
                ObjNameList2.map((item, idx) => {
                    if (item.indexOf('班主任') !== -1) {
                        num = idx;
                    }
                });
                ObjNameList2 = ObjNameList2[num].slice(3, ObjNameList2[num].length);
                if (ObjNameList2.indexOf('(') !== -1) {
                    ObjNameList2 = ObjNameList2.slice(ObjNameList2.indexOf('(') + 1, -1)
                    ObjNameList2 = ObjNameList2.split('+');
                } else {
                    ObjNameList2 = ObjNameList2.split(';');
                }
                let ObjUniqIDList1 = [];
                if (ObjUniqIDList[num].indexOf('+') !== -1) {
                    ObjUniqIDList1 = ObjUniqIDList[num].split('+');
                } else {
                    ObjUniqIDList1 = ObjUniqIDList[num].split(';');
                }
                // console.log(num);
                // console.log(ObjUniqIDList1);
                let ObjNameList3 = [];
                ObjNameList2.map((item, idx) => {
                    ObjNameList3.push([item, ObjUniqIDList1[idx]]);
                })
                ObjUniqID = ObjUniqIDList[num].split(',')[0];
                let ObjNameList1 = ['班主任阅读详情', ObjUniqID];
                ObjNameList1.push(ObjNameList3);
                echartsLeftList.push(ObjNameList1);
            }
        } else if (ObjId === 'T0') {
            if (ObjNameList.indexOf('老师') !== -1) {
                let ObjNameList2 = ObjNameList.split('$');
                let num = '';
                let isAll = false
                ObjNameList2.map((item, idx) => {
                    if (item.indexOf('老师') !== -1) {
                        num = idx;
                        if (item.indexOf('全部老师') !== -1) {
                            isAll = true;
                        }
                    }
                });
                let ObjNameList3 = [];

                if (isAll) {
                    ObjNameList2 = ObjNameList2[num].slice(3, ObjNameList2[num].length);
                    ObjNameList2 = ObjNameList2.slice(ObjNameList2.indexOf('(') + 1, -1)
                    ObjNameList2 = ObjNameList2.split('+');
                    let ObjUniqIDList1 = [];
                    if (ObjUniqIDList[num].indexOf('+') !== -1) {
                        ObjUniqIDList1 = ObjUniqIDList[num].split('+');
                    } else {
                        ObjUniqIDList1 = ObjUniqIDList[num].split(';');
                    }
                    // console.log(num);


                    ObjNameList2.map((item, idx) => {
                        ObjNameList3.push([item, ObjUniqIDList1[idx]]);
                    })
                    ObjUniqID = ObjUniqIDList[num].split(',')[0];
                } else {
                    ObjNameList2 = ObjNameList2[num].slice(3, ObjNameList2[num].length);
                    ObjNameList2 = ObjNameList2.split(';');
                    ObjNameList2.map((item, idx) => {
                        ObjNameList2[idx] = item.slice(0, item.indexOf('('));
                    })
                    let ObjUniqIDList1 = [];
                    // console.log(ObjUniqIDList1);
                    // console.log(ObjNameList2);
                    if (ObjUniqIDList[num].indexOf('+') !== -1) {
                        ObjUniqIDList1 = ObjUniqIDList[num].split('+');
                    } else {
                        ObjUniqIDList1 = ObjUniqIDList[num].split(';');
                    }
                    // console.log(num);
                    // console.log(ObjUniqIDList1);

                    ObjNameList2.map((item, idx) => {
                        ObjNameList3.push([item, ObjUniqIDList1[idx].split(',')[0] + ',' + ObjUniqIDList1[idx].split(',')[1]]);
                    })
                    ObjUniqID = ObjUniqIDList[num].split(',')[0];
                }
              
                // console.log(ObjNameList3);
              
                if(ObjNameList3.length==1){   
                }else{
                    let ObjNameList1 = ['老师阅读详情', ObjUniqID];
                    ObjNameList1.push(ObjNameList3);
                    echartsLeftList.push(ObjNameList1);
                }
              
            }

        } else if (ObjId === 'T1' || ObjId === 'T2') {
            if (ObjNameList.indexOf('学生') !== -1) {
                let ObjNameList2 = ObjNameList.split('$');
                let num = '';
                ObjNameList2.map((item, idx) => {
                    if (item.indexOf('学生') !== -1) {
                        num = idx;
                    }
                });

                ObjNameList2 = ObjNameList2[num].slice(3, ObjNameList2[num].length);
                if (ObjNameList2.indexOf('(') !== -1) {
                    ObjNameList2 = ObjNameList2.slice(ObjNameList2.indexOf('(') + 1, -1)
                    ObjNameList2 = ObjNameList2.split('+');
                } else {
                    ObjNameList2 = ObjNameList2.split(';');
                }
                let ObjUniqIDList1 = [];
                if (ObjUniqIDList[num].indexOf('+') !== -1) {
                    ObjUniqIDList1 = ObjUniqIDList[num].split('+');
                } else {
                    ObjUniqIDList1 = ObjUniqIDList[num].split(';');
                }
                // console.log(num);
                // console.log(ObjUniqIDList1);
                let ObjNameList3 = [];
                ObjNameList2.map((item, idx) => {
                    ObjNameList3.push([item, ObjUniqIDList1[idx]]);
                })
                ObjUniqID = ObjUniqIDList[num].split(',')[0];
                let ObjNameList1 = ['学生阅读详情', ObjUniqID];
                ObjNameList1.push(ObjNameList3);
                echartsLeftList.push(ObjNameList1);
            }
            if (ObjNameList.indexOf('家长') !== -1) {
                let ObjNameList2 = ObjNameList.split('$');
                let num = '';
                ObjNameList2.map((item, idx) => {
                    if (item.indexOf('家长') !== -1) {
                        num = idx;
                    }
                });

                ObjNameList2 = ObjNameList2[num].slice(3, ObjNameList2[num].length);
                if (ObjNameList2.indexOf('(') !== -1) {
                    ObjNameList2 = ObjNameList2.slice(ObjNameList2.indexOf('(') + 1, -1)
                    ObjNameList2 = ObjNameList2.split('+');
                } else {
                    ObjNameList2 = ObjNameList2.split(';');
                }
                let ObjUniqIDList1 = [];
                if (ObjUniqIDList[num].indexOf('+') !== -1) {
                    ObjUniqIDList1 = ObjUniqIDList[num].split('+');
                } else {
                    ObjUniqIDList1 = ObjUniqIDList[num].split(';');
                }
                // console.log(num);
                // console.log(ObjUniqIDList1);
                let ObjNameList3 = [];
                ObjNameList2.map((item, idx) => {
                    ObjNameList3.push([item, ObjUniqIDList1[idx]]);
                })
                ObjUniqID = ObjUniqIDList[num].split(',')[0];
                let ObjNameList1 = ['家长阅读详情', ObjUniqID];
                ObjNameList1.push(ObjNameList3);
                echartsLeftList.push(ObjNameList1);
            }
        }
        // console.log(ObjNameList,ObjId);
        this.setState({
            visible: true,
            NoticeID: NoticeID,
            echartsLeftList: echartsLeftList,

        })
        getData('PublicInfo/Notice/PublishedNoticeMgr/ReadDetailsOverview', {
            UserID: sessionStorage.getItem('UserID'),
            UserType: sessionStorage.getItem('UserType'),
            NoticeID: NoticeID,
        }).then((res) => {
            return res.json()
        }).then((json) => {
            if (json.StatusCode === 200) {
                let UnReadCount = 0;
                // console.log(json);
                json.Data.ObjRecordCountList.map((item) => {
                    UnReadCount += item.UnReadCount * 1;

                })
                this.setState({
                    UnReadCount: UnReadCount,
                })
            }

        })

    }
    gotoPusNoticeContent(id) {
        let url = window.location.href.split('?')[0] + '#/PusNoticeContent?lg_tk=' + sessionStorage.getItem('token') + '&NoticeID=' + id;
        window.open(url, '_blank');
        let $this =this;
        if(!this.state.openAddEvent){
            this.setState({
                openAddEvent:true,
            })
            $this.addEvent(window, 'message', function(e) {
                try {
                    if(e.data==1){
                        $this.getChildrenMsg('','');
                    }
                    
                } catch (ex) {
                }
            }, false);
        }
      
    }
    hideModal = () => {
        this.setState({
            visible: false,
            NoticeMain: 0,
        });
    };
    openCreateNotice() {
        sessionStorage.setItem('editor','editor');
        let timer = setInterval(function () {
            if ($('#editor').length > 0) {
                let ue = window.UE.getEditor('editor');
                ue.ready(() => {
                    ue.setContent('');
                    clearInterval(timer);
                })
            }
        }, 100)
        this.setState({
            visible1: true,
            NoticeMain: 0,
        });
    }
    gotoNoticeTemplate() {
       
        let url = window.location.href.split('?')[0] + '#/NoticeTemplate?lg_tk=' + sessionStorage.getItem('token');
        window.open(url, '_blank');
        
    }
    componentDidMount() {
        let token = '';
        if (!sessionStorage.getItem('token')) {
            token = getQueryVariable('lg_tk');
            sessionStorage.setItem('token', token);
        } else {
            token = sessionStorage.getItem('token');
        }
        if (!token) {
            // let url = window.location.href;
            // url = url.split('?');
            // if (url.length > 1 && url[1].indexOf('&') > -1) {
            //     let pram = url[1].split('&');
            //     url = url[0] + '?';
            //     pram.map((item) => {
            //         if (item.indexOf('lg_tk=') === -1) {
            //             url +=  item;
            //         }
            //     })
            // } else {
            //     url = url[0];
            // }
            // url= encodeURIComponent(url);
            // // alert(  this.state.data.MainServerAddr +'/UserMgr/Login/Login.aspx?lg_sysid='+this.state.data.SysID+'&lg_preurl='+url)\

            // window.open(this.state.data.MainServerAddr + '/UserMgr/Login/Login.aspx?lg_sysid=' + this.state.data.SysID + '&lg_preurl=' + url, '_self');

        }
        if (sessionStorage.getItem('UserType') == 2 || sessionStorage.getItem('UserType') == 3) {
            const history = createHashHistory();
            history.push('/404');
            return
        }

        getData('PublicInfo/Notice/PublishedNoticeMgr/GetSendedNoticeList', {
            UserID: sessionStorage.getItem('UserID'),
            UserType: sessionStorage.getItem('UserType'),
            Keyword: '',
            PageIndex: 1,
            PageSize: 10,
        }).then((res) => {
            return res.json()
        }).then((json) => {
            if (json.Data) {
                this.setState({
                    Total: json.Data.Item.Total,
                    islooding: false,
                })
                if(json.Data.Item.NoticeList&&json.Data.Item.NoticeList.length>0){
                    this.setState({
                        nullFull:2
                    })
                }else{
                    this.setState({
                        nullFull:1
                    })
                }
                this.chamgeNoticeList(json.Data.Item.NoticeList);
            }
        })

        // console.log(this.state.start);
        // getData('PublicInfo/GetUserInfo', {
        //     lg_tk: token
        // }).then(data => {
        //     return data.json()
        // }).then(json => {
        //     if (json.error == 0) {
        //         let { data } = json;
        //         if (data.UserType == 2 || data.UserType == 3) {
        //             const history = createHashHistory();
        //             history.push('/404');
        //             return
        //         }
        //         sessionStorage.setItem('UserID', data.UserID);
        //         sessionStorage.setItem('UserName', data.UserName);
        //         sessionStorage.setItem('UserType', data.UserType);
        //         sessionStorage.setItem('PhotoPath', data.PhotoPath);
        //         sessionStorage.setItem('SchoolID', data.SchoolID);
        //         sessionStorage.setItem('UserClass', data.UserClass);
        //         this.setState({
        //             start: 1,
        //         })
        //         getData('PublicInfo/Notice/PublishedNoticeMgr/GetSendedNoticeList', {
        //             UserID: sessionStorage.getItem('UserID'),
        //             UserType: sessionStorage.getItem('UserType'),
        //             Keyword: this.state.Keyword,
        //             PageIndex: this.state.PageIndex,
        //             PageSize: 10,
        //         }).then((res) => {
        //             return res.json()
        //         }).then((json) => {
        //             if (json.Data) {
        //                 this.setState({
        //                     NoticeList: json.Data.Item.NoticeList,
        //                     Total: json.Data.Item.Total,
        //                 })
        //             }
        //         })
        //         getData('PublicInfo/Notice/TemplateMgr/GetTemplateList', {
        //             UserID: sessionStorage.getItem('UserID'),
        //             UserType: sessionStorage.getItem('UserType'),
        //             PageIndex: this.state.PageIndex,
        //             PageSize: 5,
        //         }).then((res) => {
        //             return res.json()
        //         }).then((json) => {
        //             if (json.Data) {
        //                 console.log(json.Data.Item.Total);
        //                 this.setState({
        //                     TemplateList: json.Data.Item.TemplateList,
        //                     TemplateTotal: json.Data.Item.Total,
        //                 })

        //             }

        //         })

        //         // console.log(this.state.start);
        //     } else {
        //         //    let url = window.location.href;
        //         //         url = url.split('?');
        //         //         if (url.length > 1 && url[1].indexOf('&') > -1) {
        //         //             let pram = url[1].split('&');
        //         //             url = url[0] + '?';
        //         //             pram.map((item) => {
        //         //                 if (item.indexOf('lg_tk=') === -1) {
        //         //                     url +=  item;
        //         //                 }
        //         //             })
        //         //         } else {
        //         //             url = url[0];
        //         //         }
        //         //         url= encodeURIComponent(url);
        //         //         // alert(  this.state.data.MainServerAddr +'/UserMgr/Login/Login.aspx?lg_sysid='+this.state.data.SysID+'&lg_preurl='+url)\

        //         //         window.open(this.state.data.MainServerAddr + '/UserMgr/Login/Login.aspx?lg_sysid=' + this.state.data.SysID + '&lg_preurl=' + url, '_self');

        //     }
        // })


        //     }
        // }, 100);




    }
    RemoveNotice(id) {
        this.setState({
            NoticeID: id,
            isOpen: true,
            message: '是否有撤回该通知公告？',
            buttonType: 1
        })
    }
    createNotice(id) {
        this.setState({
            NoticeMain: 0,
        }, function () {
            getData('PublicInfo/Notice/PublishedNoticeMgr/GetNoticeContentForEdit', {
                NoticeID: id,
                UserID: sessionStorage.getItem('UserID'),
                UserType: sessionStorage.getItem('UserType'),
            }).then((res) => {
                return res.json()
            }).then((json) => {
                if (json.Data.NoticeMain) {
                    sessionStorage.setItem('editor','editor');
                    this.setState({
                        visible1: true,
                        NoticeMain: json.Data.NoticeMain,
                    })

                }

            })
        })



    }
    DelNotice(id) {
        this.setState({
            NoticeID: id,
            isOpen: true,
            message: '是否有删除该通知公告？',
            buttonType: 3
        })
    }
    chamgeNoticeList(NoticeList) {
        if (NoticeList && NoticeList.length > 0) {
            NoticeList.map((item, idx) => {
                let ObjNameListShow = [];
                let ObjNameList = item.ObjNameList;
                ObjNameList = ObjNameList.replace(/\|/g, '，');
                ObjNameList = ObjNameList.replace(/\+/g, '、');
                ObjNameList = ObjNameList.replace(/\;/g, '、');
                ObjNameList = ObjNameList.split('$');
                let ObjNameList2 = [];
                ObjNameList.map((item) => {
                    if (item.indexOf('全部') > -1) {
                        let sliceLength = 0;
                        if (item.indexOf('(') === -1) {
                            sliceLength = item.length;
                        } else {
                            sliceLength = item.indexOf('(');
                        }
                        // ObjNameList2.push(item.slice(0, sliceLength));
                        if (NoticeList[idx].PublisherIdentity === 'T0' || NoticeList[idx].PublisherIdentity === 'T2' || NoticeList[idx].PublisherIdentity === 'T1') {
                            if (item.slice(0, sliceLength).indexOf('家长') > -1) {
                                if (item.PublisherIdentity === 'T1') {
                                    ObjNameListShow.push('所教全部学生的家长');
                                } else {
                                    ObjNameListShow.push('所管全部学生的家长');
                                }

                            }
                            else if (item.slice(0, sliceLength).indexOf('学生') > -1) {
                                if (NoticeList[idx].PublisherIdentity === 'T1') {
                                    ObjNameListShow.push('所教的全部学生');
                                } else {
                                    ObjNameListShow.push('所管的全部学生');
                                }

                            } else if (item.slice(0, sliceLength).indexOf('老师') > -1 && NoticeList[idx].PublisherIdentity === 'T0') {

                                ObjNameListShow.push('所管的全部老师');

                            } else {
                                ObjNameListShow.push(item.slice(0, sliceLength));
                            }


                        } else {
                            ObjNameListShow.push(item.slice(0, sliceLength));
                        }
                         ObjNameList2.push(ObjNameListShow[ObjNameListShow.length-1]);

                    } else {
                        ObjNameList2.push(item);
                        if (NoticeList[idx].PublisherIdentity === 'T0' || NoticeList[idx].PublisherIdentity === 'T2' || NoticeList[idx].PublisherIdentity === 'T1') {
                            if (item.slice(0, item.indexOf(':')).indexOf('家长') > -1) {
                                if (item.PublisherIdentity === 'T1') {
                                    ObjNameListShow.push('所教部分学生的家长');
                                } else {
                                    ObjNameListShow.push('所管部分学生的家长');
                                }

                            }
                            else if (item.slice(0, item.indexOf(':')).indexOf('学生') > -1) {

                                if (NoticeList[idx].PublisherIdentity === 'T1') {
                                    ObjNameListShow.push('所教的部分学生');
                                } else {
                                    ObjNameListShow.push('所管的部分学生');
                                }

                            } else if (item.slice(0, item.indexOf(':')).indexOf('老师') > -1 && NoticeList[idx].PublisherIdentity === 'T0') {
                                ObjNameListShow.push('所管的部分老师');
                            }
                            else {
                                ObjNameListShow.push('部分' + item.slice(0, item.indexOf(':')));
                            }


                        } else {
                            ObjNameListShow.push('部分' + item.slice(0, item.indexOf(':')));
                        }

                    }

                })
                NoticeList[idx].ObjNameList1 = ObjNameList2.join('；');
                NoticeList[idx].ObjNameListShow = ObjNameListShow.join(';');
            })
            this.setState({
                NoticeList: NoticeList,
            })
        }
        else{
            this.setState({
                NoticeList: [],
                nullFull:1,
            })
        }
    }
    getChildrenMsg = (result, msg) => {
        // console.log(result, msg)
        // 很奇怪这里的result就是子组件那bind的第一个参数this，msg是第二个参数
        this.setState({
            Keyword: encodeURIComponent(msg),
            PageIndex:1,
            nullFull:2
        }, function () {
            // const hide = message.loading('正在加载..', 0);
            // Dismiss manually and asynchronously
            getData('PublicInfo/Notice/PublishedNoticeMgr/GetSendedNoticeList', {
                UserID: sessionStorage.getItem('UserID'),
                UserType: sessionStorage.getItem('UserType'),
                Keyword: encodeURIComponent(this.state.Keyword),
                PageIndex: 1,
                PageSize: 10,
            }).then((res) => {
                return res.json()
            }).then((json) => {
                // hide();
                this.setState({
                    Total: json.Data.Item.Total,
                })
                this.chamgeNoticeList(json.Data.Item.NoticeList)
            })
        })
    }
    addEvent(elm, event, handler) {
        // console.log(1313123);
        if (window.attachEvent) {
            elm.attachEvent("on" + event, handler);
        } else if (window.addEventListener) {
            elm.addEventListener(event, handler);
        } else {
            elm['on' + event] = handler;
        }
    }
    render() {



        // const { TopVisit,OnlineUsers,SuspiciousLogin,OnlineDiskUsed,GroupFileSpaceUsed } = HeaderSetting;

        // let onlineNum = OnlineDiskUsed?parseInt(OnlineDiskUsed.split('/')[0]):0;

        // let onlineDiskInfo = this.diskSize(onlineNum);

        // let groupNum = GroupFileSpaceUsed?parseInt(GroupFileSpaceUsed.split('/')[0]):0;

        // let groupInfo = this.diskSize(groupNum);

        return (
            <div>{this.state.islooding ? <div style={{ padding: '200px 0', textAlign: 'center' }}>  </div> :
                <div className="Noticeissued-all">
                    <div className="Noticeissued-head">
                        <span className='Noticeissued-button' onClick={() => { this.openCreateNotice() }}><i></i>发布通知公告</span>
                        <span className='Noticeissued-Template-button' onClick={() => { this.gotoNoticeTemplate() }} > <i></i> <b> 管理模板</b></span>
                        <Search getChildrenMsg={this.getChildrenMsg} placeholderText='输入通知标题进行搜索' width='320'></Search>
                    </div>
                    <p className='Noticeissued-border'></p>
                    {this.state.NoticeList && this.state.NoticeList.length > 0 ? <table>
                        <thead>
                            <tr><th width="401" >标题</th>
                                <th width="222">发布对象</th>
                                <th width="66">已读/未读</th>
                                <th width="149" >发布时间</th>
                                <th width="127">操作</th>
                                <th width="27"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.NoticeList && this.state.NoticeList.map((item, idx) => {
                                return <tr key={item.NoticeID}>
                                    {item.PublishTime ? <td ><i className='notice-push-i'>已发布</i> <span className='NoticeList-tilte' onClick={() => { this.gotoPusNoticeContent(item.NoticeID) }} title={item.NoticeTitle} >{item.NoticeTitle.length > 20 ? item.NoticeTitle.slice(0, 19) + '..' : item.NoticeTitle}</span> {item.IsHaveAttachment === 1 ? <i className='Noticeissued-Attachment'></i> : ''}</td> : <td ><i className='notice-remove-i'>已撤回</i> <span className='NoticeList-tilte' onClick={() => { this.createNotice(item.NoticeID) }} title={item.NoticeTitle} >{item.NoticeTitle.length > 20 ? item.NoticeTitle.slice(0, 19) + '..' : item.NoticeTitle}</span> {item.IsHaveAttachment === 1 ? <i className='Noticeissued-Attachment'></i> : ''}</td>}
                                    <td title={item.ObjNameList1}>{item.ObjNameListShow.length > 17 ? item.ObjNameListShow.slice(0, 15) + '..' : item.ObjNameListShow}</td>
                                    {item.PublishTime ? <td className='notice-details'>{item.AlreadyReadCount}/{item.UnReadCount} <i onClick={(e) => { this.openEcheats(e, item.NoticeID, item.ObjNameList, item.PublisherIdentity, item.ObjUniqIDList) }} ></i></td> : <td>--</td>}
                                    <td>{item.PublishTime ? item.PublishTime.slice(0, -3) : '--'}</td>
                                    {item.PublishTime ? <td><span className='notice-remove' onClick={() => { this.RemoveNotice(item.NoticeID) }}>撤回</span></td> : <td><span className='notice-remove' onClick={() => { this.createNotice(item.NoticeID) }} >发布</span> <span className='notice-remove notice-del' onClick={() => { this.DelNotice(item.NoticeID) }}>删除</span></td>}
                                    <td></td>
                                </tr>
                            })
                            }
                        </tbody>
                    </table> : <div className='notice-null'>
                         <i className='null-img'></i>   
                            <p>{this.state.nullFull==1?'您还未发布通知~':'很抱歉，没有搜索到您要查找的通知~'}</p>
                        </div>}
                    <Pagination className="notice-ant-Pagination" showQuickJumper hideOnSinglePage={true} pageSize={10} defaultCurrent={1} current={this.state.PageIndex} total={this.state.Total} onChange={this.onChangePage} />
                    <ReadNoticeInfo visible={this.state.visible} noticeID={this.state.NoticeID} hideModal={this.hideModal} echartsLeftList={this.state.echartsLeftList} UnReadCount={this.state.UnReadCount}   ></ReadNoticeInfo>
                    <CreateNotice visible={this.state.visible1} hideModal={this.hideModal1} NoticeMain={this.state.NoticeMain} changeNoticeList={this.onChangePage} ></CreateNotice>
                    <Alert message={this.state.message} isOpen={this.state.isOpen} chooseFn={(data) => { this.CreateNoticeFn(data) }}></Alert>
                </div>
            }</div>
        )

    }

}

export default Noticeissued;