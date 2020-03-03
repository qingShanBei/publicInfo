import React, { Component } from 'react';
import Footer from '../../common/compont/Footer';
import Header from '../../common/compont/Header';
import { getData, getQueryVariable, postData } from '../../common/js/fetch';
import $ from 'jquery';
import { message, Input, Modal } from 'antd';
import './scss/Quemain.scss';
import './scss/AnswerInfo.scss';
import Search from '../../common/compont/Search';
import QueAnswerSearch from './QueAnswerSearch';
class AnswerInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            QtnTopicList: [],
            Total: 0,
            chooseType2: '',
            chooseType1: 'QueAnswer-choose-li',
            NameList: {},
            ServerDate: '',
            isOpen: false,
            isOpen1: false,
            isOpen2: false,
            QtnID: '',
            QtnName: '',
            ExpireDate: '',
            QtnExplanation: '',
            QtnSurveyObjectCount: '',
            RespondentCount: '',
            visible: false,
            messageInfo: '',
            TextAnswerList:[],
            QueSearchli:1,
        }
        this.handleCancel = this.handleCancel.bind(this);
        this.getChildrenMsg = this.getChildrenMsg.bind(this);

    }
    componentDidMount() {
        // sessionStorage.setItem('token', 'D7EA3A5F-DD35-403C-8FE9-A5522F712E81');
        postData('PublicInfo/Que/AnswerStatisticsMgr/GetQtnAnswerStatisticsDetail', {
            UserID: sessionStorage.getItem('UserID'),
            UserType: sessionStorage.getItem('UserType'),
            QtnID: getQueryVariable('QtnID'),
            QueryString: '',
        }).then((res) => {
            return res.json()
        }).then((json) => {
            console.log(json)
            if(json.StatusCode===200&& json.Data.BackCode == 1){
                this.setState({
                    QtnName: json.Data.QtnStatisticsDetail.QtnName,
                    ExpireDate: json.Data.QtnStatisticsDetail.ExpireDate,
                    QtnExplanation: json.Data.QtnStatisticsDetail.QtnExplanation,
                    QtnID: json.Data.QtnStatisticsDetail.QtnID,
                    QtnSurveyObjectCount: json.Data.QtnStatisticsDetail.QtnSurveyObjectCount,
                    RespondentCount: json.Data.QtnStatisticsDetail.RespondentCount,
                    QtnTopicList: json.Data.QtnStatisticsDetail.QtnTopicList,
    
                })
            }else{
                message.error(json.Msg);
            }
            
        })
    }
    chooseType(id, classname) {

        // console.log(classname);
        if (!classname) {
            if (id === 2) {
                this.setState({
                    chooseType1: 'QueAnswer-choose-li',
                    chooseType2: '',
                })
            } else {
                this.setState({
                    chooseType2: 'QueAnswer-choose-li',
                    chooseType1: '',
                })
            }
            // getData('PublicInfo/Que/PersonalQtnMgr/GetQtnList', {
            //     UserID: sessionStorage.getItem('UserID'),
            //     UserType: sessionStorage.getItem('UserType'),
            //     QueryRange: id,
            //     TitleKeyword: '',
            //     PageIndex: 1,
            //     PageSize: 9,
            // }).then((res) => {
            //     return res.json()
            // }).then((json) => {
            //     // console.log(json);
            //     json.Data.QtnList.map((item, idx) => {
            //         json.Data.QtnList[idx].ObjNamestr = this.objectListslice(item.ObjNameList)[0];
            //         json.Data.QtnList[idx].NameList = this.objectListslice(item.ObjNameList)[1];
            //     })
            //     this.setState({
            //         QtnList: json.Data.QtnList,
            //         Total: json.Data.Total,
            //         ServerDate: json.Data.ServerDate
            //     })
            // })
        }
    }
    //作答详情查看
    QueAnswerInfo(id, type, idx) { 
        postData('PublicInfo/Que/AnswerStatisticsMgr/GetTopicTextAnswerDetail', {
            UserID: sessionStorage.getItem('UserID'),
            UserType: sessionStorage.getItem('UserType'),
            QtnID: this.state.QtnID,
            TopicOrOptionID: id,
            QueryType: type,
            TextAnswerKeyword: '',
            QueryString: '',
            PageIndex: 1,
            PageSize: 9,
        }).then((res) => {
            return res.json()
        }).then((json) => {
            this.setState({
                visible: true,
                messageInfo: idx,
                TopicOrOptionID: id,
                QueryType:type,
            })
            console.log(json);

            // json.Data.QtnList.map((item, idx) => {
            //     json.Data.QtnList[idx].ObjNamestr = this.objectListslice(item.ObjNameList)[0];
            //     json.Data.QtnList[idx].NameList = this.objectListslice(item.ObjNameList)[1];
            // })
            this.setState({
                TextAnswerList: json.Data.TextAnswerList,
            })
        })
    }
    //关闭作答详情窗口
    handleCancel() {
        this.setState({
            visible: false
        })
    }
    getChildrenMsg(e,str){
        // console.log(str);
        postData('PublicInfo/Que/AnswerStatisticsMgr/GetTopicTextAnswerDetail', {
            UserID: sessionStorage.getItem('UserID'),
            UserType: sessionStorage.getItem('UserType'),
            QtnID: this.state.QtnID,
            TopicOrOptionID: this.state.TopicOrOptionID,
            QueryType: this.state.QueryType,
            TextAnswerKeyword: encodeURIComponent(str),
            QueryString: '',
            PageIndex: 1,
            PageSize: 9,
        }).then((res) => {
            return res.json()
        }).then((json) => {
            // json.Data.QtnList.map((item, idx) => {
            //     json.Data.QtnList[idx].ObjNamestr = this.objectListslice(item.ObjNameList)[0];
            //     json.Data.QtnList[idx].NameList = this.objectListslice(item.ObjNameList)[1];
            // })
            this.setState({
                TextAnswerList: json.Data.TextAnswerList,
            })
        })
    }

    render() {

        return (

            <div>
                <Header headerStyle={2}></Header>
                <div className="Quemain-div">
                    <div className='QueAnswer'>
                        <span className='QueAnswer-title'>{this.state.QtnName} </span>
                        <div className='QueAnswer-some' >
                            <span>调查对象: <b>{this.state.QtnSurveyObjectCount}人</b>     </span>
                            <span>  已收答卷: <b>{this.state.RespondentCount}份</b>      </span>
                            <span> 参与率: <b>{(this.state.RespondentCount / this.state.QtnSurveyObjectCount * 100).toFixed(2)}%</b>   </span>
                            <span> 截止日期: <b>{this.state.ExpireDate.slice(0, 10)}</b></span>
                        </div>
                        <ul className='QueAnswer-ul'>
                            <li className={this.state.chooseType1} onClick={() => { this.chooseType(2, this.state.chooseType1) }}>全部统计结果</li>
                            <li className={this.state.chooseType2} onClick={() => { this.chooseType(1, this.state.chooseType2) }}>自定义查询</li>
                        </ul>

                        {this.state.chooseType1?<div className='QueAnswer-main'>
                            {this.state.QtnTopicList.length > 0 ? <ul style={{paddingTop:'30px'}}>
                                {this.state.QtnTopicList.map((item, idx) => {
                                    return <li key={item.TopicID}>
                                        <span className='QueList-title1'>Q{idx + 1}.{item.TopicContent}  {item.TopicType === 1 ? <i>[单选题]</i> : ''}{item.TopicType === 2 ? <i>[多选题]</i> : ''} {item.IsMustAnswer === 2 ? <b> [选答]</b> : ''}</span>
                                        {item.QtnTopicAttachment.length > 0 ? <div className='QueAnswer-Attachment'> {item.QtnTopicAttachment.map((t, d) => {
                                            return <span key={d}> {t.AttachmentType === 1 ? <img src={t.AttachmentUrl} alt="" /> : ''}  {t.AttachmentType === 2 ? <audio src={t.AttachmentUrl} controls><track kind="captions" />
                                                您的浏览器不支持 audio 标签。
                                            </audio> : ''}  {t.AttachmentType === 3 ? <video src={t.AttachmentUrl} controls="controls">
                                                    您的浏览器不支持 video 标签。
</video> : ''}
                                            </span>
                                        })}</div> : ''}
                                        {item.TopicType != 3 && item.QtnTopicOption.length > 0 ? <table>

                                            <thead>
                                                <tr>
                                                    <th>选项</th>
                                                    <th>作答情况<b>(作答人数:{item.AnswerCount}人)</b></th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {item.QtnTopicOption.map((it, id) => {
                                                    return <tr key={it.OptionID} >
                                                        <td>{String.fromCharCode(it.OrderNO + 64)}、{it.OptionContent}{it.IsBlank === 1 ? <input type="text" /> : ''} {it.OptionImgPath ? <img src={it.OptionImgPath} alt="" /> : ''}</td>
                                                        <td>  <i className='QueAnswer-all-count'>{item.AnswerCount > 0 ? <i className='QueAnswer-some-count' style={{ width: 280 * (it.AnswerCount / item.AnswerCount).toFixed(4) }}> </i> : ''} </i> {item.AnswerCount > 0 ? (it.AnswerCount / item.AnswerCount * 100).toFixed(2) : 0}% ({it.AnswerCount}) {it.IsBlank === 1 ? <span className="QueAnswer-message" onClick={() => { this.QueAnswerInfo(item.TopicID, 1, item) }} >作答详情<i></i></span> : ''}</td>
                                                    </tr>

                                                })}
                                            </tbody>
                                        </table> : ''}
                                        {item.TopicType === 3 ? <span className="QueAnswer-message QueAnswer-message1" onClick={() => { this.QueAnswerInfo(item.TopicID, 2, item) }}>作答详情<i></i></span> : ''}
                                    </li>
                                })}
                            </ul> : ''
                            }
                        </div>:<QueAnswerSearch QtnTopicList ={this.state.QtnTopicList} QtnID={this.state.QtnID}></QueAnswerSearch>}
                    </div>
                </div>
                <Footer></Footer>
                <Modal
                    title="作答详情"
                    visible={this.state.visible}
                    // onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={null}
                    width={735}
                // destroyOnClose={true}
                >
                    <div className='QueAnswer-Answer'>
                        {/* <span>{this.state.QtnTopicList[0].TopicContent}</span> */}
                        <span className='QueList-title1'>Q{this.state.messageInfo.OrderNO}.{this.state.messageInfo.TopicContent}  {this.state.messageInfo.TopicType === 1 ? <i>[单选题]</i> : ''}{this.state.messageInfo.TopicType === 2 ? <i>[多选题]</i> : ''} {this.state.messageInfo.IsMustAnswer === 2 ? <b> [选答]</b> : ''}</span>
                          <div className='QueList-border'></div>
                       <div className='QueList-Answer-count'><span>共 <i>{this.state.TextAnswerList.length}</i> 个记录</span>    <div className='QueList-search'><Search getChildrenMsg={this.getChildrenMsg}></Search></div>
                       {this.state.TextAnswerList.length>0?<table className='QueAnswer-table'>
                                <thead>
                                    <tr>
                                        <th>序号</th>
                                        <th>作答详情</th>
                                    </tr>
                                 {this.state.TextAnswerList.map((item, idx)=>{
                                     return <tr  key={idx}>
                                 <td> {idx>8?idx+1:'0'+(idx+1)}</td>
                                 <td> {item}</td>
                                     </tr>
                                 })}   
                                </thead>
                            </table>: <div>暂无作答~</div>}</div>
                    </div>
                </Modal>
            </div>
        )

    }

}

export default AnswerInfo;