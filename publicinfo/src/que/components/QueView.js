import React, { Component } from 'react';
import { Modal, Radio, Checkbox } from 'antd';
import './scss/QueList.scss';
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
class QueView extends Component {
    // constructor(props) {
    //     super(props);

    //     // this.objectListslice = this.objectListslice.bind(this);
    // }
    change_radio(data) {

    }
    render() {


        return (

            <div>
                <Modal
                    className='create-QueModal6'
                    title="问卷预览"
                    visible={this.props.visible}
                    // onOk={this.handleOk6}
                    onCancel={this.props.handleCancel}
                    footer={null}
                    width='1200px'
                    destroyOnClose={true}
                    centered={true}
                    mask={false}
                    zIndex='1111'
                >
                    <div className='checkbox-QtnName'> {this.props.QueContent.QtnName}</div>
                    <div className='checkbox-QtnExplanation' > {this.props.QueContent.QtnExplanation}</div>
                    {this.props.visible && this.props.QueContent.QtnTopicList && this.props.QueContent.QtnTopicList.length > 0 ? <div className='radio-main'>
                        {
                            this.props.QueContent.QtnTopicList.map((item, idx) => {
                                return <div key={idx}>
                                    <div className='checkbox-TopicContent'> Q{idx+1}. {item.TopicContent}</div>
                                    {item.QtnTopicAttachment && item.QtnTopicAttachment.length > 0 ? <div className='clearfix'>
                                        {item.QtnTopicAttachment.map((item2, idx2) => {
                                            return (
                                                <div key={idx2}>
                                                    {item2.AttachmentType === 1 ? <img className='checkbox-title-img' src={item2.AttachmentUrl.indexOf('http') > -1 ? item2.AttachmentUrl : sessionStorage.getItem('ResourceServerAddr') + item2.AttachmentUrl} alt="图片丢失" /> : item2.AttachmentType === 2 ? <audio src={item2.AttachmentUrl.indexOf('http') > -1 ? item2.AttachmentUrl : sessionStorage.getItem('ResourceServerAddr') + item2.AttachmentUrl} controls>
                                                        您的浏览器不支持 audio 标签。
                                            </audio> : item2.AttachmentType === 3 ? <video src={item2.AttachmentUrl.indexOf('http') > -1 ? item2.AttachmentUrl : sessionStorage.getItem('ResourceServerAddr') + item2.AttachmentUrl} controls="controls">
                                                            您的浏览器不支持 video 标签。
</video> : ''}
                                                </div>
                                            )
                                        })}
                                    </div> : ''}
                                    <ul className='checkbox-ul'>
                                        {
                                            item.TopicType === 1 ?
                                                <RadioGroup name="radiogroup" onChange={this.change_radio.bind(this)}>
                                                    {
                                                        item.QtnTopicOption.length > 0 ?
                                                            item.QtnTopicOption.map((item1, id) => {
                                                                return (

                                                                    <li className='checkbox-li' key={id} style={{ minWidth: 100 / item.OptionCountPerRow + '%', float: 'left' }}>
                                                                        <div className='checkbox-choose' style={{ minHeight: item.OptionCountPerRow > 1 && id > 0 && (id % item.OptionCountPerRow !== 0||(id>1&&id-1 % item.OptionCountPerRow !== 0&&id % item.OptionCountPerRow !== 0)||(id>2&&id-2 % item.OptionCountPerRow !== 0&&id-1 % item.OptionCountPerRow !== 0&&id % item.OptionCountPerRow !== 0)) && item.QtnTopicOption[id - 1].OptionImgPath ? '141px' : '' }}>
                                                                            <Radio
                                                                                value={item1.OrderNO}
                                                                            > <span>{`${String.fromCharCode(item1.OrderNO + 64)}.`}</span><span className="radio-text">{item1.OptionContent}{item1.IsBlank === 1 ? <input></input> : ''}</span></Radio>
                                                                            {item.IsImgOption===1&&item1.OptionImgPath ? <img className='checkbox-img' src={item1.OptionImgPath.indexOf('http') > -1 ? item1.OptionImgPath:sessionStorage.getItem('ResourceServerAddr') +  item1.OptionImgPath} alt="图片丢失" /> : ''}
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
                                                                        <li className='checkbox-li' key={id} style={{ minWidth: 100 / item.OptionCountPerRow + '%', float: 'left' }} >
                                                                            <div className='checkbox-choose' >
                                                                                <Checkbox
                                                                                    value={item1.OrderNO}
                                                                                > <span>{`${String.fromCharCode(item1.OrderNO + 64)}.`}</span>{item1.OptionContent}</Checkbox>
                                                                            </div>
                                                                            {item.IsImgOption===1&&item1.OptionImgPath ? <img className='checkbox-img' src={item1.OptionImgPath} alt="图片丢失" /> : ''}
                                                                        </li>
                                                                    )
                                                                }) : ''
                                                        }
                                                    </CheckboxGroup>
                                                    : <div key={idx}>
                                                        <textarea name="" id="" cols="160" rows="7" className='checkbox-textarea'></textarea>
                                                    </div>}
                                    </ul>
                                </div>
                            })}
                    </div> : <div> <i className='empty-que-bg' style={{marginLeft:'430px'}}></i> <p style={{textAlign:'center'}}> 此问卷暂无内容哦~</p> </div>}
                            
                </Modal>
            </div>
        )

    }

}

export default QueView;