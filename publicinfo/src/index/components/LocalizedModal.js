
import React, { Component } from 'react';
import { Modal, Button } from 'antd';
class LocalizedModal extends Component {
    constructor(props) {
        super(props);
        this.state = { visible: this.props.visible };
       
    }
    

    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    hideModal = () => {
        this.setState({
            visible: false,
        });
    };
    
    render() {
       
        return (
            <div>
                {/* <Button type="primary" onClick={this.showModal}>
                    Modal
                </Button> */}
                
            </div>
        );
    }
}
export default LocalizedModal;