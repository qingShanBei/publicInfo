import React, { Component } from 'react';
import './scss/Search.scss';
class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            placeholderText: '请输入关键字搜索...'
        };


        this.searchFn = this.searchFn.bind(this);
        this.searchSubmitFn = this.searchSubmitFn.bind(this);
        this.searchonkeydown = this.searchonkeydown.bind(this);
    }
    searchFn(e) {
        this.setState({
            value: e.target.value,
        })
        
        // console.log(e.target.value);
    }
    searchSubmitFn(e){
        this.props.getChildrenMsg(this, this.state.value);
        // console.log( this.state.value);
    }
    searchonkeydown(e){
        
        if(e.nativeEvent.keyCode === 13){ //e.nativeEvent获取原生的事件对像
            this.props.getChildrenMsg(this, this.state.value);
       }
    
        
    }
    componentDidMount() {
        if (this.props.placeholderText) {
            this.setState({
                placeholderText: this.props.placeholderText,
            })
        }
    }
    render() {


        // const { message } = this.props;

        // const { TopVisit,OnlineUsers,SuspiciousLogin,OnlineDiskUsed,GroupFileSpaceUsed } = HeaderSetting;

        // let onlineNum = OnlineDiskUsed?parseInt(OnlineDiskUsed.split('/')[0]):0;

        // let onlineDiskInfo = this.diskSize(onlineNum);

        // let groupNum = GroupFileSpaceUsed?parseInt(GroupFileSpaceUsed.split('/')[0]):0;

        // let groupInfo = this.diskSize(groupNum);

        return (
            <div className="search-div" >
                <input className="search-input" placeholder={this.state.placeholderText} value={this.state.value} onChange={(event) => { this.searchFn(event)  }} onKeyPress={(event) => { this.searchonkeydown(event)  }}  />
                <i className="search-img" onClick={(event) => { this.searchSubmitFn(event) }} ></i>
            </div>

        )

    }

}

export default Search;