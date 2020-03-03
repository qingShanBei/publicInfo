import React, { Component } from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
// import "./components/Common";

import Quemain from './components/Quemain';
import EditQue from './components/EditQue';
import GetQtnContent from './components/GetQtnContent';

// import Noticedetails from './components/Noticedetails';
import Logidn from '../common/compont/Logidn';
import AnswerInfo from './components/AnswerInfo'
import { Spin,message } from 'antd';
// import './components/confit';

// import Search from './components/Search';
import 'antd/dist/antd.css';
import './components/scss/index.scss';
// import './components/scss/index.scss';
// import '../common/scss/Header.scss';
// import './components/scss/Buttonbar.scss';
// import './components/scss/Sidebar.scss';
// import '../common/scss/Search.scss';

import { getData, getQueryVariable } from "../common/js/fetch";


message.config({
  top: 100,
  duration: 2,
  maxCount: 3,
});

// sessionStorage.setItem('token', '20C7B277-0969-4B54-8B09-6723F4B8DB4A');
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      start: 0
    };
  }


  // static getDerivedStateFromProps(props, state){
  //   console.log(11111111111);
  //   getData('PublicInfo/GetUserInfo').then(data => {
  //     return data.json()
  //   }).then(json => {

  //     if (json.error == 0) {
  //       let { data } = json;
  //       sessionStorage.setItem('UserID', data.UserID);
  //       sessionStorage.setItem('UserName', data.UserName);
  //       sessionStorage.setItem('UserType', data.UserType);
  //       sessionStorage.setItem('PhotoPath', data.PhotoPath);
  //       this.setState({
  //         start:1
  //       })

  //     }
  //   }) 
  // }
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
        sessionStorage.setItem('PsnMgrToken',getQueryVariable('lg_tk'));
        sessionStorage.setItem('PsnMgrMainServerAddr', data.MainServerAddr);
        if(data.PsnMgrLgAssistantAddr[data.PsnMgrLgAssistantAddr.length-1]!=='/'){
          data.PsnMgrLgAssistantAddr=data.PsnMgrLgAssistantAddr+'/';
        }
        sessionStorage.setItem('PsnMgrLgAssistantAddr', data.PsnMgrLgAssistantAddr);
        this.setState({
          start: 1
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
    })
  }
  render() {
    return (
      <div className="App">
        {this.state.start === 1 ? <div>
          <div>

            {/* <Search></Search> */}
            <Router>
              {/* exact表示绝对匹配 */}
              {/* 在react-router中每一个Route相当于一个组件 */}
              {/* 在传递参数的时候可以设置成 :参数名? 表示可选参数 */}
              {/* Switch表示只匹配一个符合条件的路由 */}
              <Switch>
                <Route path="/AnswerInfo" component={AnswerInfo} />
                <Route path="/EditQue" component={EditQue} />
                <Route path="/GetQtnContent" component={GetQtnContent} />
                {/* <Route path="/RecNoticeContent" component={Noticedetails} />
              <Route path="/PusNoticeContent" component={Noticedetails} /> */}
                <Route path="/" exact component={Quemain} />
                <Route path="/404" component={Logidn} />
                {/* <Route path="/hot_show" component={() => <h1>热映 </h1>} /> */}
                {/* <Route path="/detail/:id" component={() => <h1>详情页</h1>} /> */}
                <Route component={Logidn} />
              </Switch>
            </Router>
          </div>
        </div> : ''}
        <div className="example" style={{ display: 'none', height: document.documentElement.clientHeight + 'px', lineHeight: document.documentElement.clientHeight + 'px' }}> <Spin size="large" /></div>
      </div>
    );
  }
}
export default App;