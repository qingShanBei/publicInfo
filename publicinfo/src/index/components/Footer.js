import React,{Component} from 'react';
import './scss/Footer.scss';
class Footer extends Component{

    render() {

        // const { HeaderSetting,LoginUser,HeaderMenuToggle,LogOut } = this.props;

        // const { TopVisit,OnlineUsers,SuspiciousLogin,OnlineDiskUsed,GroupFileSpaceUsed } = HeaderSetting;

        // let onlineNum = OnlineDiskUsed?parseInt(OnlineDiskUsed.split('/')[0]):0;

        // let onlineDiskInfo = this.diskSize(onlineNum);

        // let groupNum = GroupFileSpaceUsed?parseInt(GroupFileSpaceUsed.split('/')[0]):0;

        // let groupInfo = this.diskSize(groupNum);

        return (
		       
		<div className='footer'>
            <p> 蓝鸽科技  版权所有 </p>
        </div>
        )

    }

}

export default Footer;