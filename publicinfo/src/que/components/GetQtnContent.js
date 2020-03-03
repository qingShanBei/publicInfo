import React, { Component } from 'react';
import Footer from '../../common/compont/Footer';
import Header from '../../common/compont/Header';
import QueList from './QueList';
import './scss/Quemain.scss';
import './scss/GetQtnContent.scss';
import { getData, postData, getQueryVariable } from '../../common/js/fetch';
import TextArea from 'antd/lib/input/TextArea';
import Alert from '../../common/compont/alert_dialog_wrapper';
import { message } from 'antd';

class GetQtnContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            QtnRespondent: {},
            QtnTopicList: [],
            needFixed: false,
            DoneNum: 0,
            OpenTitleList: false,
            isOpen: false,
            message: '',
            isSubmit: false,
            BackCode:1,
            state:0,
        }
    }
    componentDidMount() {
        getData('PublicInfo/GetUserInfo').then(data => {
            return data.json()
          }).then(json => {
            if (json.error == 0) {
              let { data } = json;
              sessionStorage.setItem('UserID', data.UserID);
              sessionStorage.setItem('UserName', data.UserName);
              sessionStorage.setItem('UserType', data.UserType);
              sessionStorage.setItem('PhotoPath', data.PhotoPath);
              sessionStorage.setItem('UserClass', data.UserClass);
              sessionStorage.setItem('SchoolID', data.SchoolID);
              sessionStorage.setItem('MainServerAddr', data.MainServerAddr);
              sessionStorage.setItem('ResourceServerAddr', data.ResourceServerAddr);
              sessionStorage.setItem('token', getQueryVariable('lg_tk'));
            
              this.someFunction();
              getData('PublicInfo/Que/QtnRespondentMgr/GetQtnContentWithRespondent', {
                  UserID: sessionStorage.getItem('UserID'),
                  QtnID: getQueryVariable('QtnID'),
              },
              ).then((res) => {
                  return res.json();
              }).then((json) => {
                  if (json.StatusCode == 200 && json.Data.BackCode == 1) {
                      json.Data.QtnRespondent.QtnTopicList.map((item, idx) => {
                          if (item.TopicType === 3 && item.TopicRespondent.length === 0) {
                              json.Data.QtnRespondent.QtnTopicList[idx].TopicRespondent = [{
                                  "TopicID": "",
                                  "OptionAnswer": '',
                                  "TextAnswer": "",
                              }]
                          }
                          if (item.TopicType !== 3 && item.TopicRespondent.length > 0) {
                              item.TopicRespondent.map((it, i) => {
                                  if (it.OptionAnswer && it.TextAnswer) {
                                      json.Data.QtnRespondent.QtnTopicList[idx].TopicRespondent[i].TextAnswer = '';
                                  }
                              })
                          }
                      })
                      this.setState({
                          QtnRespondent: json.Data.QtnRespondent,
                          QtnTopicList: json.Data.QtnRespondent.QtnTopicList,
                          BackCode:1
                      }, () => {
                          this.ChangeDoneNum();
      
                          let timer = setInterval(() => {
                              if (this.state.isSubmit) {
                                  clearInterval(timer);
                                  return;
                              }
                              this.SaveQtnRespondentFn();
                          }, 60000)
                      })
                  }
                  else if(json.StatusCode == 200 && json.Data.BackCode == 4){
                    this.setState({
                        BackCode:4
                    })
                  }else if(json.StatusCode == 200 && json.Data.BackCode == 3){
                    this.setState({
                        BackCode:3
                    })
                  }else if(json.StatusCode == 200 && json.Data.BackCode == 2){
                    this.setState({
                        BackCode:2
                    })
                  }
                  // console.log(json);
              })
            }
            else {
              let url = window.location.href;
              url = url.split('?');
              if (url.length > 1 && url[1].indexOf('&') > -1) {
                let pram = url[1].split('&');
                url = url[0] + '?';
                pram.map((item) => {
                  if (item.indexOf('lg_tk=') === -1) {
                    url += item+'&';
                  }
                })
                url=url.slice(0,-1);
              } else {
                url = url[0];
              }
              url = encodeURIComponent(url);
              sessionStorage.removeItem('token');
              getData('PublicInfo/GetServerInfo', {},
              ).then((res) => {
                return res.json();
              }).then((json) => {
                // alert('未认证用户信息，请重新登录~');
                window.open(json.Data.MainServerAddr + '/UserMgr/Login/Login.aspx?lg_sysid=' + json.Data.SysID + '&lg_preurl=' + url, '_self');
              })
            }
            this.setState({
                state:1,
            })
          })
    }
    //暂存
    SaveQtnRespondentFn() {
        let TopicRespondent = [];
        this.state.QtnTopicList.map((item) => {
            if (item.TopicRespondent.length > 0) {
                if (item.TopicType === 3 && item.TopicRespondent[0].TextAnswer) {
                    TopicRespondent.push(item.TopicRespondent[0]);
                }
                if (item.TopicType !== 3) {
                    item.TopicRespondent.map((it) => {
                        TopicRespondent.push(it);
                    })
                }
            }
        })

        postData('PublicInfo/Que/QtnRespondentMgr/SaveQtnRespondent', {
            UserID: sessionStorage.getItem('UserID'),
            QtnID: getQueryVariable('QtnID'),
            TopicRespondent: JSON.stringify(TopicRespondent),
            unloading: true,
        },
        ).then((res) => {
            return res.json();
        }).then((json) => {
            if (json.StatusCode == 200 && json.Data.BackCode == 1) {

            }

            // console.log(json);
        })
    }
    //计算已答题目数量
    ChangeDoneNum() {
        let count = 0;
        this.state.QtnTopicList.map((item) => {
            if (item.TopicRespondent.length > 0) {
                if (item.TopicType !== 3 && item.TopicRespondent[0].OptionAnswer) {
                    count++;
                } else {
                    if (item.TopicRespondent[0].TextAnswer) {
                        count++;
                    }
                }
            }
        })
        this.setState({
            DoneNum: count
        })
    }
    //提交答卷判断
    SubmitQtnRespondentFn() {

        let Unanswered = false;//必答是否答完 false 已答完   如果为值则是某道题
        this.state.QtnTopicList.map((item, idx) => {
            if (!Unanswered) {
                if (item.TopicRespondent.length > 0) {
                    if (item.TopicType === 3) {
                        //   alert(idx);
                        if (!item.TopicRespondent[0].TextAnswer && item.IsMustAnswer === 1) {
                            Unanswered = idx + 1;
                        }
                    }

                } else {
                    if (item.IsMustAnswer === 1) {
                        Unanswered = idx + 1;
                    }

                }
            }

        })
        if (Unanswered) {
            message.warning('第' + Unanswered + '未作答,还不能提交哦~', '2');
            this.setState({
                OpenTitleList: true,
            })
            return;
        }
        if (this.state.DoneNum === this.state.QtnTopicList.length) {
            this.setState({
                isOpen: true,
                message: '是否提交问卷?'
            })
        } else {
            this.setState({
                isOpen: true,
                message: '还有选答题未作答,是否提交问卷?'
            })
        }

    }
    //提交问卷
    SubmitFn(data) {
        if (data) {
            let TopicRespondent = [];
            this.state.QtnTopicList.map((item, idx) => {
                if (item.TopicRespondent.length > 0) {
                    if (item.TopicType === 3) {
                        if (item.TopicRespondent[0].TextAnswer) {
                            TopicRespondent.push(item.TopicRespondent[0]);
                        }
                    }
                    if (item.TopicType !== 3) {
                        item.TopicRespondent.map((it) => {
                            TopicRespondent.push(it);
                        })
                    }
                }
            })

            postData('PublicInfo/Que/QtnRespondentMgr/SubmitQtnRespondent', {
                UserID: sessionStorage.getItem('UserID'),
                QtnID: getQueryVariable('QtnID'),
                TopicRespondent: JSON.stringify(TopicRespondent),
                CompletionRate: (this.state.DoneNum / this.state.QtnTopicList.length ).toFixed(2) * 1 + '',

            },
            ).then((res) => {
                return res.json();
            }).then((json) => {
                if (json.StatusCode == 200 && json.Data.BackCode == 1) {
                    message.success('问卷提交成功！')
                    this.setState({
                        isOpen: false,
                        isSubmit: true,
                    })
                }
                window.opener.postMessage('3', '*');
                // console.log(json);
            })
        } else {
            this.setState({
                isOpen: false
            })
        }

    }
    Changeinput(e, idx, id) {

        // console.log(e,idx,id);
        let QtnTopicList = this.state.QtnTopicList;
        let num = '';
        QtnTopicList[idx].TopicRespondent.map((item, i) => {
            if (item.OptionAnswer === id) {
                num = i
            }
        })
        // console.log(e.target.value)
        QtnTopicList[idx].TopicRespondent[num].TextAnswer = e.target.value;
        // console.log(QtnTopicList[idx].TopicRespondent[num].TextAnswer);
        this.setState({
            QtnTopicList: QtnTopicList,
        })
    }
    chooseFn(id, idx, Type) {

        let QtnTopicList = [];
        QtnTopicList = this.state.QtnTopicList
        let ischoose = '';
        if (QtnTopicList[idx].TopicRespondent.length > 0) {
            QtnTopicList[idx].TopicRespondent.map((item, idx) => {
                // console.log(item.OptionAnswer === id);
                if (item.OptionAnswer === id) {
                    ischoose = idx
                }
            })
            if (ischoose !== '' && QtnTopicList[idx].TopicType === 2 && Type === 2) {
                return;
            }
            if (ischoose !== '' && QtnTopicList[idx].TopicType === 2) {
                QtnTopicList[idx].TopicRespondent.splice(ischoose, 1);

            } else {
                if (QtnTopicList[idx].TopicType === 1) {
                    QtnTopicList[idx].TopicRespondent = [{
                        "TopicID": QtnTopicList[idx].TopicID,
                        "OptionAnswer": id,
                        "TextAnswer": ''
                    }]
                }
                else if (QtnTopicList[idx].TopicType === 2 && QtnTopicList[idx].TopicRespondent.length < QtnTopicList[idx].MaxOptionCount) {
                    QtnTopicList[idx].TopicRespondent.push(
                        {
                            "TopicID": QtnTopicList[idx].TopicID,
                            "OptionAnswer": id,
                            "TextAnswer": ''
                        }
                    )
                } else if (QtnTopicList[idx].TopicType === 2 && QtnTopicList[idx].TopicRespondent.length === QtnTopicList[idx].MaxOptionCount) {
                    // console.log(QtnTopicList[idx].TopicRespondent[0]);
                    QtnTopicList[idx].TopicRespondent.shift();
                    // console.log(QtnTopicList[idx].TopicRespondent[0]);
                    QtnTopicList[idx].TopicRespondent.push(
                        {
                            "TopicID": QtnTopicList[idx].TopicID,
                            "OptionAnswer": id,
                            "TextAnswer": ''
                        }
                    )
                }
            }




        } else {
            QtnTopicList[idx].TopicRespondent.push(
                {
                    "TopicID": QtnTopicList[idx].TopicID,
                    "OptionAnswer": id,
                    "TextAnswer": ''
                }
            )
        }

        this.setState({
            QtnTopicList: QtnTopicList,
        }, () => {
            this.ChangeDoneNum();
        })
    }
    getnum(item, it) {
        if (item.TopicRespondent.length > 0) {
            item.TopicRespondent.map((item1, idx1) => {
                if (item1.OptionAnswer === it.OptionID && item.TopicRespondent[idx1].TextAnswer) {
                    // console.log(item.TopicRespondent[idx1].TextAnswer);
                    return item.TopicRespondent[idx1].TextAnswer
                }
            })
        }

    }
    ChangeTextarea(e, idx, id) {
        let QtnTopicList = this.state.QtnTopicList;
        let num = '';
        QtnTopicList[idx].TopicRespondent[0].TextAnswer = e.target.value;
        if (e.target.value !== '') {
            QtnTopicList[idx].TopicRespondent[0].TopicID = id;
        } else {
            QtnTopicList[idx].TopicRespondent[0].TopicID = '';
        }

        this.setState({
            QtnTopicList: QtnTopicList,
        }, () => {
            this.ChangeDoneNum();
        })
    }
    scrollToAnchor = (anchorName) => {
        if (anchorName) {
            let anchorElement = document.getElementById(anchorName);
            if (anchorElement) { anchorElement.scrollIntoView(); }
        }
        this.setState({
            OpenTitleList: false
        })
    }
    someFunction = () => {
        const fixedTop = 230;
        window.onscroll = () => {
            let scrollTop = Math.max(document.body.scrollTop, document.documentElement.scrollTop);
            //控制元素块A随鼠标滚动固定在顶部
            if (scrollTop >= fixedTop) {
                this.setState({ needFixed: true })
            } else if (scrollTop < fixedTop) {
                this.setState({ needFixed: false })
            }
        }
    }
    render() {

        return (
            <div>
                <Header headerStyle={2}></Header>
                {this.state.state==1?<div className="Quemain-div">
                    {this.state.BackCode==1?  <div className='Answer-sheet' >
                        <span className='Answer-sheet-title'>{this.state.QtnRespondent.QtnName}</span>
                        <span className='Answer-sheet-span'><span>发布人: <b>{this.state.QtnRespondent.CreatorName}  </b></span><span>截止时间: <b>{this.state.QtnRespondent.ExpireDate}  </b></span></span>
                        <span className='Answer-sheet-QtnExplanation'><span>{this.state.QtnRespondent.QtnExplanation} </span></span>
                        <div className='Answer-sheet-main' onClick={() => {
                            this.setState({
                                OpenTitleList: false
                            })
                        }}>
                            <ul>

                                {this.state.QtnTopicList.length > 0 ? this.state.QtnTopicList.map((item, idx) => {
                                    return (
                                        <li className='QtnTopicList-li' key={item.TopicID} id={'Q' + idx} >
                                            <span className='TopicContent'>Q{idx + 1}.{item.TopicContent} {item.IsMustAnswer === 2 ? <b>(选答)</b> : ''} </span>
                                            {item.QtnTopicAttachment && item.QtnTopicAttachment.length > 0 ? <div className='clearfix QtnTopicAttachment'>
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
                                            {item.TopicType !== 3 ? <ul className={item.TopicType === 1 ? 'TopicType1 TopicType' : 'TopicType2 TopicType'}>
                                                {item.QtnTopicOption.length > 0 && item.QtnTopicOption.map((it, id) => {
                                                    return (
                                                        <li className='QtnTopicOption-li' key={it.OptionID} style={{ minWidth: (1 / (item.OptionCountPerRow + 1) + 0.01) * 1100 + 'px' }}>
                                                            <span className='OptionContent' onClick={() => { (this.chooseFn(it.OptionID, idx)) }}>
                                                                <i className={item.TopicRespondent.length > 0 ? item.TopicRespondent.some((item) => {
                                                                    return item.OptionAnswer === it.OptionID
                                                                }) ? 'choose' : '' : ''}></i><b>{`${String.fromCharCode(id + 65)}.`}</b> {it.OptionContent}
                                                            </span>
                                                            {it.IsBlank ? <input onFocus={(e) => { (this.chooseFn(it.OptionID, idx, 2)) }} type="text" value={item.TopicRespondent.length > 0 && item.TopicRespondent.some((item) => { return item.OptionAnswer === it.OptionID }) ? this.getnum(item, it) : ''} placeholder={this.getnum(item, it)} onChange={(e) => { this.Changeinput(e, idx, it.OptionID) }} /> : ''}
                                                            {it.OptionImgPath ? <img className='checkbox-img' src={it.OptionImgPath} alt="图片丢失" /> : ''}
                                                        </li>
                                                    )
                                                })}
                                            </ul> : <textarea cols='80' rows='3' value={item.TopicRespondent[0].TextAnswer} onChange={(e) => { this.ChangeTextarea(e, idx, item.TopicID) }}></textarea>}
                                        </li>
                                    )
                                }) : ''}

                            </ul>
                        </div>
                        <div className={this.state.needFixed ? 'Answer-sheet-fixd fixed' : 'Answer-sheet-fixd'}><span onClick={() => { this.setState({ OpenTitleList: true }) }}>问卷大纲</span>
                            {this.state.OpenTitleList ? <div className='Answer-sheet-titleList' >
                                {this.state.QtnTopicList.length > 0 ? <ul className="fixed-ul">
                                    {this.state.QtnTopicList.map((item3, idx) => {
                                        return (
                                            <li key={idx}><a onClick={() => this.scrollToAnchor('Q' + idx)} className={item3.TopicRespondent.length > 0 && ((item3.TopicType != 3 && item3.TopicRespondent[0].OptionAnswer) || (item3.TopicType === 3 && item3.TopicRespondent[0].TextAnswer)) ? 'do-li' : ''} title={item3.TopicContent.length>32?item3.TopicContent:''} >Q{idx + 1}. <b>{item3.TopicContent.length>32?item3.TopicContent.slice(0,30)+'..':item3.TopicContent}{item3.IsMustAnswer === 2 ? <b>(选答)</b> : ''} </b></a></li>
                                        )
                                    })}
                                </ul> : ''}
                            </div> : ''}</div>
                        <div className={this.state.needFixed ? 'Answer-sheet-do fixed2' : 'Answer-sheet-do'}><span> <i style={{ height: this.state.DoneNum / this.state.QtnTopicList.length * 160 + 'px' }}></i></span> <b>{(this.state.DoneNum / this.state.QtnTopicList.length * 100).toFixed(0) + '%'}</b></div>

                        {this.state.isSubmit ? <div className='Answer-sheet-popup' onClick={() => {
                            this.setState({
                                OpenTitleList: false
                            })
                        }}></div> : <div className='Answer-sheet-button'> <span onClick={() => { this.SaveQtnRespondentFn() }}>暂存</span><span onClick={() => { this.SubmitQtnRespondentFn() }}>提交</span></div>}

                    </div>
            :this.state.BackCode==4? <div style={{lineHeight:'400px',fontSize:'32px',textAlign:'center'}}>您的问卷已提交了哦~</div>:this.state.BackCode==3? <div style={{lineHeight:'400px',fontSize:'32px',textAlign:'center'}}>问卷已截止作答了哦~</div>: <div style={{lineHeight:'400px',fontSize:'32px',textAlign:'center'}}>问卷不存在了哦~</div>} }
                      </div>
                
                :<div style={{minHeight:'400px'}}></div> }<Alert message={this.state.message} isOpen={this.state.isOpen} chooseFn={(data) => { this.SubmitFn(data) }}></Alert>
                <Footer></Footer>
            </div>
        )

    }

}

export default GetQtnContent;