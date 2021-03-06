import React, { Component } from 'react';
import Buttonbar from './Buttonbar';
import './scss/Noticedetails.scss';
import Header from '../../common/compont/Header';
import Navigation from './Navigation';
import Footer from '../../common/compont/Footer';
import { Spin,message } from 'antd';
import { getData } from '../../common/js/fetch';
import { createHashHistory } from 'history'; 
import $ from 'jquery';
class Noticedetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message:{},
            data:[],
            state:0,
            loading:true,
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
        let isread = this.getQueryVariable('isread');
        let token = this.getQueryVariable('lg_tk');
        let NoticeID = this.getQueryVariable('NoticeID');
        if (!token) {
            token = sessionStorage.getItem('token');
        }
        if(window.location.href.split('?')[0].indexOf('PusNoticeContent')>-1){
            if(sessionStorage.getItem('UserType')==2||sessionStorage.getItem('UserType')==3){
                const history = createHashHistory();
        history.push('/Error');
                return
            }
            getData('PublicInfo/Notice/PublishedNoticeMgr/GetNoticeContent', {
                UserID:sessionStorage.getItem('UserID'),
                NoticeID: NoticeID,
                UserType: sessionStorage.getItem('UserType')
            }).then(res => {
                return res.json()
            }).then(json => {
                // console.log(json);
                if (json.StatusCode === 200 &&json.Data.BackCode===1) {
                    let Data = json.Data.Item.NoticeMain; 
                    this.setState({
                        data:Data,
                        state:1,
                        loading:false
                    })
                } else {
                    const history = createHashHistory();
                    history.push('/Error');
                            return
                    // alert(json.Msg);
                }

            })
        }else{
            getData('PublicInfo/Notice/ReceiveNotice/GetNoticeContent', {
                UserID: sessionStorage.getItem('UserID'),
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
                        loading:false,
                    })
                    if(isread=='0'){
                        window.opener.postMessage('2', '*');
                    }  
                } else {
                    const history = createHashHistory();
                    history.push('/Error');
                            return
                    // alert(json.Msg);
                }
            })
        }
        // getData('PublicInfo/GetUserInfo', {
        //     lg_tk: token
        // }).then(res => {
        //     return res.json()
        // }).then(json => {
        //     if (json.error == 0) {
        //         let { data } = json;
        //         this.setState({
        //             message:data,
        //             loading:0,
        //         })
        //         sessionStorage.setItem('UserID',data.UserID);
        //         sessionStorage.setItem('UserType',data.UserType);
        //         if(window.location.href.split('?')[0].indexOf('PusNoticeContent')>-1){
        //             if(data.UserType==2||data.UserType==3){
        //                 const history = createHashHistory();
        //         history.push('/404');
        //                 return
        //             }
        //             getData('PublicInfo/Notice/PublishedNoticeMgr/GetNoticeContent', {
        //                 UserID: data.UserID,
        //                 NoticeID: NoticeID,
        //                 UserType: data.UserType
        //             }).then(res => {
        //                 return res.json()
        //             }).then(json => {
        //                 // console.log(json);
        //                 if (json.StatusCode === 200 &&json.Data.BackCode===1) {
        //                     let Data = json.Data.Item.NoticeMain; 
        //                     this.setState({
        //                         data:Data,
        //                         state:1,
        //                     })
        //                 } else {
        //                     const history = createHashHistory();
        //                     history.push('/404');
        //                             return
        //                     // alert(json.Msg);
        //                 }
        //             })
        //         }else{
        //             getData('PublicInfo/Notice/ReceiveNotice/GetNoticeContent', {
        //                 UserID: data.UserID,
        //                 NoticeID: NoticeID,
        //             }).then(res => {
        //                 return res.json()
        //             }).then(json => {
        //                 // console.log(json);
        //                 if (json.StatusCode === 200 &&json.Data.BackCode===1) {
        //                     let Data = json.Data.Item.NoticeMain; 
        //                     this.setState({
        //                         data:Data,
        //                         state:0,
        //                     })
                          
        //                 } else {
        //                     // const history = createHashHistory();
        //                     // history.push('/404');
        //                             return
        //                     // alert(json.Msg);
        //                 }
        //             })
        //         }


             
        //     }
        //     else {
        //         // const history = createHashHistory();
        //         // history.push('/404');
        //                 return
        //         // alert(json.Msg);
        //     }
        //     // console.log(NoticeID);
        // })

    }
    downFile(url,name){
        let alink = document.createElement('a');
            alink.style.display = 'none';
            alink.href = '../../../FileDownLoad?AttachmentUrl='+decodeURIComponent(url)+'&AttachmentName='+decodeURIComponent(name);
            // let fileName = name ;
            // alink.download = fileName;
            // alink.download = res.headers.get('Content-Disposition');   // 设置文件名
            document.body.appendChild(alink)
            alink.click();
            // URL.revokeObjectURL(alink.href) // 释放URL 对象
            document.body.removeChild(alink);
        // getData('PublicInfo/FileDownLoad', {
        //     AttachmentUrl:url,
        //     AttachmentName:name,
        //     DataError:1,
        // }).then((res) => {
        //     // res =res;
        //     return res.blob()
        // }).then((blob) => {
        //     // console.log(blob.size);
        //     if (blob.size < 140) {
        //         message.error('该附件不存在~');
        //         return;
        //     }
        //     let alink = document.createElement('a');
        //     alink.style.display = 'none'
        //     alink.href = window.URL.createObjectURL(blob);
        //     let fileName = name ;
        //     alink.download = fileName;
        //     // alink.download = res.headers.get('Content-Disposition');   // 设置文件名
        //     document.body.appendChild(alink)
        //     alink.click();
        //     URL.revokeObjectURL(alink.href) // 释放URL 对象
        //     document.body.removeChild(alink);
        // })
        // var $eleForm = $("<form method='get'></form>");
 
        // $eleForm.attr("action",url);

        // $(document.body).append($eleForm);
        // $eleForm.submit();
       
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
                <div>
                <Header headerStyle={1}></Header>
                {this.state.state===1?<Buttonbar message1="撤回" color='blue' message2="撤回并删除" color2='red' NoticeID={this.state.data.NoticeID}></Buttonbar>:''}
                {this.state.data?<div className='notice-details-all'>
                    <div className='notice-details-middle'>
                        <h1>{this.state.data.NoticeTitle}</h1>
                        <p className='notice-details-message'><span> <i className='people-img'></i>{this.state.data.PublisherName}</span><span><i className='timer-img'></i>{this.state.data.EffectTime}</span></p>
                        <p className='notice-details-border'></p>
                        <div className="notice-content notice-contect">{this.showhtml(this.state.data.NoticeContent)}</div>
                        {this.state.data.AttachmentName?<div className="notice-down-box">
                            <p><i></i>附件下载</p>
                            <div className="notice-down-message">
                                <span className='uploadType-img'></span>  
                                <p>{this.state.data.AttachmentName}  <span>{(this.state.data.AttachmentSize/1024/1024)>=1 ? '['+(this.state.data.AttachmentSize/1024/1024).toFixed(1)+'MB]' :'['+(this.state.data.AttachmentSize/1024).toFixed(1)+'KB]'}</span></p>
                                {/* <a  download={this.state.data.AttachmentName} onClick={()=>{this.downFile(this.state.data.AttachmentUrl) }}>下载</a> */}
                                <b className='down-file' href={this.state.data.AttachmentUrl.indexOf('.mp4')===-1&&this.state.data.AttachmentUrl.indexOf('.mp4')===-1?this.state.data.AttachmentUrl:this.state.data.AttachmentUrl+'?filename='+this.state.data.AttachmentName.slice(0,-4)} download={this.state.data.AttachmentName} onClick={()=>{this.downFile(this.state.data.AttachmentUrl,this.state.data.AttachmentName) }}>下载</b>
                            </div>
                        </div>:''}
                    </div>

                </div>:<div></div>}
                <Footer></Footer>
                {this.state.loading?<Spin size="large" />:''}
                </div>
            </div>
        )

    }

}

export default Noticedetails;