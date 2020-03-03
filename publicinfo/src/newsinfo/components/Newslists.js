import React, { Component } from 'react';
import Search from '../../common/compont/Search';
import './scss/NewsList.scss';
import $ from 'jquery';
import { getData } from '../../common/js/fetch';
import { message, Modal, Pagination } from 'antd';
import CreateNews from './CreateNews';
// import Alert from '../../common/compont/alert_dialog_wrapper';
// import QueView from './QueView';

class Newslists extends Component {
    constructor(props) {
        super(props);
        this.state = {
            NewsList: [],
            Newstype: '全部',
            NewsTypeList: [],
            isMouseOut: false,
            isMouseOut1: false,
            chooseOne:false,
            visible:false,
            NoticeMain: 0,
            Keyword:'',
            PageIndex:1,
            Total:0,
            openAddEvent:false,
        }
        this.getChildrenMsg = this.getChildrenMsg.bind(this);
        this.hideModal =this.hideModal.bind(this);
        this.onChangePage =this.onChangePage.bind(this);
        
    }
    // 挂载前
    componentDidMount() {
        //检测用户是否有未保存问卷
        this.getQuelist('');
        
    }
    addEvent(elm, event, handler) {
        if (window.attachEvent) {
            elm.attachEvent("on" + event, handler);
        } else if (window.addEventListener) {
            elm.addEventListener(event, handler);
        } else {
            elm['on' + event] = handler;
        }
    }
    getQuelist(keyword) {
        getData('PublicInfo/News/PublishedNewsMgr/GetSendedNewsList', {
            UserID: sessionStorage.getItem('UserID'),
            UserType: sessionStorage.getItem('UserType'),
            TitleKeyword:'',
            NewsTypeName: this.state.Newstype=='全部'||!this.state.Newstype?'':this.state.Newstype,
            IsQueryPerNews: this.state.chooseOne?1:0,
            PageIndex: this.state.PageIndex,
            PageSize: 10,
        }).then((res) => {
            return res.json()
        }).then((json) => {
            // console.log(json);
            // hide();
            if (json.StatusCode == 200) {
                this.setState({
                    NewsList: json.Data.NewsList,
                    Total: json.Data.Total,
                })
            } else {
                message.error(json.Msg, 3);
            }
            this.setState({
                Keyword:keyword,
            })
        })
    }

    //搜索相应的问卷
    getChildrenMsg(e, keyword) {
        getData('PublicInfo/News/PublishedNewsMgr/GetSendedNewsList', {
            UserID: sessionStorage.getItem('UserID'),
            UserType: sessionStorage.getItem('UserType'),
            TitleKeyword:encodeURIComponent(keyword),
            NewsTypeName: '',
            IsQueryPerNews:0,
            PageIndex: 1,
            PageSize: 10,
        }).then((res) => {
            return res.json()
        }).then((json) => {
            // console.log(json);
            // hide();
            if (json.StatusCode == 200) {
                this.setState({
                    NewsList: json.Data.NewsList,
                    Total: json.Data.Total,
                    PageIndex:1,
                    Keyword:keyword,
                    Newstype:'全部',
                    chooseOne:false,
                })
            } else {
                message.error(json.Msg, 3);
            }
        })
    }
    createNews() {
        this.setState({
            visible:true,
        })
    }
    TypeOver() {
        let $this =this;
        // console.log('移入');
        if (!this.state.isMouseOut1) {
            this.setState({
                isMouseOut1: true,
                isMouseOut: false
            })
            if(this.state.NewsTypeList.length>0){
                this.setState({
                    isMouseOut: true
                })
                return;
            }
            getData('PublicInfo/News/PublishedNewsMgr/GetSendedNewsTypeList', {
                UserType: sessionStorage.getItem('UserType'),
                unloading: 1
            }).then((res) => {
                return res.json()
            }).then((json) => {
                // console.log(json);
                // hide();
                if (json.StatusCode == 200) {
                    json.Data.NewsTypeList.unshift('全部');
                    $this.setState({
                        NewsTypeList: json.Data.NewsTypeList,
                        isMouseOut: true
                    })
                } else {
                    message.error(json.Msg, 3);
                }
            })
        }
    }
    TypeOut() {
        // console.log('移出');
        this.setState({
            isMouseOut1: false,
            isMouseOut: false
        })
    }
    chooseType(type){
        this.setState({
            Newstype:type,
            isMouseOut:false,
            isMouseOut1:false,
            PageIndex:1,
            Keyword:'',
        },()=>{
            this.getQuelist('');
        })
    }
    ChooseOne(){
        this.setState({chooseOne:!this.state.chooseOne,
            PageIndex:1,
            Keyword:'',
        },()=>{
            this.getQuelist('');
        })
    }
    hideModal(){
        this.setState({
            visible:false
        })
    }
    
    onChangePage(page = 1) {
        let $this =this;
        getData('PublicInfo/News/PublishedNewsMgr/GetSendedNewsList', {
            UserID: sessionStorage.getItem('UserID'),
            UserType: sessionStorage.getItem('UserType'),
            TitleKeyword:encodeURIComponent(this.state.Keyword),
            NewsTypeName:  this.state.Newstype=='全部'||!this.state.Newstype?'':this.state.Newstype,
            IsQueryPerNews: this.state.chooseOne?1:0,
            PageIndex: page,
            PageSize: 10,
        }).then((res) => {
            return res.json()
        }).then((json) => {
            // console.log(json);
            // hide();
            if (json.StatusCode == 200) {
                $this.setState({
                    NewsList: json.Data.NewsList,
                    Total: json.Data.Total,
                    chooseOne:0,
                    Newstype:'全部',
                    PageIndex: page,
                })
                window.scrollTo({
                    left: 0,
                    top: 100,
                    // behavior: 'smooth',
                  });
            } else {
                message.error(json.Msg, 3);
            }
        })
        // console.log( this.state.value);
    }
    OpenNewsContent(id){
       
        let url = window.location.href.split('?')[0] + '#/NewsContent?lg_tk=' + sessionStorage.getItem('token') + '&NewsID=' + id;
        window.open(url, '_blank');
        let $this =this;
        if(!this.state.openAddEvent){
            this.setState({
                openAddEvent:true
            })
            this.addEvent(window, 'message', function(e) {
                try {
                    if(e.data==1){
                        $this.getQuelist('');
                    }
                } catch (ex) {
                }
            }, false);
        }
       
    }

        
    render() {
        return (
            <div className='QueList-div clearfix'>
                <div>
                    <span className='Que-create-button' onClick={() => { this.createNews() }}><i></i>发布新闻资讯</span>
                    <div className='QueList-Seacch'><Search getChildrenMsg={this.getChildrenMsg} width="300" placeholderText='请输入新闻资讯标题进行搜索...'  ></Search></div>
                </div>
                <div className='newsList-box'>
                    <div className='newsList-choose' ><span>类别: </span> <div className='div-select'  onMouseOver={() => { this.TypeOver() }} onMouseLeave={() => { this.TypeOut() }}>
                        <div className='Mouse-div'><span className='type-name'>{this.state.Newstype}</span><i className={this.state.isMouseOut && this.state.isMouseOut1?'select-img1':'select-img'} ></i></div>
                        {this.state.isMouseOut && this.state.isMouseOut1 ? <div className='div-select-bottom'></div> : ''}
                        {this.state.isMouseOut && this.state.isMouseOut1 ? <div className='div-select-list'>
                            {this.state.NewsTypeList.map((item) => {
                                return <b key={item} onClick={()=>{
                                   this.chooseType(item)
                                }}>  {item} </b>
                            })}
                        </div> : ''}

                    </div > <i className={this.state.chooseOne?'chooseOne':'chooseMore'} onClick={()=>{ this.ChooseOne()}}></i><span className='chooseOne-span'  onClick={()=>{ this.ChooseOne()}}>只看自己发布的</span></div>
                    {this.state.NewsList && this.state.NewsList.length > 0 ? <table>
                        <thead>
                            <tr>
                                <th width="150" >封面</th>
                                <th width="470" >新闻标题</th>
                                <th width="160" >发布者</th>
                                <th width="150" >发布时间</th>
                                <th width="150" >阅读次数</th>
                                <th width='60'></th>
                    
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.NewsList.map((item, idx) => {
                                return <tr key={idx} onClick={()=>{this.OpenNewsContent(item.NewsID)}}>
                                    <td>{item.NewsCoverPath.length > 0 ?<img className='News-bg' src={item.NewsCoverPath} alt="图片丢失" />: <i className='News-bg News-bg1'></i>  }</td>
                                    <td><span><b>[{item.NewsTypeName}]</b>{item.NewsTitle}</span></td>
                                    <td>{item.PublisherName}</td>
                                    <td>{item.PublishTime}</td>
                                    <td>{item.ReadCount?item.ReadCount:'0'}次</td>
                                    <td></td>
                                </tr>
                            })}
                        </tbody>
                    </table> : <div className='empty-div'> <i className='img-ig'></i><p>暂无您想要的新闻资讯哦~</p></div>}
                </div>
               <div  className="news-Pagination"> <Pagination className="notice-ant-Pagination" showQuickJumper hideOnSinglePage={true} pageSize={10} defaultCurrent={1} current={this.state.PageIndex} total={this.state.Total} onChange={this.onChangePage} /></div>
                <CreateNews visible={this.state.visible} hideModal={this.hideModal} NoticeMain={this.state.NoticeMain} changeNoticeList={this.onChangePage} ></CreateNews>
            </div>
        )
    }
}
export default Newslists;