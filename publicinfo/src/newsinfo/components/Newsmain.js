import React, { Component } from 'react';
import Footer from '../../common/compont/Footer';
import Header from '../../common/compont/Header';
import Newslists from './Newslists';
import '../../que/components/scss/Quemain.scss';
import { getData } from '../../common/js/fetch';
class Newsmain extends Component {
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
                <Header headerStyle={3}></Header>
                <div className="Quemain-div">  <Newslists></Newslists> </div>
                <Footer></Footer>
            </div>
        )
    }
}

export default Newsmain;