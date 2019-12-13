import React, { Component } from 'react';
import Navigation from './Navigation';
// import { Avatar } from 'antd';
import { getData } from "../common/js/fetch";
import Alert from './alert_dialog_wrapper';
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
        getData('PublicInfo/GetUserInfo', {
            lg_tk: sessionStorage.getItem('token')
        }).then(data => {
            return data.json()
        }).then(json => {
            if (json.error === '0') {
                let { data } = json;
                sessionStorage.setItem('UserID', data.UserID);
                sessionStorage.setItem('UserName', data.UserName);
                sessionStorage.setItem('UserType', data.UserType);
                sessionStorage.setItem('PhotoPath', data.PhotoPath);
                this.setState({
                    UserName: decodeURIComponent(data.UserName),
                    PhotoPath: decodeURIComponent(data.PhotoPath),
                    data: data,
                })

            }
        })
    }
    changeIsOpen() {
        this.setState({
            isOpen: true
        })
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
                                url +=  item;
                            }
                        })
                    } else {
                        url = url[0];
                    }
                    console.log(url);
                    url= encodeURIComponent(url);
                    // alert(  this.state.data.MainServerAddr +'/UserMgr/Login/Login.aspx?lg_sysid='+this.state.data.SysID+'&lg_preurl='+url)\

                    window.open(this.state.data.MainServerAddr + '/UserMgr/Login/Login.aspx?lg_sysid=' + this.state.data.SysID + '&lg_preurl=' + url, '_self');

                }
            })
        }
        this.setState({
            isOpen: false
        })
    }
    render() {

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
                        <img src={require('./images/中小学一体化学科教育云.png')} />
                        <span>中小学一体化学科教育云</span>
                        <div className="notice-header-right">
                            <div id="Assistant_infoCenter" ></div>
                            <div className='notice-header-border' ></div>
                            <div className='notice-header-sculpture' style={{ 'backgroundImage': `url(${this.state.PhotoPath})` }} ></div>
                            <div className='notice-header-name' >{this.state.UserName}</div>
                            <i onClick={() => { this.changeIsOpen() }}></i>
                        </div>
                        <div>
                            <img className="notice-header-logn" src={require('./images/模块图标_通知.png')} />
                            <span className="notice-header-title" >通知公告</span>
                            <span className="notice-header-title1" >Announcements</span>
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