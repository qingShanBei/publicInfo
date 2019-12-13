import React, { Component } from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import "./components/Common";

import Sidebar from './components/Sidebar';
import Noticedetails from './components/Noticedetails';

import './components/confit';

// import Search from './components/Search';
import 'antd/dist/antd.css';
import './components/scss/index.scss';
import './components/scss/Header.scss';
import './components/scss/Buttonbar.scss';
import './components/scss/Sidebar.scss';
import './components/scss/Search.scss';

// import { getData } from "./common/js/fetch";





// sessionStorage.setItem('token', '20C7B277-0969-4B54-8B09-6723F4B8DB4A');
class App extends Component {
  constructor(props) {
    super(props);
    this.state={
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
componentDidMount(){
  
}
  render() {
    return (
      <div className="App">
       <div>

          {/* <Search></Search> */}
          <Router>
            {/* exact表示绝对匹配 */}
            {/* 在react-router中每一个Route相当于一个组件 */}
            {/* 在传递参数的时候可以设置成 :参数名? 表示可选参数 */}
            {/* Switch表示只匹配一个符合条件的路由 */}
            <Switch>
              {/* <Route path="/about" component={() => <h1>关于我们</h1>} /> */}
              <Route path="/RecNoticeContent" component={Noticedetails} />
              <Route path="/PusNoticeContent" component={Noticedetails} />
              <Route path="/"  exact component={Sidebar} />
              <Route path="/404"   component={() => <h1>页面没找到</h1>} />
              {/* <Route path="/hot_show" component={() => <h1>热映 </h1>} /> */}
              {/* <Route path="/detail/:id" component={() => <h1>详情页</h1>} /> */}
              <Route component={() => <h1>页面没找到</h1>} />
            </Switch>
          </Router>
         
        </div>
        
      </div>
    );
  }
}
export default App;