import React, { Component } from 'react';
import Noticeissued from './Noticeissued';
import NoticeTemplate from './NoticeTemplate';
import Buttonbar from './Buttonbar';
import Header from './Header';
import Navigation from './Navigation';
import Footer from './Footer';
import { getData } from "../common/js/fetch";
import { message } from 'antd';
import { Spin } from 'antd';
import { Math } from 'es6-shim';
let token = '';
function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) { return pair[1]; }
    }
    return (false);
}
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
    getChildrenMsg = (result, msg) => {
        // console.log(result, msg)
        // 很奇怪这里的result就是子组件那bind的第一个参数this，msg是第二个参数
        this.setState({
            Keyword: msg
        }, function () {
            const hide = message.loading('正在加载..', 0);
            // Dismiss manually and asynchronously

            getData('PublicInfo/Notice/PublishedNoticeMgr/GetSendedNoticeList', {
                UserID: sessionStorage.getItem('UserID'),
                UserType: sessionStorage.getItem('UserType'),
                Keyword: this.state.Keyword,
                PageIndex: this.state.PageIndex,
                PageSize: 10,
            }).then((res) => {
                return res.json()
            }).then((json) => {
                hide();
                this.setState({
                    NoticeList: json.Data.Item.NoticeList,
                    Total: json.Data.Item.Total,
                })
            })
        })
    }
    TemplategetChildrenMsg = (result, msg) => {
        // console.log(result, msg)
        // 很奇怪这里的result就是子组件那bind的第一个参数this，msg是第二个参数
        this.setState({
            Keyword: msg
        }, function () {
            const hide = message.loading('正在加载..', 0);
            // Dismiss manually and asynchronously
            getData('PublicInfo/Notice/PublishedNoticeMgr/GetSendedNoticeList', {
                UserID: sessionStorage.getItem('UserID'),
                UserType: sessionStorage.getItem('UserType'),
                Keyword: this.state.Keyword,
                PageIndex: this.state.PageIndex,
                PageSize: 10,
            }).then((res) => {
                return res.json()
            }).then((json) => {
                hide();
                this.setState({
                    NoticeList: json.Data.Item.NoticeList,
                    Total: json.Data.Item.Total,
                })
            })
        })
    }

    getChildrenPageIndex = (PageIndex) => {
        const hide = message.loading('正在加载..', 0);
        this.setState({
            PageIndex: PageIndex
        }, function () {
            hide();
            getData('PublicInfo/Notice/PublishedNoticeMgr/GetSendedNoticeList', {
                UserID: sessionStorage.getItem('UserID'),
                UserType: sessionStorage.getItem('UserType'),
                Keyword: this.state.Keyword,
                PageIndex: this.state.PageIndex,
                PageSize: 10,
            }).then((res) => {
                return res.json()
            }).then((json) => {

                this.setState({
                    NoticeList: json.Data.Item.NoticeList,
                    Total: json.Data.Item.Total,
                })
            })
        })
    }
    componentDidMount() {
        if (getQueryVariable('lg_tk')) {
            token = getQueryVariable('lg_tk');
            sessionStorage.setItem('token', token);
        } else {
            token = sessionStorage.getItem('token');
        }
        // console.log(this.state.start);
        getData('PublicInfo/GetUserInfo', {
            lg_tk: token
        }).then(data => {
            return data.json()
        }).then(json => {
            if (json.error == 0) {
                let { data } = json;
                sessionStorage.setItem('UserID', data.UserID);
                sessionStorage.setItem('UserName', data.UserName);
                sessionStorage.setItem('UserType', data.UserType);
                sessionStorage.setItem('PhotoPath', data.PhotoPath);
                sessionStorage.setItem('SchoolID', data.SchoolID);
                sessionStorage.setItem('UserClass', data.UserClass);
                this.setState({
                    start: 1,
                })
                getData('PublicInfo/Notice/PublishedNoticeMgr/GetSendedNoticeList', {
                    UserID: sessionStorage.getItem('UserID'),
                    UserType: sessionStorage.getItem('UserType'),
                    Keyword: this.state.Keyword,
                    PageIndex: this.state.PageIndex,
                    PageSize: 10,
                }).then((res) => {
                    return res.json()
                }).then((json) => {
                    if (json.Data) {
                        this.setState({
                            NoticeList: json.Data.Item.NoticeList,
                            Total: json.Data.Item.Total,
                        })
                    }
                })
                getData('PublicInfo/Notice/TemplateMgr/GetTemplateList', {
                    UserID: sessionStorage.getItem('UserID'),
                    UserType: sessionStorage.getItem('UserType'),
                    PageIndex: this.state.PageIndex,
                    PageSize: 5,
                }).then((res) => {
                    return res.json()
                }).then((json) => {
                    if (json.Data) {
                        console.log(json.Data.Item.Total);
                        this.setState({
                            TemplateList: json.Data.Item.TemplateList,
                            TemplateTotal: json.Data.Item.Total,
                        })
        
                    }
        
                })

                // console.log(this.state.start);
            }
        })

       
        //     }
        // }, 100);




    }
    updateFn=()=>{
        const hide = message.loading('正在加载..', 0);
        this.setState({
            PageIndex: 1
        }, function () {
            hide();
            getData('PublicInfo/Notice/PublishedNoticeMgr/GetSendedNoticeList', {
                UserID: sessionStorage.getItem('UserID'),
                UserType: sessionStorage.getItem('UserType'),
                Keyword: this.state.Keyword,
                PageIndex: this.state.PageIndex,
                PageSize: 10,
            }).then((res) => {
                return res.json()
            }).then((json) => {

                this.setState({
                    NoticeList: json.Data.Item.NoticeList,
                    Total: json.Data.Item.Total,
                })
            })
        })
    }
    render() {

        // let { message } = this.props;
        return (
            <div>
                {this.state.start === 0 ? <div className='loading'> <Spin className="loading-size" size="large" tip="加载中..." /> </div> : <div>
                    <Header></Header>
                    <Navigation></Navigation>
                    <Buttonbar message1="<i>+</i>创建通知" color='blue'  ></Buttonbar>
                    <div className="sidebar-all ">
                        <div className="sidebar-middle ">
                            <img src={require('./images/选项卡插图【通知公告】.png')}></img>
                            <div className={this.state.className1} onClick={(event) => this.checkMenu(1)}><i className='sidebar-div-i1'></i>已发通知</div>
                            <div className={this.state.className2} onClick={(event) => this.checkMenu(2)} ><i className='sidebar-div-i2' ></i>通知模板库</div>
                            {this.state.choose === 1 ? <Noticeissued NoticeList={this.state.NoticeList} Total={this.state.Total} getChildrenPageIndex={this.getChildrenPageIndex} getChildrenMsg={this.getChildrenMsg} PageIndex={this.state.PageIndex}> </Noticeissued> :
                                <NoticeTemplate TemplateList={this.state.TemplateList} Total={this.state.TemplateTotal} TemplatePageIndex={this.state.TemplatePageIndex} ></NoticeTemplate>

                            }    </div>
                    </div>
                    <Footer></Footer>
                </div>}
            </div>
        )

    }

}

export default Sidebar;