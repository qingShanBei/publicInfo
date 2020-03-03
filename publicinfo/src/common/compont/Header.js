import React, { Component } from 'react';
import Navigation from './Navigation';
// import { Avatar } from 'antd';
import { getData, getQueryVariable } from "../js/fetch";
import Alert from './alert_dialog_wrapper';
import '../scss/Header.scss';

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            UserName: "",
            PhotoPath: "",
            data: {},
            isOpen: false,
        }
    }
    componentDidMount() {
        let token = '';
        if (!sessionStorage.getItem('token')) {
            token = getQueryVariable('lg_tk');
            sessionStorage.setItem('token', token);
        } else {
            token = sessionStorage.getItem('token');
        }
        this.setState({
            UserName: decodeURIComponent(sessionStorage.getItem('UserName')),
            PhotoPath: decodeURIComponent(sessionStorage.getItem('PhotoPath')),
        }, () => {
            // sessionStorage.setItem('PsnMgrToken', sessionStorage.getItem('token'));
            let PsnMgrLgAssistantAddr = sessionStorage.getItem('PsnMgrLgAssistantAddr');
            this.loadScriptOrCss([PsnMgrLgAssistantAddr + "/PsnMgr/LgAssistant/css/lancoo.cp.assistantInfoCenter.css",
            PsnMgrLgAssistantAddr + '/PsnMgr/LgAssistant/js/jquery-1.7.2.min.js',
            PsnMgrLgAssistantAddr + "/PsnMgr/LgAssistant/assets/jquery.pagination.js",
            PsnMgrLgAssistantAddr + "/PsnMgr/LgAssistant/js/lancoo.cp.assistantInfoCenter.js",
            
            ]);
        })

        // getData('PublicInfo/GetUserInfo', {
        //     lg_tk: sessionStorage.getItem('token')
        // }).then(data => {
        //     return data.json()
        // }).then(json => {
        //     if (json.error === '0') {
        //         let { data } = json;
        //         sessionStorage.setItem('UserID', data.UserID);
        //         sessionStorage.setItem('UserName', data.UserName);
        //         sessionStorage.setItem('UserType', data.UserType);
        //         sessionStorage.setItem('PhotoPath', data.PhotoPath);
        //         this.setState({
        //             UserName: decodeURIComponent(data.UserName),
        //             PhotoPath: decodeURIComponent(data.PhotoPath),
        //             data: data,
        //         })

        //     }
        // })
    }
    changeIsOpen() {
        this.setState({
            isOpen: true
        })
    }
    loadScriptOrCss(urlArr, num) {
        let $this =this;
        if (!num) {
            num = 0;
        }
        //正则判断是否是css;
        var reg = RegExp(/.css/);

        if (reg.test(urlArr[num])) {
            // 动态生成css
            var scriptOrCss = document.createElement('link');
            scriptOrCss.type = 'text/css';
            scriptOrCss.async = 'async';
            scriptOrCss.href = urlArr[num];
            scriptOrCss.rel = "stylesheet";
            document.getElementsByTagName("head")[0].appendChild(scriptOrCss);

        } else {
            // 动态生成js
            var scriptOrCss = document.createElement('script');
            scriptOrCss.type = 'text/javascript';
            scriptOrCss.async = 'async';
            scriptOrCss.src = urlArr[num];
            document.body.appendChild(scriptOrCss);
        }
        if (scriptOrCss.readyState) {
            //IE下
            scriptOrCss.onreadystatechange = function () {
                if (scriptOrCss.readyState == 'complete' || scriptOrCss.readyState == 'loaded') {
                    scriptOrCss.onreadystatechange = null;
                    num++;
                    if (num == urlArr.length) {
                        return;
                    } else {
                        $this.loadScriptOrCss(urlArr, num);
                    }
                }
            }
        } else {
            //其他浏览器
            scriptOrCss.onload = function () {
                num++;
                if (num == urlArr.length) {
                    return;
                } else {
                    $this.loadScriptOrCss(urlArr, num);
                }
            }
        }
    }
    Logout(data) {
        if (data === 'true') {
            getData('PublicInfo/Logout', {
            }).then(data => {
                return data.json()
            }).then(json => {
                if (json.error === '0') {
                    let url = window.location.href;
                    url = url.split('?');
                    if (url.length > 1 && url[1].indexOf('&') > -1) {
                        let pram = url[1].split('&');
                        url = url[0] + '?';
                        pram.map((item) => {
                            if (item.indexOf('lg_tk=') === -1) {
                                url += item;
                            }
                        })
                    } else {
                        url = url[0];
                    }
                    url = encodeURIComponent(url);
                    sessionStorage.removeItem('token');
                    // alert(  this.state.data.MainServerAddr +'/UserMgr/Login/Login.aspx?lg_sysid='+this.state.data.SysID+'&lg_preurl='+url)\
                    window.open(sessionStorage.getItem('MainServerAddr') + '/UserMgr/Login/Login.aspx?lg_sysid=' + this.state.data.SysID + '&lg_preurl=' + url, '_self');
                }
            })
        }
        this.setState({
            isOpen: false
        })
    }
    openIndex() {
        window.open(sessionStorage.getItem('MainServerAddr'), '_self');
    }
    gotoPersonalMgr() {
        window.open(sessionStorage.getItem('MainServerAddr') + '/html/personalMgr/', '_blank');
    }
    render() {
        let className1 = '';
        let name = '';
        let Engname = '';
        let LitleName = '';
        if (this.props.headerStyle === 1) {
            className1 = 'notice-header-logn  noticeHeader';

            name = '通知公告';
            Engname = 'Announcements';
        }
        if (this.props.headerStyle === 2) {
            className1 = 'notice-header-logn  QueHeader';
            name = '问卷调查';
            Engname = 'Questionnaire survey';
        }
        if (this.props.headerStyle === 11) {
            className1 = 'notice-header-logn  noticeHeader';
            name = '通知公告';
            LitleName = '- 模板库';
            Engname = 'Announcements - Template Library';
        }
        if (this.props.headerStyle === 3) {
            className1 = 'notice-header-logn  newsHeader';
            name = '新闻资讯';
            Engname = 'News and information';
        }
        // const { HeaderSetting,LoginUser,HeaderMenuToggle,LogOut } = this.props;

        // const { TopVisit,OnlineUsers,SuspiciousLogin,OnlineDiskUsed,GroupFileSpaceUsed } = HeaderSetting;

        // let onlineNum = OnlineDiskUsed?parseInt(OnlineDiskUsed.split('/')[0]):0;

        // let onlineDiskInfo = this.diskSize(onlineNum);

        // let groupNum = GroupFileSpaceUsed?parseInt(GroupFileSpaceUsed.split('/')[0]):0;

        // let groupInfo = this.diskSize(groupNum);
        return (
            <div className="notice-header">
                <div className="notice-header-top">
                    <div className="box-middle">
                        <span className='login_logo'></span>
                        <span onClick={() => { this.openIndex() }}>中小学一体化学科教育云</span>
                        <div className="notice-header-right">
                            <div id="Assistant_infoCenter" ></div>
                            <div className='notice-header-border' ></div>
                            <div className='notice-header-sculpture' style={{ 'backgroundImage': `url(${this.state.PhotoPath})` }} onClick={() => { this.gotoPersonalMgr() }}></div>
                            <div className='notice-header-name' onClick={() => { this.gotoPersonalMgr() }} >{this.state.UserName}</div>
                            <i onClick={() => { this.changeIsOpen() }}></i>
                        </div>
                        <div >
                            <span className={className1}  ></span>
                            <span className="notice-header-title" >{name}</span> <span className='header-litle'>{LitleName}</span>
                            <span className="notice-header-title1" >{Engname}</span>
                        </div>
                    </div>
                    <Alert message='您确定要退出登录么?' isOpen={this.state.isOpen} chooseFn={(data) => { this.Logout(data) }}></Alert>
                    <Navigation />
                </div>
            </div>
        )

    }

}

export default Header;