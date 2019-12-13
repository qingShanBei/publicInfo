import React, { Component } from 'react';
import './scss/alert_dialog_wrapper.scss';
class Alert extends Component {
    state = { visible: false };


    render() {
        // const { message1, message2, color, color2 } = this.props;
        // const { TopVisit,OnlineUsers,SuspiciousLogin,OnlineDiskUsed,GroupFileSpaceUsed } = HeaderSetting;

        // let onlineNum = OnlineDiskUsed?parseInt(OnlineDiskUsed.split('/')[0]):0;

        // let onlineDiskInfo = this.diskSize(onlineNum);

        // let groupNum = GroupFileSpaceUsed?parseInt(GroupFileSpaceUsed.split('/')[0]):0;

        // let groupInfo = this.diskSize(groupNum);

        return (
            
           <div>
                {this.props.isOpen?<div className="alert_dialog_tab">
            <div className="border alert_dialog_wrapper" id="alert_dialog_wrapper" >
                <div className="alert_close_btn" onClick={()=>{this.props.chooseFn(false)}}></div>
                <div className="alert_dialog_content ">
                    <div className="left-icon btn-query"></div>
                    <div className="alert_dialog_msg btn-query">{this.props.message}</div>
                </div>
                <div className="alert_dialog_footer">
                    <i onClick={()=>{this.props.chooseFn('true')}}>确定</i><i onClick={()=>{this.props.chooseFn(false)}}>取消</i>
                </div>
            </div>
        </div>:''}
           </div>

        )

    }

}
export default Alert;