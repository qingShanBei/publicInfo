import React, { Component } from 'react';
import { Modal, Pagination, message } from 'antd';

import './scss/ReadNoticeInfo.scss';
import { getData } from "../common/js/fetch";
import $ from 'jquery';


import echarts from 'echarts/lib/echarts';

// 引入柱状图

import 'echarts/lib/chart/pie';

// 引入提示框和标题组件

import 'echarts/lib/component/tooltip';

import 'echarts/lib/component/title';

import 'echarts/lib/component/legend';

// import echarts from 'echarts/lib/echarts';
class ReadNoticeInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            noticeID: this.props.noticeID,
            echartsLeftList: this.props.echartsLeftList,
            echartsRightList: [],
            echartsRightListChoose: 0,
            echartsRightLiChoose: 0,
            style: { height: '400px' },
            typeList: [],
            NameList: [],
            rightChoose: '',
            Total: 0,
            IsRead: 0,

        }
        this.showEcharts = this.showEcharts.bind(this);
        this.chooseEchartsRightLi = this.chooseEchartsRightLi.bind(this);
        this.onChangePage = this.onChangePage.bind(this);
        this.SendReadRemind = this.SendReadRemind.bind(this);

    }
    chooseEchartsRightLi(num) {
        if (num !== this.state.echartsRightLiChoose) {
            this.setState(
                {
                    echartsRightLiChoose: num,
                }
            )
        }
        if (this.state.id === 0) {
            let _this = this;
            // console.log(num, this.state.typeList);
            var myChart = echarts.init(document.getElementById('main11'));
            let UnReadCount = 0;
            let ReadCount = 0;
            if (num === 0) {

                this.state.typeList.map((item) => {
                    UnReadCount += item.UnReadCount;
                    ReadCount += item.AlreadyReadCount;
                })

            } else {
                UnReadCount = this.state.typeList[num - 1].AlreadyReadCount;
                ReadCount = this.state.typeList[num - 1].UnReadCount;
            }
            let borderWidth = 2;
            if (UnReadCount === 0 || ReadCount === 0) {
                borderWidth = 0;
            }
            var option = {
                title: {
                    text: this.state.echartsRightList[num][0] + '阅读概况',
                    textStyle: {
                        fontWeight: 'normal',
                        color: '#333',
                    },
                    left: 'center',
                    top: '10%',
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} ({d}%)"
                },
                legend: {
                    type: 'plain',
                    orient: 'horizontal',
                    bottom: '10%',
                    right: 'center',
                    data: ['已读人数: ' + ReadCount, '未读人数：' + UnReadCount],
                    itemGap: 27,
                },

                series: [
                    {
                        name: this.state.echartsRightList[num][0],
                        type: 'pie',
                        radius: ['50%', '15%'],

                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: false,
                                position: 'center'
                            },
                            emphasis: {
                                show: false,
                                textStyle: {
                                    fontSize: '16',
                                    fontWeight: 'bold'
                                }
                            }
                        },
                        itemStyle: {

                            emphasis: {
                                shadowBlur: 0,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            },
                            normal: {
                                borderWidth: borderWidth,
                                borderColor: '#fff',
                                color: function (params) {
                                    //自定义颜色
                                    var colorList = [
                                        '#42cfff', '#fb3737', '#FFFF00', '#FF8C00', '#FF0000', '#FE8463',
                                    ];
                                    return colorList[params.dataIndex]
                                }
                                // color: ['#fb3737', '#42cfff'],
                                // color: new echarts.graphic.LinearGradient(
                                //     0, 0, 0, 1,
                                //     //   [
                                //     //      {offset: 0, color: '#ffa800'},
                                //     //       {offset: 1, color: '#fb3737'},

                                //     //   ],
                                //     [
                                //         { offset: 0, color: '#7c7cfc' },
                                //         { offset: 1, color: '#42cfff' }
                                //     ])
                            }
                        },
                        labelLine: {
                            normal: {
                                show: true
                            }
                        },
                        data: [

                            { value: ReadCount, name: '已读人数: ' + ReadCount },
                            { value: UnReadCount, name: '未读人数：' + UnReadCount }
                        ]
                    }
                ]
            };
            myChart.setOption(option);
        } else {
            let _this = this;
            getData('PublicInfo/Notice/PublishedNoticeMgr/GetNameList', {
                UserID: sessionStorage.getItem('UserID'),
                UserType: sessionStorage.getItem('UserType'),
                NoticeID: this.props.noticeID,
                ObjUniqID: this.state.id,
                IsRead: num,
                PageIndex: 1,
                PageSize: 18,
            }).then((res) => {
                return res.json()
            }).then((json) => {
                _this.setState({
                    NameList: json.Data.Item.NameList,
                    Total: json.Data.Item.Total,
                    IsRead: num,
                    style: {
                        height: '0px',
                        display: 'none'
                    },
                })

                // let echartsRightList = [['全部',0]];
                // json.Data.Item.map((item) => {
                //     echartsRightList.push([item.ObjName,item.objId]);
                // })



            })
        }
    }
    showEcharts(e, id, rightChoose) {
        if (id === this.state.id || e.currentTarget.className === 'echarts-left-li1') {
            return
        } else {
            this.setState({
                id: id
            })
        }
        let _this = this;
        var myChart = echarts.init(document.getElementById('main11'));
        if (e.target.className === 'echarts-left-li1 echarts-left-li11' || e.target.className === 'echarts-left-li2') {
            $('.echarts-left-li-hover').attr('class', 'echarts-left-li1');
            if ($('.echarts-left-li-active').attr('class') === 'echarts-left-li1 echarts-left-li11 echarts-left-li-active') {
                $('.echarts-left-li-active').attr('class', 'echarts-left-li1 echarts-left-li11');

            } else {
                $('.echarts-left-li-active').attr('class', 'echarts-left-li2');
            }
            if (e.target.className === 'echarts-left-li1 echarts-left-li11') {
                e.target.className = 'echarts-left-li1 echarts-left-li11 echarts-left-li-active';
            } else {
                e.target.className = 'echarts-left-li2 echarts-left-li-active';
                $('.echarts-left-li-active').parent().parent().attr('class', 'echarts-left-li1 echarts-left-li-hover');
            }


            //    if( $('.echarts-left-li-active').attr('class')==='echarts-left-li1 echarts-left-li11 echarts-left-li-active'){
            //     $('.echarts-left-li-active').attr('class', 'echarts-left-li1 echarts-left-li11' );
            //    }else if( $('.echarts-left-li-active').attr('class')==='echarts-left-li2  echarts-left-li-active'){
            //         $('.echarts-left-li-active').attr('class', 'echarts-left-li2' );  
            //    }
            //    if(e.target.className =='echarts-left-li2'){
            //     e.target.className ='echarts-left-li2 echarts-left-li-active';
            //    }else{
            //     e.target.className ='echarts-left-li1 echarts-left-li11 echarts-left-li-active';
            //    }

            if (id === 0) {
                getData('PublicInfo/Notice/PublishedNoticeMgr/ReadDetailsOverview', {
                    UserID: sessionStorage.getItem('UserID'),
                    UserType: sessionStorage.getItem('UserType'),
                    NoticeID: this.props.noticeID,
                }).then((res) => {
                    return res.json()
                }).then((json) => {
                    let echartsRightList =[];
                    if(json.Data.Item.length>1){
                         echartsRightList = [['全部', 0]];
                    }
                    json.Data.Item.map((item, idx) => {
                        echartsRightList.push([item.ObjName, idx]);
                    })

                    let UnReadCount = 0;
                    let ReadCount = 0;
                    json.Data.Item.map((item) => {
                        ReadCount += item.AlreadyReadCount * 1;
                        UnReadCount += item.UnReadCount * 1;

                    })
                    _this.setState({
                        typeList: json.Data.Item,
                        echartsRightList: echartsRightList,
                        style: { height: '400px' },
                        echartsRightLiChoose: 0,
                      
                    })
                    let borderWidth = 2;
                    if (UnReadCount === 0 || ReadCount === 0) {
                        borderWidth = 0;
                    }
                    var option = {
                        title: {
                            text: '全部用户阅读概况',
                            textStyle: {
                                fontWeight: 'normal',
                                color: '#333',
                            },
                            left: 'center',
                            top: '10%',
                        },
                        tooltip: {
                            trigger: 'item',
                            formatter: "{a} <br/> {b} ({d}%)"
                        },
                        legend: {
                            type: 'plain',
                            orient: 'horizontal',
                            bottom: '10%',
                            right: 'center',
                            data: ['已读人数: ' + ReadCount, '未读人数：' + UnReadCount],
                            itemGap: 27,
                        },

                        series: [
                            {
                                name: '总览',
                                type: 'pie',
                                radius: ['50%', '15%'],

                                avoidLabelOverlap: false,
                                label: {
                                    normal: {
                                        show: false,
                                        position: 'center'
                                    },
                                    emphasis: {
                                        show: false,
                                        textStyle: {
                                            fontSize: '16',
                                            fontWeight: 'bold'
                                        }
                                    }
                                },
                                itemStyle: {

                                    emphasis: {
                                        shadowBlur: 0,
                                        shadowOffsetX: 0,
                                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                                    },
                                    normal: {
                                        borderWidth: borderWidth,
                                        borderColor: '#fff',
                                        color: function (params) {
                                            //自定义颜色
                                            var colorList = [
                                                '#42cfff', '#fb3737', '#FFFF00', '#FF8C00', '#FF0000', '#FE8463',
                                            ];
                                            return colorList[params.dataIndex]
                                        }
                                        // color: ['#fb3737', '#42cfff'],
                                        // color: new echarts.graphic.LinearGradient(
                                        //     0, 0, 0, 1,
                                        //     //   [
                                        //     //      {offset: 0, color: '#ffa800'},
                                        //     //       {offset: 1, color: '#fb3737'},

                                        //     //   ],
                                        //     [
                                        //         { offset: 0, color: '#7c7cfc' },
                                        //         { offset: 1, color: '#42cfff' }
                                        //     ])
                                    }
                                },
                                labelLine: {
                                    normal: {
                                        show: true
                                    }
                                },
                                data: [

                                    { value: ReadCount, name: '已读人数: ' + ReadCount },
                                    { value: UnReadCount, name: '未读人数：' + UnReadCount }
                                ]
                            }
                        ]
                    };
                    myChart.setOption(option);

                })
            } else {
                if (rightChoose.indexOf('阅读详情') !== -1) {
                    rightChoose = rightChoose.slice(0, -4);
                }
                let _this = this;
                getData('PublicInfo/Notice/PublishedNoticeMgr/GetUserGroupReadCount', {
                    UserID: sessionStorage.getItem('UserID'),
                    UserType: sessionStorage.getItem('UserType'),
                    NoticeID: this.props.noticeID,
                    ObjUniqID: id,
                }).then((res) => {
                    return res.json()
                }).then((json) => {
                    // console.log(json);
                    let AlreadyReadCount = json.Data.Item.AlreadyReadCount;
                    let UnReadCount = json.Data.Item.UnReadCount;
                    let echartsRightList = [['未读(' + UnReadCount + ')', 0], ['已读(' + AlreadyReadCount + ')', 1]];

                    getData('PublicInfo/Notice/PublishedNoticeMgr/GetNameList', {
                        UserID: sessionStorage.getItem('UserID'),
                        UserType: sessionStorage.getItem('UserType'),
                        NoticeID: this.props.noticeID,
                        ObjUniqID: id,
                        IsRead: 0,
                        PageIndex: 1,
                        PageSize: 18,
                    }).then((res) => {
                        return res.json()
                    }).then((json) => {
                        _this.setState({
                            echartsRightList: echartsRightList,
                            NameList: json.Data.Item.NameList,
                            rightChoose: rightChoose,
                            Total: json.Data.Item.Total,
                            id: id,
                            style: {
                                height: '0px',
                                display: 'none'
                            },
                            echartsRightLiChoose: 0,

                        })

                        // let echartsRightList = [['全部',0]];
                        // json.Data.Item.map((item) => {
                        //     echartsRightList.push([item.ObjName,item.objId]);
                        // })



                    })
                    // let echartsRightList = [['全部',0]];
                    // json.Data.Item.map((item) => {
                    //     echartsRightList.push([item.ObjName,item.objId]);
                    // })



                })
            }
        }
    }
    onChangePage(page) {
        let _this = this;
        getData('PublicInfo/Notice/PublishedNoticeMgr/GetNameList', {
            UserID: sessionStorage.getItem('UserID'),
            UserType: sessionStorage.getItem('UserType'),
            NoticeID: this.props.noticeID,
            ObjUniqID: this.state.id,
            IsRead: this.state.IsRead,
            PageIndex: page,
            PageSize: 18,
        }).then((res) => {
            return res.json()
        }).then((json) => {
            _this.setState({
                NameList: json.Data.Item.NameList,
                Total: json.Data.Item.Total,
                style: {
                    height: '0px',
                    display: 'none'
                },
            })

            // let echartsRightList = [['全部',0]];
            // json.Data.Item.map((item) => {
            //     echartsRightList.push([item.ObjName,item.objId]);
            // })



        })
    }
    SendReadRemind() {
        let _this = this;
        getData('PublicInfo/Notice/PublishedNoticeMgr/SendReadRemind', {
            UserID: sessionStorage.getItem('UserID'),
            UserType: sessionStorage.getItem('UserType'),
            NoticeID: this.props.noticeID,
        }).then((res) => {
            return res.json()
        }).then((json) => {
            if (json.StatusCode == 200) {
                message.success('发送提醒成功', 3);
            }

            // let echartsRightList = [['全部',0]];
            // json.Data.Item.map((item) => {
            //     echartsRightList.push([item.ObjName,item.objId]);
            // })



        })
    }
    render() {
        // console.log(this.props.echartsLeftList)
        return (

            <div className='clearfix'>

                <Modal
                    title="阅读详情"
                    visible={this.props.visible}
                    onOk={this.SendReadRemind}
                    onCancel={this.props.hideModal}
                    okText="发布提醒"
                    cancelText="取消"
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                    
                    centered
                    width='870px'
                >
                    <div className='echarts-left'>

                        {this.props.echartsLeftList.length > 0 ? <ul>
                            {this.props.echartsLeftList.map((item, idx) => {
                                return <li key={idx} name={item[1]} className={item.length <= 2 ? 'echarts-left-li1 echarts-left-li11' : 'echarts-left-li1'} onClick={(e) => { this.showEcharts(e, item[1], item[0]) }} ><i></i>{item[0]}{item.length > 2 ? <ul className='clearfix'>
                                    {item[2].map((it, id) => {
                                        return <li key={id} name={it[1]} className='echarts-left-li2' onClick={(e) => { this.showEcharts(e, it[1], it[0]) }} ><i></i>{it[0]}</li>
                                    })}
                                </ul> : ''}</li>
                            })}
                        </ul> : ''}
                    </div> <div className='echarts-right'>{this.state.echartsRightList.length > 1 ? <ul className='echarts-right-ul'>
                        {this.state.echartsRightList.map((item, idx) => {
                            return <li onClick={() => { this.chooseEchartsRightLi(idx) }} className={idx === this.state.echartsRightLiChoose ? 'echarts-right-li echarts-right-li-active' : 'echarts-right-li echarts-right-li-unActive'} key={item[0]}>{item[0]}</li>
                        })}
                    </ul> : ''}<div id='main11' style={this.state.style} ></div>{this.state.id !== 0 && this.state.style.display === 'none' ? <div className='right-people-list'><span><b>{this.state.rightChoose}</b>阅读详情</span><ul className='right-people-ul clearfix'>

                        {this.state.NameList.length > 0 && this.state.NameList.map((item, idx) => {
                            return <li key={idx}><i style={{ backgroundImage: 'url(' + item.photoPath + ')' }} ></i><p>{item.userName}<b>[{item.userID}]</b></p></li>
                        })}
                    </ul><Pagination className="echarts-ant-Pagination" showQuickJumper hideOnSinglePage={true} pageSize={18} defaultCurrent={1} total={this.state.Total} onChange={this.onChangePage} /></div> : ''}</div>
                    <div className='echarts-height'>
                    </div>
                    {this.props.UnReadCount > 0 ? <div className='echarts-bottom'>有<b>{this.props.UnReadCount}</b>人未读，是否发送提醒？</div> : ''}
                </Modal>
            </div>
        )

    }

}

export default ReadNoticeInfo;