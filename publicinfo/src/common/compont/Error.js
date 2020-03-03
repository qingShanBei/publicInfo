
import React, { Component } from 'react';
import '../scss/Error.scss';
class Error extends Component {
    render() {

        return (
            <div className="frame_radial_bg">
                <div className="frame_error_tips_container">
                    <div className="frame_error_tips_block">
                        <p className="frame_error_tips_title">页面访问出错！</p>
                        <p className="frame_error_tips_reason">错误详情:
                        您没有本页面的访问权限，如需访问，请联系管理员！</p>
                        <p className="frame_error_tips_code">错误代码:
                        E011</p>

                    </div>
                </div>
            </div>
        );
    }
}
export default Error;