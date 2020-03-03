import React, { Component } from 'react';
import { Modal, Pagination, message } from 'antd';

import './scss/ReadNoticeInfo.scss';
import { getData } from '../../common/js/fetch';
import $ from 'jquery';


import echarts from 'echarts/lib/echarts';

// 引入柱状图

import 'echarts/lib/chart/pie';

// 引入提示框和标题组件

import 'echarts/lib/component/tooltip';

import 'echarts/lib/component/title';

import 'echarts/lib/component/legend';
import { clear } from 'echarts/lib/util/throttle';
let readtimer = null;
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
            echartsOpen: true,
            timing: '',
            h: '11',
            f: '59',
            m: '59',
            PageIndex:1,

        }
        this.showEcharts = this.showEcharts.bind(this);
        this.chooseEchartsRightLi = this.chooseEchartsRightLi.bind(this);
        this.onChangePage = this.onChangePage.bind(this);
        this.SendReadRemind = this.SendReadRemind.bind(this);
        this.hideModal = this.hideModal.bind(this);
        

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
                ReadCount = this.state.typeList[num - 1].AlreadyReadCount;
                UnReadCount = this.state.typeList[num - 1].UnReadCount;
            }
            let borderWidth = 2;
            if (UnReadCount === 0 || ReadCount === 0) {
                borderWidth = 0;
            }
            let newData = this.getcolor(ReadCount, UnReadCount);
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
                        radius: ['15%', '45%'],

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

                            }
                        },
                        labelLine: {
                            normal: {
                                show: true
                            }
                        },
                        data: newData
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
                let NameList = json.Data.Item.NameList;
                _this.setState({
                    NameList: NameList,
                    Total: json.Data.Item.Total,
                    IsRead: num,
                    PageIndex: 1,
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
    getcolor(ReadCount, UnReadCount) {
        var saleAmountTotal = ReadCount;
        var saleAmountTotal2 = UnReadCount;
        const cos = Math.cos;
        const sin = Math.sin;
        const PI = Math.PI;
        // 计算占比
        const d_val_p = saleAmountTotal / (saleAmountTotal + saleAmountTotal2) * 100;
        const i_val_p = saleAmountTotal2 / (saleAmountTotal + saleAmountTotal2) * 100;
        // 计算圆心角
        const d_angle = PI * d_val_p / 50 / 2;
        const i_angle = PI * i_val_p / 50 / 2;
        // 计算渐变起点和终点
        const d_pointStart = [
            0.5 - 0.5 * cos(d_angle) * sin(d_angle),
            0.5 + 0.5 * cos(d_angle) * cos(d_angle)
        ];
        const d_pointEnd = [
            0.5 - 0.5 * sin(d_angle),
            0.5 + 0.5 * cos(d_angle)
        ];
        const i_pointStart = [
            0.5 - 0.5 * cos(i_angle) * sin(i_angle),
            0.5 + 0.5 * cos(i_angle) * cos(i_angle)
        ];
        const i_pointEnd = [
            0.5 - 0.5 * sin(i_angle),
            0.5 + 0.5 * cos(i_angle)
        ];
        // 定义数据
        var data_10000001 = [{
            value: saleAmountTotal,
            name: '已读人数: ' + ReadCount,
            itemStyle: {
                normal: {
                    color: {
                        type: 'linear',
                        x: d_pointStart[0],
                        y: d_pointStart[1],
                        x2: d_pointEnd[0],
                        y2: d_pointEnd[1],
                        colorStops: [
                            // !! 在此添加渐变过程色 !!
                            { offset: 0, color: '#7c7cfc' },
                            { offset: 1, color: '#42cfff' }
                        ]
                    }
                }
            }
        }, {
            value: saleAmountTotal2,
            name: '未读人数：' + UnReadCount,
            itemStyle: {
                normal: {
                    color: {
                        type: 'linear',
                        x: i_pointStart[0],
                        y: i_pointStart[1],
                        x2: i_pointEnd[0],
                        y2: i_pointEnd[1],
                        colorStops: [
                            // !! 在此添加渐变过程色 !!
                            { offset: 0, color: '#ffa800' },
                            { offset: 1, color: '#fb3737' }
                        ]
                    }
                }
            }
        }];
        return data_10000001;
    }
    showEcharts(e, id, rightChoose) {
        // console.log(id);
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
            if (id === 0) {
                getData('PublicInfo/Notice/PublishedNoticeMgr/ReadDetailsOverview', {
                    UserID: sessionStorage.getItem('UserID'),
                    UserType: sessionStorage.getItem('UserType'),
                    NoticeID: this.props.noticeID,
                }).then((res) => {
                    return res.json()
                }).then((json) => {
                    let echartsRightList = [];
                    if (json.Data.ObjRecordCountList.length > 1) {
                        echartsRightList = [['全部', 0]];
                    }
                    json.Data.ObjRecordCountList.map((item, idx) => {
                        echartsRightList.push([item.ObjName, idx]);
                    })

                    let UnReadCount = 0;
                    let ReadCount = 0;
                    json.Data.ObjRecordCountList.map((item) => {
                        ReadCount += item.AlreadyReadCount * 1;
                        UnReadCount += item.UnReadCount * 1;

                    })
                    let typeList = json.Data.ObjRecordCountList;
                    _this.setState({
                        typeList: typeList,
                        echartsRightList: echartsRightList,
                        style: { height: '400px' },
                        echartsRightLiChoose: 0,

                    })
                    let borderWidth = 2;
                    if (UnReadCount === 0 || ReadCount === 0) {
                        borderWidth = 0;
                    }
                    let text = '全部用户阅读概况';
                    if (echartsRightList.length === 1) {
                        text = '全部' + echartsRightList[0][0] + '阅读概况';

                    }
                    let newData = this.getcolor(ReadCount, UnReadCount);
                    var option = {
                        title: {
                            text: text,
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
                                radius: ['15%', '45%'],
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
                                    }
                                },
                                labelLine: {
                                    normal: {
                                        show: true
                                    }
                                },
                                hoverAnimation:true ,
                                data: newData,
                                avoidLabelOverlap: false,
                                legendHoverLink: true,
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
                        let NameList = json.Data.Item.NameList;
                        _this.setState({
                            echartsRightList: echartsRightList,
                            NameList: NameList,
                            PageIndex: 1,
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

    onChangePage1() {
        this.setState({
            echartsOpen: false
        }, function () {
            let timer = setInterval(() => {
                if ($('#main11').length > 0) {
                    clearInterval(timer);
                    let myChart = echarts.init(document.getElementById('main11'));
                    let _this = this;
                    getData('PublicInfo/Notice/PublishedNoticeMgr/ReadDetailsOverview', {
                        UserID: sessionStorage.getItem('UserID'),
                        UserType: sessionStorage.getItem('UserType'),
                        NoticeID: this.props.noticeID,
                    }).then((res) => {
                        return res.json()
                    }).then((json) => {
                        // console.log(json.Data.NowDateTime);
                        // console.log(json.Data.SendRemindTime);
                        // console.log(new  Date());
                        // console.log(Date.parse(json.Data.NowDateTime)- Date.parse(json.Data.SendRemindTime));
                        if (json.Data.SendRemindTime) {
                            let NowDateTime = json.Data.NowDateTime;
                            let SendRemindTime = json.Data.SendRemindTime;
                            let NewDate = new Date();
                            if ((Date.parse(NowDateTime) - Date.parse(SendRemindTime)) < 12 * 60 * 60 * 1000) {
                                let finishTime = 12 * 60 * 60 * 1000 - (Date.parse(NowDateTime) - Date.parse(SendRemindTime)) + Date.parse(NewDate);
                                readtimer = setInterval(() => {
                                    let h = Math.floor((finishTime - Date.parse(new Date())) / 1000 / 60 / 60) + '';
                                    let f = Math.floor((finishTime - Date.parse(new Date())) / 1000 / 60 % 60) + '';
                                    let m = Math.floor((finishTime - Date.parse(new Date())) / 1000 % 60) + '';
                                    //    console.log(h, f ,m) ;
                                    if (h.length < 2) {
                                        h = '0' + h
                                    }
                                    if (f.length < 2) {
                                        f = '0' + f
                                    }
                                    if (m.length < 2) {
                                        m = '0' + m
                                    }
                                    if (finishTime - Date.parse(new Date()) <= 0) {
                                        this.setState({
                                            timimg: '',
                                            h: '00',
                                            f: '00',
                                            m: '00',
                                        })
                                        clearInterval(readtimer);
                                    }
                                    // console.log(this.state.timimg);
                                    this.setState({
                                        timimg: 1,
                                        h: h,
                                        f: f,
                                        m: m,

                                    })
                                }, 1000);
                            } else {
                                this.setState({
                                    timimg: '',
                                    h: '00',
                                    f: '00',
                                    m: '00',
                                })
                            }
                        } else {
                            this.setState({
                                timimg: '',
                                h: '00',
                                f: '00',
                                m: '00',
                            })
                        }

                        //  let 
                        //  var timestamp = Date.parse(new  Date());
                        let echartsRightList = [];
                        if (json.Data.ObjRecordCountList.length > 1) {
                            echartsRightList = [['全部', 0]];
                        }
                        json.Data.ObjRecordCountList.map((item, idx) => {
                            echartsRightList.push([item.ObjName, idx]);
                        })

                        let UnReadCount = 0;
                        let ReadCount = 0;
                        json.Data.ObjRecordCountList.map((item) => {
                            ReadCount += item.AlreadyReadCount * 1;
                            UnReadCount += item.UnReadCount * 1;

                        })
                        let typeList = json.Data.ObjRecordCountList;
                        _this.setState({
                            typeList: typeList,
                            echartsRightList: echartsRightList,
                            style: { height: '400px' },
                            echartsRightLiChoose: 0,
                            id: 0,

                        })

                        let borderWidth = 2;
                        if (UnReadCount === 0 || ReadCount === 0) {
                            borderWidth = 0;
                        }

                        let text = '全部用户阅读概况';
                        if (echartsRightList.length === 1) {
                            text = '全部' + echartsRightList[0][0] + '阅读概况';

                        }
                        let newData = this.getcolor(ReadCount, UnReadCount);
                        var option = {
                            title: {
                                text: text,
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
                                    radius: ['15%', '45%'],
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

                                        }
                                    },
                                    labelLine: {
                                        normal: {
                                            show: true
                                        }
                                    },
                                    hoverAnimation: false,
                                    data: newData,
                                    avoidLabelOverlap: false,
                                    legendHoverLink: false,
                                }
                            ]
                        };

                        myChart.setOption(option);

                    })
                }
            }, 10);
        })

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
                PageIndex: page,
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
                let finishTime = 12 * 60 *60 * 1000 + Date.parse(new Date());
                readtimer = setInterval(() => {
                    let h = Math.floor((finishTime - Date.parse(new Date())) / 1000 / 60 / 60) + '';
                    let f = Math.floor((finishTime - Date.parse(new Date())) / 1000 / 60 % 60) + '';
                    let m = Math.floor((finishTime - Date.parse(new Date())) / 1000 % 60) + '';
                    //    console.log(h, f ,m) ;
                    if (h.length < 2) {
                        h = '0' + h
                    }
                    if (f.length < 2) {
                        f = '0' + f
                    }
                    if (m.length < 2) {
                        m = '0' + m
                    }
                    if (finishTime - Date.parse(new Date()) <= 0) {
                        this.setState({
                            timimg: '',
                            h: '00',
                            f: '00',
                            m: '00',
                        })
                        clearInterval(readtimer);
                    }
                    // console.log(this.state.timimg);
                    this.setState({
                        timimg: 1,
                        h: h,
                        f: f,
                        m: m,

                    })
                }, 1000);
            }
            // let echartsRightList = [['全部',0]];
            // json.Data.Item.map((item) => {
            //     echartsRightList.push([item.ObjName,item.objId]);
            // })



        })
    }
    static getDerivedStateFromProps(props, current_state) {
        // console.log(props.NoticeMain,current_state.NoticeMain )
        if (!props.visible) {
            //    console.log(111111111111);
            let echartsLeftList = [];
            clearInterval(readtimer);
            return {
                echartsLeftList: echartsLeftList,
                echartsOpen: true
            }
        }

        return null
    }
    hideModal(){
        this.props.hideModal();
        this.setState({
            style: { height: '400px' },
            echartsRightLiChoose: 0,
            echartsRightList:[],
            id: 0,
        })
    }
    render() {
        if (this.props.visible && this.state.echartsOpen) {

            this.onChangePage1();
        }
        // console.log(this.props.echartsLeftList)
        return (

            <div className='clearfix'>

                <Modal
                    title="阅读详情"
                    visible={this.props.visible}
                    onOk={this.SendReadRemind}
                    onCancel={this.hideModal}
                    okText="发送提醒"
                    cancelText="取消"
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                    destroyOnClose={true}
                    centered
                    width='870px'
                >
                    <div className='echarts-left' style={this.props.echartsLeftList.length <= 1?{width:'0'}:{}}>

                        {this.props.echartsLeftList.length > 1 ? <ul>
                            {this.props.echartsLeftList.map((item, idx) => {
                                return <li key={idx} name={item[1]} className={idx == 0 ? item.length <= 2 ? 'echarts-left-li1 echarts-left-li11 echarts-left-li-active' : 'echarts-left-li1 echarts-left-li-active' : item.length <= 2 ? 'echarts-left-li1 echarts-left-li11' : 'echarts-left-li1'} onClick={(e) => { this.showEcharts(e, item[1], item[0]) }} ><i></i>{item[0]}{item.length > 2 ? <ul className='clearfix'>
                                    {item[2].map((it, id) => {
                                        return <li key={id} name={it[1]} className='echarts-left-li2' onClick={(e) => { this.showEcharts(e, it[1], it[0]) }} ><i></i>{it[0]}</li>
                                    })}
                                </ul> : ''}</li>
                            })}
                        </ul> : ''}
                    </div> <div className='echarts-right'style={this.props.echartsLeftList.length <= 1?{width:'94.7%'}:{}}>{this.state.echartsRightList.length > 1 ? <ul className='echarts-right-ul'>
                        {this.state.echartsRightList.map((item, idx) => {
                            return <li onClick={() => { this.chooseEchartsRightLi(idx) }} className={idx === this.state.echartsRightLiChoose ? 'echarts-right-li echarts-right-li-active' : 'echarts-right-li echarts-right-li-unActive'} key={item[0]}>{item[0]}</li>
                        })}
                    </ul> : ''}<div id='main11' style={this.state.style} ></div>{this.state.id !== 0 && this.state.style.display === 'none' ? <div className='right-people-list'><span><b>{this.state.rightChoose}</b>阅读详情</span><ul className='right-people-ul clearfix'>

                        {this.state.NameList.length > 0 && this.state.NameList.map((item, idx) => {
                            return <li key={idx}><i style={{ backgroundImage: 'url(' + item.photoPath + ')' }} ></i><p>{item.userName}<b>[{item.userID}]</b></p></li>
                        })}
                    </ul><Pagination className="echarts-ant-Pagination" showQuickJumper hideOnSinglePage={true} pageSize={10} current={this.state.PageIndex} total={this.state.Total} onChange={this.onChangePage} /></div> : ''}</div>
                    <div className='echarts-height'>
                    </div>
                    {this.props.UnReadCount > 0 && this.state.h === '00'&&this.state.f === '00'&&this.state.m === '00' ? <div className='echarts-bottom'>有<b>{this.props.UnReadCount}</b>人未读，是否发送提醒？</div> : <div className='echarts-bottom'><b>{this.state.h}:{this.state.f}:{this.state.m}</b>之后可再次发送提醒</div>}
                    {this.state.h === '00'&&this.state.f === '00'&&this.state.m === '00' ?'':<div className='popup-button'>发送提醒</div>}
                </Modal>
            </div>
        )
    }

}

export default ReadNoticeInfo;