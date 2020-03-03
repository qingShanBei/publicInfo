import React, { Component } from 'react';
import { Upload, Icon, message, Modal, Radio, Select, Checkbox } from 'antd';
// import QueList from './QueList';
import './scss/AddQueMore.scss';
import { getData } from '../../common/js/fetch';
import Item from 'antd/lib/list/Item';
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
class AddQueMore extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            textArr: [{ content: '', height: 1 }, { content: '你的性别[单选题]', height: 1 }, { content: '男', height: 1 }, { content: '女', height: 1 }, { content: '', height: 1 }, { content: '', height: 1 }, { content: '', height: 1 }],
            data: [],
        }
        this.handleCancel1 = this.handleCancel1.bind(this);
        this.onkeyUp = this.onkeyUp.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleOk = this.handleOk.bind(this);
    }
    handleCancel1() {
        this.setState({
            visible: false
        })
    }
    componentDidMount() {
        this.changeData();
    }
    changeData() {
        let data = [];
        this.state.textArr.map((item, idx) => {
            if (item.content != '') {
                if (item.content.indexOf('[单选题]') !== -1 || item.content.indexOf('【单选题】') !== -1) {
                    let TopicContent = item.content.slice(0, item.content.indexOf('[单选题]'));
                    if (item.content.indexOf('【单选题】') !== -1) {
                        TopicContent = item.content.slice(0, item.content.indexOf('【单选题】'));
                    }
                    data.push(
                        {
                            "TopicID": null,
                            "TopicContent": TopicContent,
                            "TopicType": 1,
                            "IsImgOption": 0,
                            "IsMustAnswer": 1,
                            "MaxOptionCount": 2,
                            "OptionCountPerRow": 1,
                            "OrderNO": data.length + 1,
                            "QtnTopicAttachment": [],
                            "QtnTopicOption": [],
                            'IsBank':0,
                        }
                    )
                } else if (item.content.indexOf('[多选题]') !== -1 || item.content.indexOf('【多选题】') !== -1) {
                    let TopicContent = item.content.slice(0, item.content.indexOf('[多选题]'));
                    if (item.content.indexOf('【多选题】') !== -1) {
                        TopicContent = item.content.slice(0, item.content.indexOf('【多选题】'));
                    }
                    data.push(
                        {
                            "TopicID": null,
                            "TopicContent": TopicContent,
                            "TopicType": 2,
                            "IsImgOption": 0,
                            "IsMustAnswer": 1,
                            "MaxOptionCount": 2,
                            "OptionCountPerRow": 1,
                            "OrderNO": data.length + 1,
                            "QtnTopicAttachment": [],
                            "QtnTopicOption": [],
                            'IsBank':0,
                        }
                    )
                }
                else if (item.content.indexOf('[简答题]') !== -1 || item.content.indexOf('【简答题】') !== -1) {
                    let TopicContent = item.content.slice(0, item.content.indexOf('[简答题]'));
                    if (item.content.indexOf('【简答题】') !== -1) {
                        TopicContent = item.content.slice(0, item.content.indexOf('【简答题】'));
                    }
                    data.push(
                        {
                            "TopicID": null,
                            "TopicContent": TopicContent,
                            "TopicType": 3,
                            "IsImgOption": 0,
                            "IsMustAnswer": 1,
                            "MaxOptionCount": 2,
                            "OptionCountPerRow": 1,
                            "OrderNO": data.length + 1,
                            "QtnTopicAttachment": [],
                            "QtnTopicOption": [],
                            'IsBank':0,
                        }
                    )
                }
                else {
                    if (data.length === 0) {
                        return;
                    }
                    data[data.length - 1].QtnTopicOption.push(
                        {
                            "OptionID": null,
                            "OptionContent": item.content,
                            "OptionImgPath": "",
                            'OrderNO': data[data.length - 1].QtnTopicOption.length+1
                        }
                    )
                }
            }
        })

        this.setState({
            data: data
        })
    }
    change_radio() {

    }
    onkeyUp(e, idx) {
        if (e.keyCode === 13) {
            let textArr = this.state.textArr;
            textArr.splice(idx + 1, 0, { content: '', height: 1 });
            //    document.getElementById('textarea'+(idx+1)).focus();
            this.setState({
                textArr: textArr
            }, function () {
                document.getElementById('textarea' + (idx + 1)).focus();
            })
            // console.log(this.getCursortPosition(e.target));
            //    console.log(document.getElementById('textarea'+(idx+1)));

            e.returnValue = false;

            return false;
        }
        if (e.keyCode === 8) {
            if (e.target.value.length <= 35) {
                e.target.style.height = '21px'
            }
            if (e.target.value === '' && this.state.textArr.length > 1) {
                let textArr = this.state.textArr;
                textArr.splice(idx, 1);
                this.setState({
                    textArr: textArr
                }, function () {
                    if (idx === 0) {
                        return
                    }
                    let dom = document.getElementById('textarea' + (idx - 1));
                    dom.focus();
                    // var len = dom.value.length;
                    // if (document.selection) {
                    //     var sel = dom.createTextRange();
                    //     sel.moveStart('character',len);
                    //     sel.collapse();
                    //     sel.select();
                    // } else if (typeof dom.selectionStart == 'number' && typeof dom.selectionEnd == 'number') {
                    //     dom.selectionStart = dom.selectionEnd = len;
                    // }
                })
            }
        }



    }
    getCursortPosition(obj) {
        var cursorIndex = 0;
        if (document.selection) {
            // IE Support
            obj.focus();
            var range = document.selection.createRange();
            range.moveStart('character', -obj.value.length);
            cursorIndex = range.text.length;
        } else if (obj.selectionStart || obj.selectionStart == 0) {
            // another support
            cursorIndex = obj.selectionStart;
        }
        return cursorIndex;
    }
    ChangeTextContent(e, idx) {
        let textArr = this.state.textArr;
        if (e.target.value.indexOf('\n') == -1) {
            e.target.style.height = e.target.scrollHeight + 'px'
        }
        textArr[idx].content = e.target.value.replace(/[\n\r]/g, '');

        //    e.target.style.height = e.target.scrollHeight + 'px'
        // textArr[idx].height=e.target.style('height');
        // console.log(e.target.style.height);
        // if(e.target.height)
        this.setState({
            textArr: textArr
        }, function () {
            this.changeData()
        })

    }
    handleCancel() {
        this.props.closeAddMore();
    }
    handleOk() {
        let message1 ='';
        this.state.data.map((item,idx)=>{
           if(item.TopicType!==3&&item.QtnTopicOption.length<2&&!message1){
            message1 ='第'+(idx+1)+'题选项不能少于两个';
           }
        })
        if(message1){
            message.error(message1,1.5);
            
        }else{
            this.props.AddMoreTopic(this.state.data);
            this.setState({
                textArr: [{ content: '', height: 1 }, { content: '你的性别[单选题]', height: 1 }, { content: '男', height: 1 }, { content: '女', height: 1 }, { content: '', height: 1 }, { content: '', height: 1 }, { content: '', height: 1 }],
                data: [],
            })
        }
       
    }
    render() {

        return (
            <Modal
                className='Add-Edit-more'
                title="批量添加题目"
                visible={this.props.visible}
                onCancel={this.handleCancel}
                onOk={this.handleOk}
                width='1150px'
                // footer={null}
                centered={true}
                destroyOnClose={true}
            >
                <div className='clearfix'>
                    <div className='Add-Edit-input'>
                        <p>请在编辑框中输入文本:</p>
                        <span onClick={() => { this.setState({ visible: true }) }} ><i></i>编辑说明</span>
                        <div className='Add-More-left'>
                            {this.state.textArr.length > 0 ? this.state.textArr.map((item, idx) => {
                                return (
                                    <div key={idx} className='text-box'>
                                        <span>{idx + 1}</span>
                                        <textarea id={'textarea' + idx} name="" cols="75" rows={item.height} value={item.content} onChange={(e) => { this.ChangeTextContent(e, idx) }} onKeyDown={(e) => {
                                            this.onkeyUp(e, idx)
                                        }}></textarea>
                                    </div>
                                )
                            }) : ''}

                            {/* <textarea name="" id="" cols="30" rows="1"></textarea> */}
                        </div>
                    </div>
                    <div className='Add-More-right'>
                        {this.state.data.length > 0 ? this.state.data.map((item, idx) => {
                            return (
                                <div key={idx}>

                                    <span className='add-more-title'>Q{idx + 1}. {item.TopicContent}</span>

                                    {item.QtnTopicOption.length > 0 || item.TopicType === 3 ? <ul className='checkbox-ul'>
                                        {
                                            item.TopicType === 1 ?
                                                <RadioGroup name="radiogroup" onChange={this.change_radio.bind(this)}>
                                                    {
                                                        item.QtnTopicOption.length > 0 ?
                                                            item.QtnTopicOption.map((item1, id) => {
                                                                return (
                                                                    <li className='checkbox-li clearfix' key={id} >
                                                                        <div className='checkbox-choose'>

                                                                            <Radio
                                                                                value={id}
                                                                            > <span>{`${String.fromCharCode(id + 65)}.`}</span><span className='add-more-option'>{item1.OptionContent}</span> </Radio>

                                                                        </div>

                                                                    </li>
                                                                )
                                                            }) : ''
                                                    }
                                                </RadioGroup> : item.TopicType === 2 ?
                                                    <CheckboxGroup onChange={() => { this.change_radio(idx, 'checkbox') }}>
                                                        {
                                                            item.QtnTopicOption.length > 0 ?
                                                                item.QtnTopicOption.map((item1, id) => {
                                                                    return (
                                                                        <li className='checkbox-li clearfix' key={id}>
                                                                            <div className='checkbox-choose' >
                                                                                <Checkbox
                                                                                    value={item1.OrderNO}
                                                                                > <span>{`${String.fromCharCode(id + 65)}.`}</span><span className='add-more-option'>{item1.OptionContent}</span></Checkbox>
                                                                            </div>

                                                                        </li>
                                                                    )
                                                                }) : ''
                                                        }
                                                    </CheckboxGroup>
                                                    : <div key={idx}>
                                                        <textarea name="" id="" cols="70" rows="4" className='checkbox-textarea'></textarea>
                                                    </div>}

                                    </ul>

                                        : ''}
                                </div>
                            )
                        }) : ''}
                    </div>
                </div>
                <Modal
                    className='Add-Edit-message'
                    title="编辑说明"
                    visible={this.state.visible}
                    onCancel={this.handleCancel1}
                    width='700px'
                    footer={null}
                    centered={true}
                    destroyOnClose={true}
                >
                    <div>
                        <h2>一、格式说明</h2>
                        <div className='Edit-message'>
                            <div>1. 请在每个题目名称后添加标识，题目不可换行</div>
                            <div>可识别题目标识:<span> [单选题][多选题][简答题]</span></div>
                            <div className='Edit-message-last'>2. 没有标识的那行文本为选项，一行一个选项</div>
                        </div>
                    </div>
                    <h2>二、编辑示例</h2>
                    <div className='message2-title'><span>编辑内容</span> <span>显示效果</span></div>
                    <div className='message3'>
                        <span>
                            <p>您的性别[单选题]</p>
                            <p>A.男</p>
                            <p>B.女</p>
                        </span>
                        <i></i>
                        <span> <p>Q1.您的性别</p>
                            <p> <i></i> A.男</p>
                            <p> <i></i> B.女</p>
                        </span>
                        <span>
                            <p>您喜欢北京哪里[多选题]</p>
                            <p>A.天安门</p>
                            <p>B.天坛</p>
                            <p>C.长城</p>
                        </span>
                        <i></i>
                        <span>
                            <p>Q1.您喜欢北京哪里[多选题]</p>
                            <p><i></i>A.天安门</p>
                            <p><i></i>B.天坛</p>
                            <p><i></i>C.长城</p>
                        </span>
                    </div>
                </Modal>
            </Modal>
        )
    }

}

export default AddQueMore;