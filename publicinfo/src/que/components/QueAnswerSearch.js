import React, { Component } from 'react';
import Footer from '../../common/compont/Footer';
import Header from '../../common/compont/Header';
import { getData, postData, getQueryVariable } from '../../common/js/fetch';
import $ from 'jquery';
import { message, Input, Modal } from 'antd';
import './scss/Quemain.scss';
import './scss/AnswerInfo.scss';
import Search from '../../common/compont/Search';
import { Select } from 'antd';
const { Option } = Select;


function onBlur() {
    console.log('blur');
}


function onSearch(val) {
    console.log('search:', val);
}
class AnswerInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            QtnTopicList: this.props.QtnTopicList,
            Total: 0,
            chooseType1: 'QueAnswer-choose-li',
            chooseType2: '',
            NameList: {},
            ServerDate: '',
            isOpen: false,
            isOpen1: false,
            isOpen2: false,
            QtnID: this.props.QtnID,
            QtnName: '',
            ExpireDate: '',
            QtnExplanation: '',
            QtnSurveyObjectCount: '',
            RespondentCount: '',
            visible: false,
            messageInfo: '',
            TextAnswerList: [],
            chooseQueList: [],
            choose1QueList: [],
            choose2QueList: [],
            listchooseCount: 1,
            QueAnswerSearchArr: [],
            SearchInputarr: [''],
            QueryRespondentCount:'',
            QtnTopicListNew:[],
        }
        this.handleCancel = this.handleCancel.bind(this);
        this.getChildrenMsg = this.getChildrenMsg.bind(this);

    }
    componentDidMount() {
        let QueAnswerSearchArr = [{ 'name': 'Q0.' + this.props.QtnTopicList[0].TopicContent }];
        console.log(this.props.QtnTopicList);
        // let SearchInputarr=[''];
        this.setState({
            QueAnswerSearchArr: QueAnswerSearchArr,
        })
        // sessionStorage.setItem('token', 'D7EA3A5F-DD35-403C-8FE9-A5522F712E81');
        // sessionStorage.setItem('UserID', 'lcq');
        // sessionStorage.setItem('UserType', '0');
        // getData('PublicInfo/Que/AnswerStatisticsMgr/GetQtnAnswerStatisticsDetail', {
        //     UserID: sessionStorage.getItem('UserID'),
        //     UserType: sessionStorage.getItem('UserType'),
        //     QtnID: getQueryVariable('QtnID'),
        //     QueryString: '',
        // }).then((res) => {
        //     return res.json()
        // }).then((json) => {
        //     console.log(json)
        //     this.setState({
        //         QtnName: json.Data.QtnStatisticsDetail.QtnName,
        //         ExpireDate: json.Data.QtnStatisticsDetail.ExpireDate,
        //         QtnExplanation: json.Data.QtnStatisticsDetail.QtnExplanation,
        //         QtnID: json.Data.QtnStatisticsDetail.QtnID,
        //         QtnSurveyObjectCount: json.Data.QtnStatisticsDetail.QtnSurveyObjectCount,
        //         RespondentCount: json.Data.QtnStatisticsDetail.RespondentCount,
        //         QtnTopicList: json.Data.QtnStatisticsDetail.QtnTopicList,

        //     })
        // })
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
                QueryType: type,
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
    getChildrenMsg(e, str) {
        // console.log(str);
        postData('PublicInfo/Que/AnswerStatisticsMgr/GetTopicTextAnswerDetail', {
            UserID: sessionStorage.getItem('UserID'),
            UserType: sessionStorage.getItem('UserType'),
            QtnID: this.state.QtnID,
            TopicOrOptionID: this.state.TopicOrOptionID,
            QueryType: this.state.QueryType,
            TextAnswerKeyword:encodeURIComponent(str) ,
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
    onChange(text, value) {
        // console.log(text,`selected ${value}`);
        let chooseQueList = [];
        chooseQueList = this.state.chooseQueList;
        chooseQueList[value] = text - 1;
        this.setState({
            chooseQueList: chooseQueList
        })
    }
    // onFocus() {
    //     console.log('focus');
    // }
    onChange1(text, value) {
        // console.log(text,`selected ${value}`);
        let choose2QueList = [];
        choose2QueList = this.state.choose2QueList;
        choose2QueList[value] = text;
        this.setState({
            choose2QueList: choose2QueList
        })

    }
    onChange2(text, value) {
        // console.log(text,`selected ${value}`);
        let choose1QueList = [];
        choose1QueList = this.state.choose1QueList;
        choose1QueList[value] = text;
        this.setState({
            choose1QueList: choose1QueList
        })

    }
    addSearchFn() {
        let QueAnswerSearchArr = [];
        let SearchInputarr = [];
        SearchInputarr = this.state.SearchInputarr;
        QueAnswerSearchArr = this.state.QueAnswerSearchArr;
        SearchInputarr.push('');
        console.log(SearchInputarr);
        QueAnswerSearchArr.push({ 'name': 'Q' + this.state.QueAnswerSearchArr.length + '.' + this.props.QtnTopicList[this.state.QueAnswerSearchArr.length].TopicContent });
        // console.log(QueAnswerSearchArr);
        this.setState({
            QueAnswerSearchArr: QueAnswerSearchArr,
            SearchInputarr: SearchInputarr
        })

    }
    SearchDele(num) {
        // console.log(num);
        let QueAnswerSearchArr = [];
        QueAnswerSearchArr = this.state.QueAnswerSearchArr;
        QueAnswerSearchArr[num].name = '-006';
        // QueAnswerSearchArr.splice(num,1);
        let chooseQueList = [];
        chooseQueList = this.state.chooseQueList;
        chooseQueList[num] = -111;
        // console.log(chooseQueList);
        this.setState({
            chooseQueList: chooseQueList
        })
    }
    SearchButton() {
        let QueryString = [];
        let chooseQueList = [];
        chooseQueList = this.state.chooseQueList;
        let QtnTopicList = [];
        QtnTopicList = this.state.QtnTopicList;
        let choose1QueList = [];
        choose1QueList = this.state.choose1QueList;
        let choose2QueList = [];
        choose2QueList = this.state.choose2QueList;
        let QueAnswerSearchArr = [];
        QueAnswerSearchArr = this.state.QueAnswerSearchArr;
        let SearchInputarr = [];
        SearchInputarr = this.state.SearchInputarr;
        // console.log(chooseQueList);
        // console.log(QtnTopicList);
        // console.log(choose1QueList);
        // console.log(choose2QueList);
        // console.log(QueAnswerSearchArr);
        // console.log(SearchInputarr);
        for (let i = 0; i < QueAnswerSearchArr.length; i++) {

            if (chooseQueList[i] >= 0) {
                let item = {
                    "TopicType": 1,
                    "CompareType": 0,
                    "TopicID": "",
                    "OptionAnswer": "",
                    "TextAnswerKeyword": null
                }
                if (QtnTopicList[chooseQueList[i]].TopicType != 3) {
                    item.TopicType = 1;
                    item.TopicID = QtnTopicList[chooseQueList[i]].TopicID;
                    // console.log(choose1QueList[i]);
                    if(choose1QueList[i]==='-006'){
                        return;
                    }
                    if (choose1QueList[i]||choose1QueList[i]==0) {
                        // console.log(QtnTopicList[chooseQueList[i]]);
                        // console.log(choose1QueList[i]);
                        item.OptionAnswer = choose1QueList[i];
                    } 
                } else {
                    item.TopicType = 2;
                    if (choose2QueList[i] != 2) {
                        item.CompareType = 1;
                    } else {
                        item.CompareType = 2;
                    }

                    item.TopicID = QtnTopicList[chooseQueList[i]].TopicID;
                    item.TextAnswerKeyword = SearchInputarr[i];
                }
                QueryString.push(
                    item
                )
            }


        }
        // console.log(QueryString);
        QueryString = JSON.stringify(QueryString);
        postData('PublicInfo/Que/AnswerStatisticsMgr/GetQtnAnswerStatisticsDetail', {
            UserID: sessionStorage.getItem('UserID'),
            UserType: sessionStorage.getItem('UserType'),
            QtnID: getQueryVariable('QtnID'),
            QueryString: QueryString,
        }).then((res) => {
            return res.json()
        }).then((json) => {
            console.log(json)
            if (json.StatusCode === 200 && json.Data.BackCode == 1) {
               if(json.Data.QtnStatisticsDetail.QueryRespondentCount==0){
            
            this.setState({
                QueryRespondentCount:json.Data.QtnStatisticsDetail.QueryRespondentCount,
                QtnTopicListNew:[],
            })
            return;
               }
                this.setState({
                    QueryRespondentCount:json.Data.QtnStatisticsDetail.QueryRespondentCount,
                    QtnTopicListNew:json.Data.QtnStatisticsDetail.QtnTopicList,
                })
            } else {
                message.error(json.Msg);
            }

        })
    }
    onChange4(e, idx) {
        let SearchInputarr = [];
        SearchInputarr = this.state.SearchInputarr;
        SearchInputarr[idx] = e.target.value;
        this.setState({
            SearchInputarr: SearchInputarr
        })
    }
    

    render() {

        return (
            <div>

                <div className='QueAnswer-title-search'>
                    <div className='QueAnswer-title-top'> <span>题目</span><span>答案</span></div>
                    {this.state.QueAnswerSearchArr.length > 0 && this.state.QueAnswerSearchArr.map((item, idx) => {
                        return <div key={idx} className={item.name === '-006' ? 'displayNone' : ''}>
                            <Select
                                showSearch
                                style={{ width: 430, height: 28, marginBottom: 16 }}
                                placeholder=''
                                optionFilterProp="children"
                                onChange={(value) => {
                                    this.onChange(value, idx)
                                }}
                                onFocus={this.onFocus}
                                onBlur={onBlur}
                                onSearch={onSearch}
                                filterOption={(input, option) =>
                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {this.state.QtnTopicList.map((item, idx) => {
                                    if (this.state.chooseQueList.indexOf(idx) == -1) {
                                        return <Option value={item.OrderNO} key={item.OrderNO}>
                                            {'Q' + item.OrderNO + '.' + item.TopicContent}
                                        </Option>
                                    }
                                }

                                )}
                            </Select>
                            {this.state.chooseQueList[idx] >= 0 && this.state.QtnTopicList[this.state.chooseQueList[idx]].TopicType == 3 ? <Select
                                showSearch
                                style={{ width: 85, height: 28, marginLeft: 10, marginRight: 10 }}
                                defaultValue='等于'
                                optionFilterProp="children"
                                onChange={(value) => {
                                    this.onChange1(value, idx)
                                }}
                                onFocus={this.onFocus}
                                onBlur={onBlur}
                                onSearch={onSearch}
                                filterOption={(input, option) =>
                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                <Option value='1' key='0'> 等于</Option>
                                <Option value='2' key='1'> 包含</Option>

                            </Select> : ''}
                            {this.state.chooseQueList[idx] >= 0 && this.state.QtnTopicList[this.state.chooseQueList[idx]].TopicType != 3 ? <Select
                                showSearch
                                style={{ width: 290, height: 28, marginLeft: 105 }}
                                defaultValue='全部'
                                optionFilterProp="children"
                                onChange={(value) => {
                                    this.onChange2(value, idx)
                                }}
                                onFocus={this.onFocus}
                                onBlur={onBlur}
                                onSearch={onSearch}
                                filterOption={(input, option) =>
                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >

                                <Option value='-006' key='0'> 全部</Option>
                                {this.state.QtnTopicList[this.state.chooseQueList[idx]].QtnTopicOption.map((item, idx) => {

                                    return <Option value={item.OptionID} key={item.OrderNO}>
                                        {String.fromCharCode(item.OrderNO + 64) + '.' + item.OptionContent}
                                    </Option>

                                }

                                )}
                                {/* <Option value='1'  key='1'> 包含</Option> */}


                            </Select> : ''}
                            {this.state.chooseQueList[idx] >= 0 && this.state.QtnTopicList[this.state.chooseQueList[idx]].TopicType == 3 ? <input type="text" className='SearchInput' value={this.state.SearchInputarr[idx]} onChange={(e) => { this.onChange4(e, idx) }} /> : ''}
                            {this.state.QueAnswerSearchArr.length > 1 ? <span className='SearchDele' onClick={() => { this.SearchDele(idx) }}>删除</span> : ''}
                        </div>
                    })}

                    {this.state.QtnTopicList.length > this.state.QueAnswerSearchArr.length ? <span className='addSearch' onClick={() => { this.addSearchFn() }}>
                        添加
                   </span> : ''}
                    <div className='SearchBorder'></div>
                    <span className='SearchButton' onClick={() => { this.SearchButton() }}>查询</span>
                    
                </div>
                {this.state.QueryRespondentCount!==''?this.state.QueryRespondentCount==0?<span  style={{display:'inline-block',margin:'24px 42px'}}>没有查询到答卷符合查询条件~</span>:<span style={{display:'inline-block', margin:'24px 42px'}}>共有 <b style={{color:'red'}}>{this.state.QueryRespondentCount}</b> 个答卷符合查询条件，统计结果如下:</span>:''}
                {this.state.QueryRespondentCount!==''?<div>
                {this.state.QtnTopicListNew.length > 0 ? <ul style={{margin:'0 42px'}}>
                                {this.state.QtnTopicListNew.map((item, idx) => {
                                    return <li key={item.TopicID}>
                                        <span className='QueList-title1'>Q{idx + 1}.{item.TopicContent}  {item.TopicType === 1 ? <i>[单选题]</i> : ''}{item.TopicType === 2 ? <i>[多选题]</i> : ''} {item.IsMustAnswer === 2 ? <b> [选答]</b> : ''}</span>
                                        {item.QtnTopicAttachment.length > 0 ? <div className='QueAnswer-Attachment'> {item.QtnTopicAttachment.map((t, d) => {
                                            return <span key={d}> {t.AttachmentType === 1 ? <img src={t.AttachmentUrl} alt="" /> : ''}  {t.AttachmentType === 2 ? <audio src={t.AttachmentUrl} controls>
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
                </div>:''}
            </div>
        )
    }

}

export default AnswerInfo;