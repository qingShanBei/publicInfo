import React, { Component } from 'react';
import Footer from '../../common/compont/Footer';
import Header from '../../common/compont/Header';
import QueList from './QueList';
import './scss/Quemain.scss';
import { getData } from '../../common/js/fetch';
class Quemain extends Component {
    constructor(props) {
        super(props);
        this.state = {
            start: 0,
        }
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
                <Header headerStyle={2}></Header>
                <div className="Quemain-div">  <QueList></QueList> </div>
                <Footer></Footer>
            </div>
        )
    }
}

export default Quemain;