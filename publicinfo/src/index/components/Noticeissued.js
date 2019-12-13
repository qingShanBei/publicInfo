import React, { Component } from 'react';
import { getData } from "../common/js/fetch";
import Search from './Search';
import ReadNoticeInfo from './ReadNoticeInfo';
import { Pagination } from 'antd';

class Noticeissued extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            NoticeID: '',
            echartsLeftList: [],

        }
        this.onChangePage = this.onChangePage.bind(this);
        this.openEcheats = this.openEcheats.bind(this);

    }
    onChangePage(page) {
        this.props.getChildrenPageIndex(page);
        // console.log( this.state.value);
    }
    openEcheats(e,NoticeID, ObjNameList, ObjId, ObjUniqIDList) {
        e.stopPropagation();
        ObjUniqIDList = ObjUniqIDList.split('$');
        ObjUniqIDList.map((item, idx) => {
            if (item.indexOf('(') !== -1) {
                item = item.slice(item.indexOf('(') + 1, -1);
            }
            ObjUniqIDList[idx] = item;
        })

        let ObjUniqID = '';
        let echartsLeftList = [['总览', 0]];
        if (ObjId === 'A0') {
            if (ObjNameList.indexOf('管理员') !== -1) {
                let ObjNameList2 = ObjNameList.split('$');
                let num  ='';
                 ObjNameList2.map((item, idx) => {
                    if (item.indexOf('管理员') !== -1) {
                        num = idx;
                    }
                });
                ObjUniqID = ObjUniqIDList[num].split(',')[0];
                echartsLeftList.push(['管理员阅读详情', ObjUniqID]);
            }
            if (ObjNameList.indexOf('领导') !== -1) {
                let ObjNameList2 = ObjNameList.split('$');
                let num  ='';
                 ObjNameList2.map((item, idx) => {
                    if (item.indexOf('领导') !== -1) {
                        num = idx;
                    }
                });
                ObjUniqID = ObjUniqIDList[num].split(',')[0];
                echartsLeftList.push(['领导阅读详情', ObjUniqID]);
            }
        } else if (ObjId === 'A1') {
            if (ObjNameList.indexOf('领导') !== -1) {
                let ObjNameList2 = ObjNameList.split('$');
                let num  ='';
                 ObjNameList2.map((item, idx) => {
                    if (item.indexOf('领导') !== -1) {
                        num = idx;
                    }
                });
                ObjUniqID = ObjUniqIDList[num].split(',')[0];
                echartsLeftList.push(['领导阅读详情', ObjUniqID]);
            }

        } else if (ObjId === 'L1') {
            if (ObjNameList.indexOf('教研组长') !== -1) {
                let ObjNameList2 = ObjNameList.split('$');
                let num  ='';
                 ObjNameList2.map((item, idx) => {
                    if (item.indexOf('教研组长') !== -1) {
                        num = idx;
                    }
                });
                ObjUniqID = ObjUniqIDList[num].split(',')[0];
                echartsLeftList.push(['教研组长阅读详情', ObjUniqID]);
            }
            if (ObjNameList.indexOf('班主任') !== -1) {
                let ObjNameList2 = ObjNameList.split('$');
                let num = '';
                ObjNameList2.map((item, idx) => {
                    if (item.indexOf('班主任') !== -1) {
                        num = idx;
                    }
                });
               
                ObjNameList2 = ObjNameList2[num].slice(3, ObjNameList2[num].length);
                if(ObjNameList2.indexOf('(')!==-1){
                    ObjNameList2 =ObjNameList2.slice(ObjNameList2.indexOf('(') + 1, -1)
                    ObjNameList2 = ObjNameList2.split('+');
                }else{
                    ObjNameList2 = ObjNameList2.split(';');
                }
                let ObjUniqIDList1 =[];
                if(ObjUniqIDList[num].indexOf('+')!==-1){
                     ObjUniqIDList1 = ObjUniqIDList[num].split('+');
                }else{
                    ObjUniqIDList1 = ObjUniqIDList[num].split(';');
                }
                // console.log(num);
                // console.log(ObjUniqIDList1);
                let ObjNameList3 = [];
                ObjNameList2.map((item, idx) => {
                        ObjNameList3.push([item, ObjUniqIDList1[idx]]);
                })
                ObjUniqID = ObjUniqIDList[num].split(',')[0];
                let ObjNameList1 = ['班主任阅读详情', ObjUniqID];
                ObjNameList1.push(ObjNameList3);
                echartsLeftList.push(ObjNameList1);
            }
        } else if (ObjId === 'T0') {
            if (ObjNameList.indexOf('老师') !== -1) {
                let ObjNameList2 = ObjNameList.split('$');
                let num  ='';
                 ObjNameList2.map((item, idx) => {
                    if (item.indexOf('老师') !== -1) {
                        num = idx;
                    }
                });
                ObjUniqID = ObjUniqIDList[num].split(',')[0];
                echartsLeftList.push(['老师阅读详情', ObjUniqID]);
            }
         
        } else if (ObjId === 'T1'||ObjId === 'T2') {
            if (ObjNameList.indexOf('学生') !== -1) {
                let ObjNameList2 = ObjNameList.split('$');
                let num = '';
                ObjNameList2.map((item, idx) => {
                    if (item.indexOf('学生') !== -1) {
                        num = idx;
                    }
                });
               
                ObjNameList2 = ObjNameList2[num].slice(3, ObjNameList2[num].length);
                if(ObjNameList2.indexOf('(')!==-1){
                    ObjNameList2 =ObjNameList2.slice(ObjNameList2.indexOf('(') + 1, -1)
                    ObjNameList2 = ObjNameList2.split('+');
                }else{
                    ObjNameList2 = ObjNameList2.split(';');
                }
                let ObjUniqIDList1 =[];
                if(ObjUniqIDList[num].indexOf('+')!==-1){
                     ObjUniqIDList1 = ObjUniqIDList[num].split('+');
                }else{
                    ObjUniqIDList1 = ObjUniqIDList[num].split(';');
                }
                // console.log(num);
                // console.log(ObjUniqIDList1);
                let ObjNameList3 = [];
                ObjNameList2.map((item, idx) => {
                        ObjNameList3.push([item, ObjUniqIDList1[idx]]);
                })
                ObjUniqID = ObjUniqIDList[num].split(',')[0];
                let ObjNameList1 = ['学生阅读详情', ObjUniqID];
                ObjNameList1.push(ObjNameList3);
                echartsLeftList.push(ObjNameList1);
            }
            if (ObjNameList.indexOf('家长') !== -1) {
                let ObjNameList2 = ObjNameList.split('$');
                let num = '';
                ObjNameList2.map((item, idx) => {
                    if (item.indexOf('家长') !== -1) {
                        num = idx;
                    }
                });
               
                ObjNameList2 = ObjNameList2[num].slice(3, ObjNameList2[num].length);
                if(ObjNameList2.indexOf('(')!==-1){
                    ObjNameList2 =ObjNameList2.slice(ObjNameList2.indexOf('(') + 1, -1)
                    ObjNameList2 = ObjNameList2.split('+');
                }else{
                    ObjNameList2 = ObjNameList2.split(';');
                }
                let ObjUniqIDList1 =[];
                if(ObjUniqIDList[num].indexOf('+')!==-1){
                     ObjUniqIDList1 = ObjUniqIDList[num].split('+');
                }else{
                    ObjUniqIDList1 = ObjUniqIDList[num].split(';');
                }
                // console.log(num);
                // console.log(ObjUniqIDList1);
                let ObjNameList3 = [];
                ObjNameList2.map((item, idx) => {
                        ObjNameList3.push([item, ObjUniqIDList1[idx]]);
                })
                ObjUniqID = ObjUniqIDList[num].split(',')[0];
                let ObjNameList1 = ['家长阅读详情', ObjUniqID];
                ObjNameList1.push(ObjNameList3);
                echartsLeftList.push(ObjNameList1);
            }
        } 
        // console.log(ObjNameList,ObjId);
        this.setState({
            visible: true,
            NoticeID: NoticeID,
            echartsLeftList: echartsLeftList,

        })
        getData('PublicInfo/Notice/PublishedNoticeMgr/ReadDetailsOverview', {
            UserID: sessionStorage.getItem('UserID'),
            UserType: sessionStorage.getItem('UserType'),
            NoticeID: NoticeID,
        }).then((res) => {
            return res.json()
        }).then((json) => {
            if(json.StatusCode===200){
                let UnReadCount = 0;
                console.log(json);
                json.Data.Item.map((item) => {
                    UnReadCount += item.UnReadCount * 1;
    
                })
                this.setState({
                    UnReadCount: UnReadCount,
                })
            }
          
        })
       
    }
    gotoPusNoticeContent(id){
        let url=window.location.href.split('?')[0]+'#/PusNoticeContent?lg_tk='+sessionStorage.getItem('token')+'&NoticeID='+id;
        window.open(url,'_blank')
    }
    hideModal = () => {
        this.setState({
            visible: false,
        });
    };
   
    render() {

        let { NoticeList, Total } = this.props;
        if (NoticeList && NoticeList.length > 0) {
            NoticeList.map((item, idx) => {
                let ObjNameList = item.ObjNameList;
                ObjNameList = ObjNameList.replace(/\|/g, '，');
                ObjNameList = ObjNameList.replace(/\+/g, '、');
                ObjNameList = ObjNameList.replace(/\;/g, '、');
                ObjNameList = ObjNameList.split('$');
                let ObjNameList2 = [];
                ObjNameList.map((item) => {
                    if (item.indexOf('全部') > -1) {
                        let sliceLength = '';
                        if (item.indexOf('(') == -1) {
                            sliceLength = item.length;
                        } else {
                            sliceLength = item.indexOf('(')
                        }
                        ObjNameList2.push(item.slice(0, sliceLength));
                    } else {
                        ObjNameList2.push(item);
                    }

                })
                NoticeList[idx].ObjNameList1 = ObjNameList2.join('；');
            })
        }


        // const { TopVisit,OnlineUsers,SuspiciousLogin,OnlineDiskUsed,GroupFileSpaceUsed } = HeaderSetting;

        // let onlineNum = OnlineDiskUsed?parseInt(OnlineDiskUsed.split('/')[0]):0;

        // let onlineDiskInfo = this.diskSize(onlineNum);

        // let groupNum = GroupFileSpaceUsed?parseInt(GroupFileSpaceUsed.split('/')[0]):0;

        // let groupInfo = this.diskSize(groupNum);

        return (

            <div className="Noticeissued-all">
                <div className="Noticeissued-head">
                    <span><i></i>已发通知</span>
                    <Search getChildrenMsg={this.props.getChildrenMsg}></Search>
                </div>
                <p className='Noticeissued-border'></p>


                {NoticeList && NoticeList.length > 0 ? <table>
                    <thead>
                        <tr><th width="321" >标题</th>
                            <th width="139">发布对象</th>
                            <th width="149" >发布时间</th>
                            <th width="150">生效时间</th>
                            <th width="86">已读/未读</th>
                            <th width="27"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {NoticeList && NoticeList.map((item, idx) => {
                            return <tr key={idx} onClick={()=>{this.gotoPusNoticeContent(item.NoticeID)}}>
                                <td title={item.NoticeTitle}><i></i>{item.NoticeTitle.length > 20 ? item.NoticeTitle.slice(0, 19) + '..' : item.NoticeTitle}</td>
                                <td title={item.ObjNameList1}>{item.ObjNameList1.length > 8 ? item.ObjNameList1.slice(0, 7) + '..' : item.ObjNameList1}</td>
                                <td>{item.PublishTime.slice(0, -3)}</td>
                                <td>{item.EffectTime.slice(0, -3)}</td>
                                <td className='notice-details'>{item.AlreadyReadCount}/{item.UnReadCount} <i onClick={(e) => { this.openEcheats(e,item.NoticeID, item.ObjNameList, item.PublisherIdentity, item.ObjUniqIDList) }} ></i></td>
                                <td></td>
                            </tr>
                        })
                        }

                    </tbody>
                </table> : <div className='notice-null'>
                        <img src={require('./images/占位图-搜索未果.png')} />
                        <p>很抱歉，没有搜索到您要查找的通知~</p>
                    </div>}
                        

                <Pagination className="notice-ant-Pagination" showQuickJumper hideOnSinglePage={true} pageSize={10} defaultCurrent={this.props.PageIndex} total={Total} onChange={this.onChangePage} />
                <ReadNoticeInfo visible={this.state.visible} noticeID={this.state.NoticeID} hideModal={this.hideModal} echartsLeftList={this.state.echartsLeftList} UnReadCount={this.state.UnReadCount}   ></ReadNoticeInfo>
            </div>
        )

    }

}

export default Noticeissued;