import React, { Component } from 'react';
import Noticeissued from './Noticeissued';
// import NoticeTemplate from './NoticeTemplate';
// import Buttonbar from './Buttonbar';
// import Navigation from './Navigation';
import Footer from '../../common/compont/Footer';
import Header from '../../common/compont/Header';
import { getData ,getQueryVariable } from '../../common/js/fetch';
import { message } from 'antd';
import { Spin } from 'antd';
import { Math } from 'es6-shim';
import { createHashHistory } from 'history';
let token = '';

class Sidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            choose: 1,
            className1: "sidebar-active sidebar-div",
            className2: "sidebar-div",
            Keyword: '',
            NoticeList: '',
            Total: 1,
            PageIndex: 1,
            TemplateList: [],
            TemplateTotal: 0,
            TemplatePageIndex: 1,
            start: 0,
            loading:false,
        };
        this.checkMenu = this.checkMenu.bind(this);
    }

    checkMenu(num, event) {
        if (num !== this.state.choose) {
            if (num === 1) {
                this.setState({
                    choose: num,
                    className1: "sidebar-active sidebar-div",
                    className2: "sidebar-div"
                })
            }
            if (num === 2) {
                this.setState({
                    choose: num,
                    className2: "sidebar-active sidebar-div",
                    className1: "sidebar-div"
                })
            }
        }
    }
    
   
    getChildrenPageIndex = (PageIndex) => {
        // const hide = message.loading('正在加载..', 0);
        this.setState({
            PageIndex: PageIndex,
            loading:true,
        }, function () {
            // hide();
            getData('PublicInfo/Notice/PublishedNoticeMgr/GetSendedNoticeList', {
                UserID: sessionStorage.getItem('UserID'),
                UserType: sessionStorage.getItem('UserType'),
                Keyword:encodeURIComponent(this.state.Keyword),
                PageIndex: this.state.PageIndex,
                PageSize: 10,
            }).then((res) => {
                return res.json()
            }).then((json) => {

                this.setState({
                    NoticeList: json.Data.Item.NoticeList,
                    Total: json.Data.Item.Total,
                    loading:false,
                })
            })
        })
    }
    componentDidMount() {
        if (!sessionStorage.getItem('token')) {
            token = getQueryVariable('lg_tk');
            sessionStorage.setItem('token', token);
        } else {
            token = sessionStorage.getItem('token');
        }
        if(!token){
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
        if(sessionStorage.getItem('UserType')=='2'||sessionStorage.getItem('UserType')=='3'){
            const history = createHashHistory();
            history.push('/404');
                    return
        }
        // console.log(this.state.start);
        // getData('PublicInfo/GetUserInfo', {
        //     lg_tk: token
        // }).then(data => {
        //     return data.json()
        // }).then(json => {
        //     if (json.error == 0) {
        //         let { data } = json;
        //         if( data.UserType==2|| data.UserType==3){
                   
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
        //         // getData('PublicInfo/Notice/PublishedNoticeMgr/GetSendedNoticeList', {
        //         //     UserID: sessionStorage.getItem('UserID'),
        //         //     UserType: sessionStorage.getItem('UserType'),
        //         //     Keyword: this.state.Keyword,
        //         //     PageIndex: this.state.PageIndex,
        //         //     PageSize: 10,
        //         // }).then((res) => {
        //         //     return res.json()
        //         // }).then((json) => {
        //         //     if (json.Data) {
        //         //         this.setState({
        //         //             NoticeList: json.Data.Item.NoticeList,
        //         //             Total: json.Data.Item.Total,
        //         //         })
        //         //     }
        //         // })
                

        //         // console.log(this.state.start);
        //     }else{
        //     //    let url = window.location.href;
        //     //         url = url.split('?');
        //     //         if (url.length > 1 && url[1].indexOf('&') > -1) {
        //     //             let pram = url[1].split('&');
        //     //             url = url[0] + '?';
        //     //             pram.map((item) => {
        //     //                 if (item.indexOf('lg_tk=') === -1) {
        //     //                     url +=  item;
        //     //                 }
        //     //             })
        //     //         } else {
        //     //             url = url[0];
        //     //         }
        //     //         url= encodeURIComponent(url);
        //     //         // alert(  this.state.data.MainServerAddr +'/UserMgr/Login/Login.aspx?lg_sysid='+this.state.data.SysID+'&lg_preurl='+url)\

        //     //         window.open(this.state.data.MainServerAddr + '/UserMgr/Login/Login.aspx?lg_sysid=' + this.state.data.SysID + '&lg_preurl=' + url, '_self');

        //     }
        // })

       
        //     }
        // }, 100);




    }
   
    render() {

        // let { message } = this.props;
        return (
            <div>
                <div>
                    <Header headerStyle={1}></Header>
                    <div className="sidebar-all ">
                        <div className="sidebar-middle ">
                        {/* <div className='sidebar-button' style={{width:'131px',height:'35px',overflow:'hidden',display: 'inline-block'}}><Buttonbar  message1="发布通知公告" color='blue'  ></Buttonbar></div> */}
                            {/* <img src={require('./images/选项卡插图【通知公告】.png')}></img>
                            <div className={this.state.className1} onClick={(event) => this.checkMenu(1)}><i className='sidebar-div-i1'></i>已发通知</div>
                            <div className={this.state.className2} onClick={(event) => this.checkMenu(2)} ><i className='sidebar-div-i2' ></i>通知模板库</div> */}
                             <Noticeissued NoticeList={this.state.NoticeList} Total={this.state.Total} getChildrenPageIndex={this.getChildrenPageIndex} getChildrenMsg={this.getChildrenMsg} PageIndex={this.state.PageIndex}> </Noticeissued> 
                                {/* <NoticeTemplate TemplateList={this.state.TemplateList} Total={this.state.TemplateTotal} TemplatePageIndex={this.state.TemplatePageIndex} ></NoticeTemplate> */}
                            </div>
                    </div>
                    <Footer></Footer>
                </div>
            </div>
        )
    }

}

export default Sidebar;