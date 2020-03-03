import React, { Component } from 'react';
import CreateNotice from './CreateNotice';
import Alert from '../../common/compont/alert_dialog_wrapper';
import { getData } from '../../common/js/fetch';
import { createHashHistory } from 'history';
class Buttonbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            message: '',
            isOpen: false,
            NoticeMain: 0,
            button: 0,
        };
    }

    showModal = () => {
        if (this.props.NoticeID) {
            this.setState({
                message: '本通知将会被撤回并重新编辑，是否撤回？',
                isOpen: 'true',
                button: 0,
            })
        } else {
            this.setState({
                visible: true,
            });
            sessionStorage.setItem('editor', 'editor');
        }
    };
    showModal1 = () => {
        if (this.props.NoticeID) {
            this.setState({
                message: '本通知将会被撤回并删除，是否撤回？',
                isOpen: 'true',
                button: 1,
            })
        }
    };
    CreateNoticeFn(data) {
        if (data === 'true') {
            if (this.state.button === 0) {
                getData('PublicInfo/Notice/PublishedNoticeMgr/RevokeNotice', {
                    UserID: sessionStorage.getItem('UserID'),
                    UserType: sessionStorage.getItem('UserType'),
                    NoticeID: this.props.NoticeID,
                }).then((res) => {
                    return res.json();
                }).then((json) => {
                    if (json.StatusCode === 200 && json.Data.BackCode === 1) {
                        window.opener.postMessage('1', '*');
                       window.close();
                    }
                })
            } else {
                getData('PublicInfo/Notice/PublishedNoticeMgr/DeleteNotice', {
                    UserID: sessionStorage.getItem('UserID'),
                    UserType: sessionStorage.getItem('UserType'),
                    NoticeID: this.props.NoticeID,
                }).then((res) => {
                    return res.json();
                }).then((json) => {
                    if (json.StatusCode === 200 && json.Data.BackCode === 1) {
                        window.opener.postMessage('1', '*');
                        window.close();
                    }
                })
            }
        } else {
            this.setState({
                isOpen: false,
            })
        }
    }
    hideModal = () => {
        this.setState({
            visible: false,
        });
    };
    // updataFn2=()=>{
    //     console.log(1313)
    //     // this.props.updateFn();
    // }

    render() {
        const { message1, message2, color, color2 } = this.props;
        // const { TopVisit,OnlineUsers,SuspiciousLogin,OnlineDiskUsed,GroupFileSpaceUsed } = HeaderSetting;

        // let onlineNum = OnlineDiskUsed?parseInt(OnlineDiskUsed.split('/')[0]):0;

        // let onlineDiskInfo = this.diskSize(onlineNum);

        // let groupNum = GroupFileSpaceUsed?parseInt(GroupFileSpaceUsed.split('/')[0]):0;

        // let groupInfo = this.diskSize(groupNum);
        function showhtml(htmlString) {
            var html = { __html: htmlString };
            return <div dangerouslySetInnerHTML={html}></div>;
        }
        return (

            <div className="Buttonbar-all">
                <div className="Buttonbar-middle">
                    {message2 ? <span className={color2} onClick={this.showModal1} >{showhtml(message2)} </span> : ''}
                    <span className={color} onClick={this.showModal}>{showhtml(message1)} </span>
                </div>
                <CreateNotice visible={this.state.visible} hideModal={this.hideModal} NoticeMain={this.state.NoticeMain}   ></CreateNotice>
                <Alert message={this.state.message} isOpen={this.state.isOpen} chooseFn={(data) => { this.CreateNoticeFn(data) }}></Alert>
            </div>
        )
    }
}
export default Buttonbar;