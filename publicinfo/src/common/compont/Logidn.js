
import React, { Component } from 'react';
import '../scss/Logidn.scss';
class Logidn extends Component {
    render() {
       
        return (
            <div className="frame_tips_404_container">
            <div className="frame_tips_404_img"></div>
            <div className="frame_tips_404_title">抱歉，找不到您要访问的文件</div>
            <div className="frame_tips_404_desc">
                <p className="frame_tips_404_desc_title">可能原因:</p>
                <p className="frame_tips_404_desc_content">您要查找的资源可能已被删除、已更改名称或者暂时不可用。</p>
            </div>
        </div>
        );
    }
}
export default Logidn;