import React, { Component } from 'react';
// import UEditor2 from './UEditor2';
import UEditor from './UEditor';
import Footer from '../../common/compont/Footer';
import Header from '../../common/compont/Header';
import Search from '../../common/compont/Search';
import { getData, postData, getQueryVariable } from '../../common/js/fetch';
import { Pagination, Modal, message,Spin } from 'antd';
import './scss/NoticeTemplate.scss';
// import './scss/index.scss';
class NoticeTemplate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            TemplateList: [],
            TemplatePageIndex: 1,
            TemplateTotal: 0,
            visible: false,
            visible1: false,
            visible2: false,
            NoticeID: '',
            echartsLeftList: [],
            TemplateContent: '',
            TemplateTitle: '',
            TitleKeyword:'',
            isloading:true,
        }
        this.changeTemplate = this.changeTemplate.bind(this);
    }
    addTemplate() {
        this.setState({
            visible2: true,
            TemplateTitle: '',
        })
        sessionStorage.setItem('editor','editor2');
    }
    changeTemplate(id) {
        let _this = this;
        getData('PublicInfo/Notice/TemplateMgr/GetTemplateContent', {
            UserID: sessionStorage.getItem('UserID'),
            UserType: sessionStorage.getItem('UserType'),
            TemplateID: id,
        }).then((res) => {
            return res.json()
        }).then((json) => {
            if (json.StatusCode === 200) {
                if (json.Data.BackCode === 1) {
                    _this.setState({
                        TemplateContent: json.Data.Item.NoticeTemplate.TemplateContent,
                        TemplateTitle: json.Data.Item.NoticeTemplate.TemplateTitle,
                        TemplateID: id,
                        visible1: true,
                    })
                    sessionStorage.setItem('editor','editor1');
                }


            }

        })
    }

    previewTemplate(id) {
        let _this = this;
        getData('PublicInfo/Notice/TemplateMgr/GetTemplateContent', {
            UserID: sessionStorage.getItem('UserID'),
            UserType: sessionStorage.getItem('UserType'),
            TemplateID: id,
        }).then((res) => {
            return res.json()
        }).then((json) => {
            if (json.StatusCode === 200) {
                if (json.Data.BackCode === 1) {
                    _this.setState({
                        TemplateContent: json.Data.Item.NoticeTemplate.TemplateContent,
                        visible: true,
                    })
                }
            }

        })
    }
    delTemplate(id) {
        let _this = this;
        getData('PublicInfo/Notice/TemplateMgr/DeleteTemplate', {
            UserID: sessionStorage.getItem('UserID'),
            UserType: sessionStorage.getItem('UserType'),
            TemplateID: id,
        }).then((res) => {
            return res.json()
        }).then((json) => {
            if (json.StatusCode === 200) {
                if (json.Data.BackCode === 1) {
                    message.success('删除模板成功', 3);
                    let page = '';
                    if (_this.state.TemplateList.length === 1 && _this.state.TemplatePageIndex > 1) {
                        page = _this.state.TemplatePageIndex - 1;
                    } else {
                        page = _this.state.TemplatePageIndex
                    }
                    _this.TemplategetChildrenPageIndex(page);
                }


            }

        })

    }
    handleCancel = () => {
        this.setState({
            visible: false
        })
    }
    handleCancel1 = () => {
        this.setState({
            visible1: false
        })
    }
    handleCancel2 = () => {
        this.setState({
            visible2: false
        })
    }

    TemplategetChildrenPageIndex = (PageIndex) => {

        // const hide = message.loading('正在加载..', 0);
        this.setState({
            TemplatePageIndex: PageIndex
        }, function () {
            // hide();
            getData('PublicInfo/Notice/TemplateMgr/GetTemplateList', {
                UserID: sessionStorage.getItem('UserID'),
                UserType: sessionStorage.getItem('UserType'),
                PageIndex: this.state.TemplatePageIndex,
                TitleKeyword:encodeURIComponent(this.state.TitleKeyword),
                PageSize: 10,
            }).then((res) => {
                return res.json()
            }).then((json) => {
                if (json.Data) {
                    let data = json.Data.Item.TemplateList
                    this.setState({
                        TemplateList: data,
                        TemplateTotal: json.Data.Item.Total,
                        isloading:false,
                    })

                }

            })
        })
    }
    handleOk1(data) {
        let $this = this;
        let TemplateContent = '';
        let TemplateID = '';
        if (!data) {
            TemplateContent = window.UE.getEditor('editor2').getContent();
        } else {
            TemplateContent = window.UE.getEditor('editor1').getContent();
            TemplateID = $this.state.TemplateID;
        }
        postData('PublicInfo/Notice/TemplateMgr/SaveTemplate', {
            UserID: sessionStorage.getItem('UserID'),
            UserType: sessionStorage.getItem('UserType'),
            TemplateID: TemplateID,
            TemplateTitle: $this.state.TemplateTitle,
            TemplateContent: TemplateContent,
        }).then((res) => {
            return res.json();
        }).then(json => {
            if (json.StatusCode === 200 && json.Data.BackCode === 1) {
                message.success('模板保存成功');
                getData('PublicInfo/Notice/TemplateMgr/GetTemplateList', {
                    UserID: sessionStorage.getItem('UserID'),
                    UserType: sessionStorage.getItem('UserType'),
                    PageIndex: 1,
                    PageSize: 10,
                    TitleKeyword:'',
                }).then((res) => {
                    return res.json()
                }).then((json) => {
                    if (json.Data) {
                        // console.log(json.Data.Item.Total);
                        let data = json.Data.Item.TemplateList;
                        $this.setState({
                            TemplateList: data,
                            TemplateTotal: json.Data.Item.Total,
                            TemplatePageIndex: 1,
                        })

                    }

                })
                $this.setState({
                    visible1: false,
                    visible2: false,
                })
            } else {
                message.error(json.Msg);
            }
        })
    }
    changeTemplateTitle(e) {
        this.setState({
            TemplateTitle: e.target.value
        })

    }
    componentDidMount() {
        this.TemplategetChildrenPageIndex(1);
    }
    TemplategetChildrenMsg = (result, msg) => {
        // console.log(result, msg)
        // 很奇怪这里的result就是子组件那bind的第一个参数this，msg是第二个参数
        this.setState({
            Keyword: msg
        }, function () {
            // const hide = message.loading('正在加载..', 0);
            // Dismiss manually and asynchronously
            getData('PublicInfo/Notice/TemplateMgr/GetTemplateList', {
                UserID: sessionStorage.getItem('UserID'),
                UserType: sessionStorage.getItem('UserType'),
                PageIndex:1,
                PageSize: 10,
                TitleKeyword: encodeURIComponent(msg),
            }).then((res) => {
                return res.json()
            }).then((json) => {
                // hide();
                if (json.Data) {
                    let data = json.Data.Item.TemplateList
                    this.setState({
                        TemplateList: data,
                        TemplateTotal: json.Data.Item.Total,
                        TemplatePageIndex:1,
                        TitleKeyword:msg,
                    })
                }
            })
        })
    }
    render() {


        function showhtml(htmlString) {
            var html = { __html: htmlString };
            return <div className="Template-content notice-contect clearfix" dangerouslySetInnerHTML={html}></div>;
        }

        return (
            <div>{this.state.isloading?<div style={{padding:'300px 0',textAlign:'center'}}> <Spin   size="large" ></Spin> </div>:<div >
                <Header headerStyle={11}></Header>
                <div className='NoticeTemplate-box clearfix'>
                    <div className=" NoticeTemplate-all clearfix ">
                        <div className="NoticeTemplate-head">
                            <span onClick={() => { this.addTemplate() }} className='Template-button'><i></i>添加模板</span>
                            <Search getChildrenMsg={this.TemplategetChildrenMsg} placeholderText='输入模板标题进行搜索' width='320'></Search>
                        </div>
                        <div className='NoticeTemplate-main'>
                            <p className='Template-border'></p>
                            <div>
                                {this.state.TemplateList && this.state.TemplateList.length > 0 ? <table className='Template-table'>
                                    <thead>
                                        <tr><th width="321" >标题</th>
                                            <th width="139">修改时间</th>
                                            <th width="149" >操作</th>
                                        </tr>
                                    </thead>
                                    <tbody className='NoticeTemplate-tbody'>
                                        {this.state.TemplateList && this.state.TemplateList.map((item, idx) => {
                                            return <tr key={idx}>
                                                <td title={item.TemplateTitle.length > 40 ? item.TemplateTitle : ''}><i></i><span onClick={() => { this.previewTemplate(item.TemplateID) }}>{item.TemplateTitle.length > 40 ? item.TemplateTitle.slice(0, 38) + '..' : item.TemplateTitle}</span></td>
                                                <td >{item.EditTime.slice(0, -3)}</td>
                                                <td className='button-td'> <i onClick={() => { this.changeTemplate(item.TemplateID) }}>编辑</i><i onClick={() => { this.delTemplate(item.TemplateID) }}>删除</i> </td>
                                            </tr>
                                        })
                                        }
                                    </tbody>
                                </table> : <div className='notice-null'>
                                <i className='null-img'></i>   
                                        <p>您的模板库，暂时没有模板，快去添加吧~</p>
                                    </div>}
                            </div>
                        </div>
                        <Pagination className="notice-ant-Pagination" showQuickJumper hideOnSinglePage={true} pageSize={10} defaultCurrent={1} current={this.state.TemplatePageIndex} total={this.state.TemplateTotal} onChange={this.TemplategetChildrenPageIndex} />
                        <Modal
                            className='showhtml-Template'
                            title="预览模板"
                            visible={this.state.visible}
                            onOk={this.handleOk}
                            onCancel={this.handleCancel}
                            footer={null}
                            width='1166px'
                            destroyOnClose={true}
                            centered={true}
                        >
                            {showhtml(this.state.TemplateContent)}
                        </Modal>
                        <Modal
                            title="编辑模板"
                            visible={this.state.visible1}
                            onOk={() => { this.handleOk1(this.state.TemplateID) }}
                            onCancel={this.handleCancel1}
                            okText="保存"
                            cancelText="取消"
                            width='960px'
                            destroyOnClose={true}
                            centered={true}
                        >
                            <label className='Template-title-label'><span className="notice-create-span Template-title-span ">标题:</span> <input maxLength='50' className="notice-create-title " placeholder="请输入通知标题" value={this.state.TemplateTitle} onChange={(e) => { this.changeTemplateTitle(e) }} /><b className="notice-title-length" >{this.state.TemplateTitle.length}/50</b></label>
                            <br></br>
                            <span className='ueditor-span'> 内容:</span>
                            <UEditor initData={this.state.TemplateContent} id='editor1'></UEditor>
                        </Modal>
                        <Modal
                            title="添加模板"
                            visible={this.state.visible2}
                            onOk={() => { this.handleOk1('') }}
                            onCancel={this.handleCancel2}
                            okText="保存"
                            cancelText="取消"
                            width='960px'
                            centered={true}
                        >
                            <label className='Template-title-label'><span className="notice-create-span Template-title-span ">标题:</span> <input maxLength='50' className="notice-create-title" placeholder="请输入通知标题" value={this.state.TemplateTitle} onChange={(e) => { this.changeTemplateTitle(e) }} /><b className="notice-title-length" >{this.state.TemplateTitle.length}/50</b></label>
                            <br></br>
                            <span  className='ueditor-span'> 内容:</span>
                            <UEditor id='editor2'></UEditor>
                        </Modal>
                    </div>
                </div>
                <Footer></Footer>

            </div>}
            </div>
        )

    }

}

export default NoticeTemplate;