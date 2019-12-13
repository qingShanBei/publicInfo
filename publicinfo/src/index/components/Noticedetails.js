import React, { Component } from 'react';
import Buttonbar from './Buttonbar';
import './scss/Noticedetails.scss';
import Header from './Header';
import Navigation from './Navigation';
import Footer from './Footer';
import { Spin } from 'antd';
import { getData } from "../common/js/fetch";
import { createHashHistory } from 'history'; 
class Noticedetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message:{},
            data:[],
            state:0,
            loading:1,
        };
    }
     getQueryVariable(variable) {
        var query = window.location.hash.substring(1).split("?");
        query = query[1];
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] == variable) { return pair[1]; }
        }
        return (false);
    }
    showhtml(htmlString) {
        var html = { __html: htmlString };
        return <div dangerouslySetInnerHTML={html}></div>;
    }
    componentDidMount() {
        let token = this.getQueryVariable('lg_tk');
        let NoticeID = this.getQueryVariable('NoticeID');
        if (!token) {
            token = sessionStorage.getItem('token');
        }
        getData('PublicInfo/GetUserInfo').then(res => {
            return res.json()
        }).then(json => {
            if (json.error == 0) {
                let { data } = json;
                this.setState({
                    message:data,
                    loading:0,
                })
                sessionStorage.setItem('UserID',data.UserID);
                sessionStorage.setItem('UserType',data.UserType);
                if(window.location.href.split('?')[0].indexOf('PusNoticeContent')>-1){
                    if(data.UserType==2||data.UserType==3){
                        const history = createHashHistory();
                history.push('/404');
                        return
                    }
                    getData('PublicInfo/Notice/PublishedNoticeMgr/GetNoticeContent', {
                        UserID: data.UserID,
                        NoticeID: NoticeID,
                        UserType: data.UserType
                    }).then(res => {
                        return res.json()
                    }).then(json => {
                        // console.log(json);
                        if (json.StatusCode === 200 &&json.Data.BackCode===1) {
                            let Data = json.Data.Item.NoticeMain; 
                            this.setState({
                                data:Data,
                                state:1,
                            })
                        } else {
                            const history = createHashHistory();
                            history.push('/404');
                                    return
                            // alert(json.Msg);
                        }
                    })
                }else{
                    getData('/PublicInfo/Notice/ReceiveNotice/GetNoticeContent', {
                        UserID: data.UserID,
                        NoticeID: NoticeID,
                    }).then(res => {
                        return res.json()
                    }).then(json => {
                        // console.log(json);
                        if (json.StatusCode === 200 &&json.Data.BackCode===1) {
                            let Data = json.Data.Item.NoticeMain; 
                            this.setState({
                                data:Data,
                                state:0,
                            })
                          
                        } else {
                            const history = createHashHistory();
                            history.push('/404');
                                    return
                            // alert(json.Msg);
                        }
                    })
                }


             
            }
            else {
                // alert(json.Msg);
            }
            // console.log(NoticeID);
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
            <div>
                {this.state.loading===1?<div className='loading'> <Spin className="loading-size" size="large" tip="加载中..." /> </div>:
                <div>
                <Header></Header>
                <Navigation></Navigation>
                {this.state.state===1?<Buttonbar message1="撤回并编辑" color='blue' message2="撤回并删除" color2='red' NoticeID={this.state.data[0].NoticeID}></Buttonbar>:''}
                {this.state.data&&this.state.data.length>0?<div className='notice-details-all'>
                    <div className='notice-details-middle'>
                        <h1>{this.state.data[0].NoticeTitle}</h1>
                        <p className='notice-details-message'><span><img src={require('./images/用户.png')} />{this.state.data[0].PublisherName}</span><span><img src={require('./images/时间.png')} />{this.state.data[0].EffectTime}</span></p>
                        <p className='notice-details-border'></p>
                        <div className="notice-content">{this.showhtml(this.state.data[0].NoticeContent)}</div>
                        {this.state.data[0].AttachmentName?<div className="notice-down-box">
                            <p><i></i>附件下载</p>
                            <div className="notice-down-message">
                                <img  src={require('./images/uploadType/doc.png')} />
                                <p>{this.state.data[0].AttachmentName}  <span>{(this.state.data[0].AttachmentSize/1024/1024)>=1 ? '['+(this.state.data[0].AttachmentSize/1024/1024).toFixed(1)+'MB]' :'['+(this.state.data[0].AttachmentSize/1024).toFixed(1)+'KB]'}</span></p>
                                <a href={this.state.data[0].AttachmentUrl} download={this.state.data[0].AttachmentName} >下载</a>
                            </div>
                        </div>:''}
                    </div>

                </div>:<div className='notice-details-empty'><h1>该通知不存在</h1></div>}
                <Footer></Footer>
                </div>}
            </div>
        )

    }

}

export default Noticedetails;