import React, { Component } from 'react';
import { Upload, Icon, message, Modal, Radio, Select, Checkbox } from 'antd';
import './scss/AddQueTopic.scss';
import { getData, postData, GUID } from '../../common/js/fetch';
import $ from 'jquery';
import { Player } from 'video-react';

import "../../../node_modules/video-react/dist/video-react.css";
// import './scss/index.scss';
const   BYTES_PER_SLICE= 1024 * 1024;
const RadioGroup = Radio.Group;
const { Option } = Select;
function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}
class AddQueTopic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            QtnTopicOption: [{ OptionID: '', OptionContent: '', IsBlank: 0, OptionImgPath: '', OrderNO: 1 }, { OptionID: '', OptionContent: '', IsBlank: 0, OptionImgPath: '', OrderNO: 2 }, { OptionID: '', OptionContent: '', IsBlank: 0, OptionImgPath: '', OrderNO: 3 }, { OptionID: '', OptionContent: '', IsBlank: 0, OptionImgPath: '', OrderNO: 4 }],
            TopicContent: '',
            previewVisible: false,
            previewImage: '',
            fileList: [],
            AttachmentID: '',
            AttachmentUrl: '',
            AttachmentName: '',
            AttachmentSize: '',
            fileType: '',
            IsImgOption: '0',
            TopicType: '1',
            MaxOptionCount: 2,
            OptionCountPerRow: '1',
            visible: false,
            fileViewUrl: '',
            IsMustAnswer: 1,
            Initializate: true,
            IsImgOptionArr: [{ 'text': '', 'url': '' }],
            Radiochoose: 1,

        }
        this.ChangeIsImgOption = this.ChangeIsImgOption.bind(this);
        this.ChangeTopicType = this.ChangeTopicType.bind(this);
        this.ChangeMaxOptionCount = this.ChangeMaxOptionCount.bind(this);
        this.ChangeOptionCountPerRow = this.ChangeOptionCountPerRow.bind(this);
        this.ChangeIsMustAnswer = this.ChangeIsMustAnswer.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleCancel1 = this.handleCancel1.bind(this);
        this.handleOk = this.handleOk.bind(this);


    }
    // handleCancel = () => this.setState({ previewVisible: false });

    // handlePreview = async file => {
    //     if (!file.url && !file.preview) {
    //         file.preview = await getBase64(file.originFileObj);
    //     }

    //     this.setState({
    //         previewImage: file.url || file.preview,
    //         previewVisible: true,
    //     });
    // };



    ChangeIsImgOption(value) {
        this.setState({
            IsImgOption: value
        })
    }
    ChangeTopicType(value) {
        console.log(value)
        if (value == 2) {
            if (this.state.MaxOptionCount < 2 || this.state.MaxOptionCount > this.state.QtnTopicOption.length) {
                this.setState({
                    MaxOptionCount: 2
                })
            }
        }
        this.setState({
            TopicType: value
        })
    }
    ChangeMaxOptionCount(value) {
        console.log(value)
        this.setState({
            MaxOptionCount: value
        })
    }
    ChangeIsMustAnswer(e) {
        // console.log(e.target.value)
        this.setState({
            IsMustAnswer: e.target.value
        })
    }
    ChangeOptionCountPerRow(value) {
        this.setState({
            OptionCountPerRow: value
        })
    }

    ChangeTopicContent(e) {
        this.setState({
            TopicContent: e.target.value
        })
    }
    handleOk() {
        if (!this.state.TopicContent) {
            message.warning('题目不能为空~', 1.5);
            return;
        }
        let data = {};
        data.TopicContent = this.state.TopicContent;
        // console.log(this.props.Data.TopicType,111);
        if (this.props.AddType === 2 || this.props.Data.TopicType == 3) {
            data.TopicType = 3;
        } else {
            if (this.state.IsImgOption == 0) {
                let isnull = false;
                this.state.QtnTopicOption.map((item, idx) => {
                    if (!item.OptionContent && !isnull) {
                        message.warning(String.fromCharCode(idx + 65) + '选项不能为空~', 1.5);
                        isnull = true;
                    }
                })
                if (isnull) {
                    return
                }
            } else {
                if (this.state.IsImgOptionArr.length < 3) {
                    message.warning('图片选项不能少于两个', 1.5);
                    return
                }

            }
            data.TopicType = this.state.TopicType * 1;
        }
        data.IsImgOption = this.state.IsImgOption * 1;
        data.MaxOptionCount = this.state.MaxOptionCount * 1;
        data.IsMustAnswer = this.state.IsMustAnswer * 1;
        data.OptionCountPerRow = this.state.OptionCountPerRow * 1;
        data.OrderNO = '';
        data.TopicID = '';
        data.QtnTopicAttachment = this.state.fileList;
        if (this.state.IsImgOption == 1) {
            let QtnTopicOption = [];
            this.state.IsImgOptionArr.map((item, idx) => {
                if (item.url) {
                    QtnTopicOption.push({ OptionID: '', OptionContent: item.text, IsBlank: 0, OptionImgPath: item.url, OrderNO: idx + 1 })
                }
            })
            data.QtnTopicOption = QtnTopicOption;

        } else {
            data.QtnTopicOption = this.state.QtnTopicOption;
        }
        // console.log(data);
        this.props.AddQueTopic(data);
        this.Initialization();
    }
    changeOptionContent(e, idx) {
        let QtnTopicOption = this.state.QtnTopicOption;
        QtnTopicOption[idx].OptionContent = e.target.value;
        this.setState({
            QtnTopicOption: QtnTopicOption,
        })
    }
    uploadFile(slice, index, fileName, formID, file, fileType, json, guid) {
        let $this = this;
        $this.setState({
            isupload: 'true',
        })
        if (!guid) {
            guid = new GUID().newGUID();
        }
         let formData = new FormData();
        // let formData = new FormData($('#' + formID)[0]);
                let diskName = 'Que/Attachment/' + json.Data.ServerDate.slice(0, 4) + json.Data.ServerDate.slice(5, 7);
                formData.append('method', 'doUpload_WholeFile');
                formData.append('guid', guid);
                formData.append('name', file.name);
                formData.append('id', '');
                let type='';
                if(fileType=='mp4'){
                    type='video/mp4';
                }else if(fileType=='mp3'){
                    type='audio/mp3';
                }else{
                    type='image/'+fileType; 
                }
                formData.append('type', type);
                formData.append('lastModifiedDate', file.lastModifiedDate);
                formData.append('diskName', diskName);
                formData.append('size', file.size);

        // let formData = new FormData();
        // let diskName = 'Que/Attachment/' + json.Data.ServerDate.slice(0, 4) + json.Data.ServerDate.slice(5, 7);
        // formData.append('userid', sessionStorage.getItem('UserID'));
        // formData.append('method', 'doUpload_Mobile');
        // formData.append('guid', guid);
        // formData.append('suffix', fileType);
        // // formData.append('id', '');
        // // formData.append('type', '');
        formData.append('chunk', $this.state.hasSendNum );
        formData.append('chunks', this.state.totalSlices);
        // formData.append('strFileBinary', slice);
        // // formData.append('lastModifiedDate', file.lastModifiedDate);
        // formData.append('diskName', diskName);
        // formData.append('size', file.size);
        formData.append('file', slice);
        $.ajax({
            url: json.Data.ResourceServerAddr + 'PsnInfo_WebUploadHandler.ashx',
            type: 'POST',
            cache: false,
            data: formData,
            //dataType: 'json',
            //async: false,
            processData: false,
            contentType: false,
        }).done(function (res) {
            // console.log($this.state.hasSendNum);
            $this.setState({
                hasSendNum: $this.state.hasSendNum
            }, () => {
                if (index == $this.state.totalSlices) {
                    let fileList = $this.state.fileList;
                    $this.setState({
                        isupload: false,
                    })
                    message.success('上传成功~');
                    if (fileType === 'mp4') {
                        fileList.push({
                            AttachmentID: guid,
                            AttachmentType: 3,
                            AttachmentUrl: diskName + '/' + guid + file.name.slice(file.name.lastIndexOf('.'), file.name.length),
                            OrderNO: $this.state.fileList.length + 1,
                        })
                        $this.setState({
                            fileList: fileList,
                            fileType: fileType,
                        })

                    } else if (fileType === 'mp3') {
                        fileList.push({
                            AttachmentID: guid,
                            AttachmentType: 2,
                            AttachmentUrl: diskName + '/' + guid + file.name.slice(file.name.lastIndexOf('.'), file.name.length),
                            OrderNO: $this.state.fileList.length + 1,
                        })
                        $this.setState({
                            fileList: fileList,
                            fileType: fileType,
                        })
                    }else {
                        fileList.push({
                            AttachmentID: guid,
                            AttachmentType: 1,
                            AttachmentUrl: diskName + '/' + guid + file.name.slice(file.name.lastIndexOf('.'), file.name.length),
                            OrderNO: $this.state.fileList.length + 1,
                        })
                        $this.setState({
                            fileList: fileList,
                            fileType: 'img',
                        })



                    }
                } else {
                    $this.setState({
                        hasSendNum: $this.state.hasSendNum + 1
                    }, () => {
                        // console.log(index);
                       
                        // console.log(index*BYTES_PER_SLICE);
                        let end= index*BYTES_PER_SLICE+BYTES_PER_SLICE;
                        if(index*BYTES_PER_SLICE+BYTES_PER_SLICE>=file.size){
                            end=file.size
                        }
                         slice = file.slice(index*BYTES_PER_SLICE,end);
                        //  console.log(end);
                        // console.log($this.state.hasSendNum);
                        index =index+1;
                        $this.uploadFile(slice, index, fileName, formID, file, fileType, json, guid)
                    })
                }
            })


        }).fail(function (res) {

            message.error('上传失败~');
        });





    }

    formDataRemind(e, formID) {
        let $this = this;
        let file = $('#' + e.target.id)[0].files[0];
        if (!file) {
            $this.setState({
                AttachmentID: '',
                AttachmentUrl: '',
                AttachmentName: '',
                AttachmentSize: '',
            })
            $('#' + e.target.id).val('');
            return;
        }
        let fileType = file.name.slice(file.name.lastIndexOf('.') + 1, file.name.length);
        if (fileType != 'mp3' && fileType != 'mp4' && file.size > 1024 * 10240) {
            message.error('上传图片文件不能大于10MB~');
            $this.setState({
                AttachmentID: '',
                AttachmentUrl: '',
                AttachmentName: '',
                AttachmentSize: '',
            })
            $('#' + e.target.id).val('');
            return;
        }

        // let fileType = file.name.slice(file.name.lastIndexOf('.') + 1, file.name.length);

        let uploadType = ['jpg', 'jpeg', 'png', 'bmp', 'gif', 'mp3', 'mp4'];
        if (this.state.fileType === 'img') {
            uploadType = ['jpg', 'jpeg', 'png', 'bmp', 'gif'];
        }
        if (uploadType.indexOf(fileType) === -1) {
            message.error('上传文件格式不正确~');
            $this.setState({
                AttachmentID: '',
                AttachmentUrl: '',
                AttachmentName: '',
                AttachmentSize: '',
            })
            $('#' + e.target.id).val('');
            return;
        }
        if (fileType == 'mp3' && file.size > 1024 * 10240 * 2) {
            message.error('上传音频文件不能大于20MB~');
            $('#' + e.target.id).val('');
            return;
        } if (fileType == 'mp4' && file.size > 1024 * 10240 * 5) {
            message.error('上传视频文件不能大于50MB~');
            $('#' + e.target.id).val('');
            return;
        }
        if (file.size>1024 * 1024*4) {
            this.setState({
                totalSize: file.size,
                fileName: file.name,
                hasSendNum: 0,
                totalSlices: Math.ceil(file.size / 1024 / 1024),
            })
            let slice = file.slice(0, BYTES_PER_SLICE);//切割文件
            getData('PublicInfo/GetServerInfo', {},
            ).then((res) => {
                return res.json();
            }).then((json) => {
                if (json.StatusCode === 200) {
                    this.uploadFile(slice, this.state.hasSendNum + 1, this.state.fileName, formID, file, fileType, json);
                }
            })
            return;
        }
        $this.setState({
            isupload: 'true',
        })
        getData('PublicInfo/GetServerInfo', {},
        ).then((res) => {
            return res.json();
        }).then((json) => {
            if (json.StatusCode === 200) {
                let guid = new GUID().newGUID();
                let formData = new FormData($('#' + formID)[0]);
                let diskName = 'Que/Attachment/' + json.Data.ServerDate.slice(0, 4) + json.Data.ServerDate.slice(5, 7);
                formData.append('method', 'doUpload_WholeFile');
                formData.append('guid', guid);
                formData.append('name', file.name);
                formData.append('id', '');
                formData.append('type', '');
                formData.append('lastModifiedDate', file.lastModifiedDate);
                formData.append('diskName', diskName);
                formData.append('size', file.size);
                // formData.append('file', file);
                $.ajax({
                    url: json.Data.ResourceServerAddr + 'PsnInfo_WebUploadHandler.ashx',
                    type: 'POST',
                    cache: false,
                    data: formData,
                    //dataType: 'json',
                    //async: false,
                    processData: false,
                    contentType: false,
                }).done(function (res) {
                    let fileList = $this.state.fileList;
                    message.success('上传成功~');
                    if (fileType === 'mp4') {
                        fileList.push({
                            AttachmentID: guid,
                            AttachmentType: 3,
                            AttachmentUrl: diskName + '/' + guid + file.name.slice(file.name.lastIndexOf('.'), file.name.length),
                            OrderNO: $this.state.fileList.length + 1,
                        })
                        $this.setState({
                            fileList: fileList,
                            fileType: fileType,
                        })

                    } else if (fileType === 'mp3') {
                        fileList.push({
                            AttachmentID: guid,
                            AttachmentType: 2,
                            AttachmentUrl: diskName + '/' + guid + file.name.slice(file.name.lastIndexOf('.'), file.name.length),
                            OrderNO: $this.state.fileList.length + 1,
                        })
                        $this.setState({
                            fileList: fileList,
                            fileType: fileType,
                        })
                    } else {
                        fileList.push({
                            AttachmentID: guid,
                            AttachmentType: 1,
                            AttachmentUrl: diskName + '/' + guid + file.name.slice(file.name.lastIndexOf('.'), file.name.length),
                            OrderNO: $this.state.fileList.length + 1,
                        })
                        $this.setState({
                            fileList: fileList,
                            fileType: 'img',
                        })
                    }

                }).fail(function (res) {
                    message.error('上传失败~');
                });
            } else {
                message.error(json.Msg, 3);
                $this.setState({
                    isupload: false,
                })
            }

        })
        // let imgName = ['jpg','jpeg','png','bmp','gif'];
        // if(imgName.indexOf(file.name.slice(file.name.lastIndexOf('.')+1,file.name.length))!=-1&&file.size>1024*2048){
        //     message.error('上传图片不能大于2MB~');
        //     $this.setState({
        //         AttachmentID: '',
        //         AttachmentUrl: '',
        //         AttachmentName:'',
        //         AttachmentSize: '',
        //     })
        //     $('#file').val('');
        //     return;
        // }


    }

    formDataRemind66(e, formID, num) {
        let $this = this;
        if (!num) {
            num = 0;
        }
        let fileLength = $('#file66')[0].files.length;
        let ele = e;
        let file = $('#file66')[0].files[num];
        console.log(file);
        if (!file) {
            $this.setState({
                AttachmentID: '',
                AttachmentUrl: '',
                AttachmentName: '',
                AttachmentSize: '',
            })
            $('#file66').val('');
            return;
        }
        if (file.size > 1024 * 10240) {
            message.error('上传文件不能大于10MB~');
            $this.setState({
                AttachmentID: '',
                AttachmentUrl: '',
                AttachmentName: '',
                AttachmentSize: '',
            })
            $('#file66').val('');
            return;
        }
        let fileType = file.name.slice(file.name.lastIndexOf('.') + 1, file.name.length);

        let uploadType = ['jpg', 'jpeg', 'png', 'bmp', 'gif', 'mp3', 'mp4'];
        if (this.state.fileType === 'img') {
            uploadType = ['jpg', 'jpeg', 'png', 'bmp', 'gif'];
        }
        if (uploadType.indexOf(fileType) === -1) {
            message.error('上传文件格式不正确~');
            $this.setState({
                AttachmentID: '',
                AttachmentUrl: '',
                AttachmentName: '',
                AttachmentSize: '',
            })
            $('#file66').val('');
            return;
        }
        $this.setState({
            isupload: 'true',
        })
        getData('PublicInfo/GetServerInfo', {},
        ).then((res) => {
            return res.json();
        }).then((json) => {
            if (json.StatusCode === 200) {
                let guid = new GUID().newGUID();
                let formData = new FormData($('#' + formID)[0]);
                let diskName = 'Que/Attachment/' + json.Data.ServerDate.slice(0, 4) + json.Data.ServerDate.slice(5, 7);
                formData.append('method', 'doUpload_WholeFile');
                formData.append('guid', guid);
                formData.append('name', file.name);
                formData.append('id', '');
                formData.append('type', '');
                formData.append('lastModifiedDate', file.lastModifiedDate);
                formData.append('diskName', diskName);
                formData.append('size', file.size);
                formData.append('file', file);
                $.ajax({
                    url: json.Data.ResourceServerAddr + 'PsnInfo_WebUploadHandler.ashx',
                    type: 'POST',
                    cache: false,
                    data: formData,
                    //dataType: 'json',
                    //async: false,
                    processData: false,
                    contentType: false,
                }).done(function (res) {
                    // $this.setState({
                    //     AttachmentID: guid,
                    //     AttachmentUrl: diskName + '/' + guid + file.name.slice(file.name.lastIndexOf('.'), file.name.length),
                    //     AttachmentName: file.name,
                    //     AttachmentSize: file.size,
                    //     isupload: false,
                    // })
                    let fileList = $this.state.fileList;
                    // $this.setState({
                    //     fileList: fileList,
                    // })
                    // message.success('上传成功~');

                    let IsImgOptionArr = [];
                    IsImgOptionArr = $this.state.IsImgOptionArr;
                    IsImgOptionArr[IsImgOptionArr.length - 1].url = diskName + '/' + guid + file.name.slice(file.name.lastIndexOf('.'), file.name.length);
                    if (IsImgOptionArr.length < 6) {
                        IsImgOptionArr.push({ 'text': '', 'url': '' });
                    }
                    $this.setState({
                        IsImgOptionArr: IsImgOptionArr,

                    })
                    if (IsImgOptionArr.length === 6 && IsImgOptionArr[5].url !== '') {
                        return;
                    }
                    if (num < fileLength - 1) {
                        num++;
                        $this.formDataRemind66(ele, formID, num);
                    } else {
                        // console.log(IsImgOptionArr);
                    }
                    return;
                }).fail(function (res) {
                    message.error('上传失败~');
                });
            } else {
                message.error(json.Msg, 3);
                $this.setState({
                    isupload: false,
                })
            }
        })
        // let imgName = ['jpg','jpeg','png','bmp','gif'];
        // if(imgName.indexOf(file.name.slice(file.name.lastIndexOf('.')+1,file.name.length))!=-1&&file.size>1024*2048){
        //     message.error('上传图片不能大于2MB~');
        //     $this.setState({
        //         AttachmentID: '',
        //         AttachmentUrl: '',
        //         AttachmentName:'',
        //         AttachmentSize: '',
        //     })
        //     $('#file').val('');
        //     return;
        // }


    }
    fileDel(idx) {
        let $this = this;
        $.ajax({
            url: sessionStorage.getItem('ResourceServerAddr') + '/PsnInfo_WebUploadHandler.ashx',
            type: 'POST',
            // cache: false,
            data: {
                method: 'doDelete',
                params: $this.state.fileList[idx].AttachmentUrl,
            },
            //dataType: 'json',
            //async: false,
            // processData: false,
            // contentType: false,
        }).done(function (res) {
            let fileList = $this.state.fileList;
            fileList.splice(idx, 1);
            $this.setState({
                fileList: fileList
            })
            if (fileList.length === 0) {
                $this.setState({
                    fileType: ''
                })
            }
            // message.success('删除成功~');
        }).fail(function (res) {

            message.error('删除失败~');
        });
    }
    optionAdd(idx) {
        let QtnTopicOption = this.state.QtnTopicOption;
        QtnTopicOption.splice(idx + 1, 0, { OptionID: '', OptionContent: '', IsBlank: 0, OptionImgPath: '', OrderNO: QtnTopicOption.length + 1 })
        for (let i = 0; i < QtnTopicOption.length; i++) {
            QtnTopicOption[i].OrderNO = i + 1
        }
        this.setState({
            QtnTopicOption: QtnTopicOption
        })

    }
    optionDel(idx) {
        let QtnTopicOption = this.state.QtnTopicOption;
        QtnTopicOption.splice(idx, 1);
        for (let i = 0; i < QtnTopicOption.length; i++) {
            QtnTopicOption[i].OrderNO = i + 1
        }
        this.setState({
            QtnTopicOption: QtnTopicOption
        })

    }
    optionUp(id) {
        let QtnTopicOption = [];
        let QtnTopicOption1 = this.state.QtnTopicOption;
        QtnTopicOption1.map((item, idx) => {
            if (idx === id - 1) {
                QtnTopicOption.push(QtnTopicOption1[id]);
            } else if (idx === id) {
                QtnTopicOption.push(QtnTopicOption1[id - 1]);
            } else {
                QtnTopicOption.push(item);
            }
        })
        for (let i = 0; i < QtnTopicOption.length; i++) {
            QtnTopicOption[i].OrderNO = i + 1
        }
        this.setState({
            QtnTopicOption: QtnTopicOption
        })

    }
    optionDown(id) {
        let QtnTopicOption = [];
        let QtnTopicOption1 = this.state.QtnTopicOption;
        //    console.log(QtnTopicList1);
        QtnTopicOption1.map((item, idx) => {

            if (idx === id) {
                QtnTopicOption.push(QtnTopicOption1[id + 1]);
            } else if (idx === id + 1) {
                QtnTopicOption.push(QtnTopicOption1[id]);
            } else {
                QtnTopicOption.push(item);
            }

        })
        for (let i = 0; i < QtnTopicOption.length; i++) {
            QtnTopicOption[i].OrderNO = i + 1
        }
        this.setState({
            QtnTopicOption: QtnTopicOption,
        })
    }
    CHangeIsBlank(idx) {
        let QtnTopicOption = this.state.QtnTopicOption;
        if (QtnTopicOption[idx].IsBlank === 0) {
            QtnTopicOption[idx].IsBlank = 1;
        } else {
            QtnTopicOption[idx].IsBlank = 0;
        }
        this.setState({
            QtnTopicOption: QtnTopicOption
        })
    }
    handleCancel1() {
        this.setState({
            visible: false
        })
    }
    imgView(idx) {
        this.setState({
            fileViewUrl: sessionStorage.getItem('ResourceServerAddr') + this.state.fileList[idx].AttachmentUrl,
            visible: true,
        })
    }
    handleCancel() {
        this.props.closeAdd();
        this.Initialization();
    }
    Initialization() {
        this.setState(
            {
                QtnTopicOption: [{ OptionID: '', OptionContent: '', IsBlank: 0, OptionImgPath: '', OrderNO: 1 }, { OptionID: '', OptionContent: '', IsBlank: 0, OptionImgPath: '', OrderNO: 2 }, { OptionID: '', OptionContent: '', IsBlank: 0, OptionImgPath: '', OrderNO: 3 }, { OptionID: '', OptionContent: '', IsBlank: 0, OptionImgPath: '', OrderNO: 4 }],
                TopicContent: '',
                previewVisible: false,
                previewImage: '',
                fileList: [],
                AttachmentID: '',
                AttachmentUrl: '',
                AttachmentName: '',
                AttachmentSize: '',
                fileType: '',
                IsImgOption: '0',
                TopicType: '1',
                MaxOptionCount: 2,
                OptionCountPerRow: '1',
                visible: false,
                fileViewUrl: '',
                IsMustAnswer: 1,
                Initializate: true,
                IsImgOptionArr: [{ 'text': '', 'url': '' }],
                Radiochoose: 1,
            }
        )
    }
    static getDerivedStateFromProps(props, current_state) {

        // console.log(props.NoticeMain,current_state.NoticeMain );
        if (props.AddType === 4 && current_state.Initializate && props.visible) {

            // if( props.Data.TopicType===3){
            //     props.AddType=3;
            // }else{
            //     props.AddType=1;
            // }
            if (props.Data.QtnTopicAttachment.length > 0) {
                if (props.Data.QtnTopicAttachment[0].AttachmentUrl.indexOf('http://') > -1) {
                    props.Data.QtnTopicAttachment.map((item, idx) => {
                        // console.log(item)
                        props.Data.QtnTopicAttachment[idx].AttachmentUrl = item.AttachmentUrl.slice(sessionStorage.getItem('ResourceServerAddr').length, item.AttachmentUrl.length)
                    })
                }
            }
            let IsImgOptionArr=[{ 'text': '', 'url': '' }];
            if(props.Data.IsImgOption==1){
                IsImgOptionArr=[];
              
                    props.Data.QtnTopicOption.map((item,idx)=>{
                        IsImgOptionArr.push({ 'text': item.OptionContent, 'url': item.OptionImgPath });
                    })
                    if(IsImgOptionArr.length<6){
                        IsImgOptionArr.push({ 'text': '', 'url': '' });
                    }
            }
            // console.log(props.Data);
            return {
                Initializate: false,
                QtnTopicOption: props.Data.QtnTopicOption,
                TopicContent: props.Data.TopicContent,
                previewVisible: false,
                previewImage: '',
                fileList: props.Data.QtnTopicAttachment,
                fileType: props.Data.QtnTopicAttachment.length > 0 ? props.Data.QtnTopicAttachment[0].AttachmentType === 1 ? 'img' : props.Data.QtnTopicAttachment[0].AttachmentType === 2 ? 'mp3' : 'mp4' : '',
                IsImgOption: props.Data.IsImgOption,
                TopicType: props.Data.TopicType,
                MaxOptionCount: props.Data.MaxOptionCount,
                OptionCountPerRow: props.Data.OptionCountPerRow,
                visible: false,
                fileViewUrl: '',
                IsMustAnswer: props.Data.IsMustAnswer,
                Radiochoose: props.Data.IsMustAnswer,
                IsImgOptionArr: IsImgOptionArr
            }
        }

        return null
    }
    closeIsoption(idx) {
        let IsImgOptionArr = [];
        IsImgOptionArr = this.state.IsImgOptionArr;
        IsImgOptionArr.splice(idx, 1);
        if (IsImgOptionArr[IsImgOptionArr.length - 1].url) {
            IsImgOptionArr.push({ 'text': '', 'url': '' });
        }
        for (let i = 0; i < IsImgOptionArr.length; i++) {
            IsImgOptionArr[i].OrderNO = i + 1
        }
        this.setState({
            IsImgOptionArr: IsImgOptionArr
        })
    }
    ChangeIsImgtext(e, idx) {
        let IsImgOptionArr = [];
        IsImgOptionArr = this.state.IsImgOptionArr;
        IsImgOptionArr[idx].text = e.target.value;
        this.setState({
            IsImgOptionArr: IsImgOptionArr
        })
    }
    ImgOptionUp(num) {
        let IsImgOptionArr = [];
        IsImgOptionArr = this.state.IsImgOptionArr;
        let item1 = IsImgOptionArr[num];
        IsImgOptionArr[num] = IsImgOptionArr[num - 1];
        IsImgOptionArr[num - 1] = item1;
        for (let i = 0; i < IsImgOptionArr.length; i++) {
            IsImgOptionArr[i].OrderNO = i + 1
        }
        this.setState({
            IsImgOptionArr: IsImgOptionArr
        })

    }
    ImgOptionDown(num) {
        let IsImgOptionArr = [];
        IsImgOptionArr = this.state.IsImgOptionArr;
        let item1 = IsImgOptionArr[num];
        IsImgOptionArr[num] = IsImgOptionArr[num + 1];
        IsImgOptionArr[num + 1] = item1;
        for (let i = 0; i < IsImgOptionArr.length; i++) {
            IsImgOptionArr[i].OrderNO = i + 1
        }
        this.setState({
            IsImgOptionArr: IsImgOptionArr
        })

    }

   

    render() {
        

        return (
            <Modal
                className='Add-que-Topic'
                title="添加选择题"
                visible={this.props.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                width='851px'
                okText='确认'
                destroyOnClose={true}
                centered={true}
                // style={{'position':'relative'}}
            // mask={false}
            >
                <div>
                    <div className='Add-que-title'>
                        <span className='title-span'>题目:</span>
                        <textarea name="" id="" cols="100" rows="4" maxLength="200" placeholder='最多输入200字...' value={this.state.TopicContent} onChange={(e) => { this.ChangeTopicContent(e) }}></textarea>
                        <span className='title-length'>{this.state.TopicContent.length}/200</span>
                    </div>
                    <form id="uploadImg">
                        {this.state.fileList.length === 1 && this.state.fileType === 'mp4' ? <span><i className='video-bg'><i className='video-open' onClick={() => { this.setState({ visible: true }) }}></i></i><i className='file-close' onClick={() => { this.fileDel(0) }}></i></span> : ''}
                        {this.state.fileList.length === 1 && this.state.fileType === 'mp3' ? <span><i className='audio-bg'><i className='video-open' onClick={() => { this.setState({ visible: true }) }}></i></i><i className='file-close' onClick={() => { this.fileDel(0) }}></i></span> : ''}
                        {this.state.fileList.length > 0 && this.state.fileType === 'img' ? <span><img className='upload-file' src={sessionStorage.getItem('ResourceServerAddr') + this.state.fileList[0].AttachmentUrl} alt="  " onClick={() => { this.imgView(0) }} /> <i className='file-close' onClick={() => { this.fileDel(0) }}></i></span> : ''}
                        <i></i>
                        {this.state.fileList.length > 0 ? '' : <div className='add-img' onClick={() => { $('#file').click() }}> </div>}
                        <input name="file" type="file" id="file" onChange={(e) => { this.formDataRemind(e, 'uploadImg') }} />
                    </form>
                    <form id="uploadImg1">
                        {this.state.fileList.length > 1 ? <span><img className='upload-file' src={sessionStorage.getItem('ResourceServerAddr') + this.state.fileList[1].AttachmentUrl} alt="  " onClick={() => { this.imgView(1) }} /> <i className='file-close' onClick={() => { this.fileDel(1) }}></i></span> : ''}
                        <i></i>
                        {(this.state.fileList.length === 0 || this.state.fileList.length === 1) && (this.state.fileType === 'img' || this.state.fileType === '') ? <div className={this.state.fileList.length > 0 ? 'add-img' : 'add-autio'} onClick={() => { $('#file1').click() }}></div> : ''}
                        <input name="file" type="file" id="file1" onChange={(e) => { this.formDataRemind(e, 'uploadImg1') }} />
                    </form>
                    <form id="uploadImg2">
                        {this.state.fileList.length > 2 ? <span><img className='upload-file' src={sessionStorage.getItem('ResourceServerAddr') + this.state.fileList[2].AttachmentUrl} alt="  " onClick={() => { this.imgView(2) }} /> <i className='file-close' onClick={() => { this.fileDel(2) }}></i></span> : ''}
                        <i></i>
                        {this.state.fileList.length === 0 || this.state.fileList.length === 2 ? <div className={this.state.fileList.length > 0 ? 'add-img' : 'add-video'} onClick={() => { $('#file2').click() }}></div> : ''}
                        <input name="file" type="file" id="file2" onChange={(e) => { this.formDataRemind(e, 'uploadImg2') }} />
                    </form>
                    <form id="uploadImg3">
                        {this.state.fileList.length > 3 ? <span><img className='upload-file' src={sessionStorage.getItem('ResourceServerAddr') + this.state.fileList[3].AttachmentUrl} alt="  " onClick={() => { this.imgView(3) }} /> <i className='file-close' onClick={() => { this.fileDel(3) }}></i></span> : ''}
                        <i></i>
                        {this.state.fileList.length === 3 ? <div className='add-img' onClick={() => { $('#file3').click() }}></div> : ''}
                        <input name="file" type="file" id="file3" onChange={(e) => { this.formDataRemind(e, 'uploadImg3') }} />
                    </form>
                    <form id="uploadImg4">
                        {this.state.fileList.length > 4 ? <span><img className='upload-file' src={sessionStorage.getItem('ResourceServerAddr') + this.state.fileList[4].AttachmentUrl} alt="  " onClick={() => { this.imgView(4) }} /> <i className='file-close' onClick={() => { this.fileDel(4) }}></i></span> : ''}
                        <i></i>
                        {this.state.fileList.length === 4 ? <div className='add-img' onClick={() => { $('#file4').click() }}></div> : ''}
                        <input name="file" type="file" id="file4" onChange={(e) => { this.formDataRemind(e, 'uploadImg4') }} />
                    </form>
                    <form id="uploadImg5">
                        {this.state.fileList.length > 5 ? <span><img className='upload-file' src={sessionStorage.getItem('ResourceServerAddr') + this.state.fileList[5].AttachmentUrl} alt="  " onClick={() => { this.imgView(5) }} /> <i className='file-close' onClick={() => { this.fileDel(5) }}></i></span> : ''}

                        {this.state.fileList.length === 5 ? <div className='add-img' onClick={() => { $('#file5').click() }}></div> : ''}
                        <input name="file" type="file" id="file5" onChange={(e) => { this.formDataRemind(e, 'uploadImg5') }} />
                    </form>
                    <br />
                    <div className=' isneed-Tochoose checkbox-choose'><span>是否必答:</span><RadioGroup name="radiogroup" defaultValue={this.state.Radiochoose} onChange={this.ChangeIsMustAnswer} >
                        <Radio
                            value={1}
                        > 是</Radio>
                        <Radio
                            value={2}
                        > 否</Radio>
                    </RadioGroup>  </div>
                </div>
                {this.props.AddType === 1 || (this.props.AddType === 4 && this.state.TopicType !== 3) ? <div className='select-box'>
                    <span>选项属性:</span>
                    {this.props.AddType != 4 ? <Select defaultValue={this.state.IsImgOption + ''} style={{ width: 120 }} onChange={this.ChangeIsImgOption}>
                        <Option value="0">文字选项</Option>
                        <Option value="1">图片选项</Option>

                    </Select> : ''}

                    {this.state.IsImgOption == '0' ? <Select defaultValue={this.state.TopicType + ''} style={{ width: 85 }} onChange={this.ChangeTopicType}>
                        <Option value="1">单选</Option>
                        <Option value="2">多选</Option>


                    </Select> : ''}
                    {this.state.TopicType == '2' && this.state.IsImgOption == '0' ? <span style={{ margin: '0 10px' }}>最多可选:</span> : ''}
                    {this.state.TopicType == '2' && this.state.IsImgOption == '0' ? <Select defaultValue={this.state.MaxOptionCount + ''} style={{ width: 70 }} onChange={this.ChangeMaxOptionCount} >
                        <Option value="2">2个</Option>
                        {this.state.QtnTopicOption.length > 2 ? this.state.QtnTopicOption.map((item, idx) => {
                            if (idx > 1) {
                                return <Option value={idx + 1} key={idx}>{idx + 1}个</Option>
                            }
                        }) : ''}

                    </Select> : ''}
                    <span style={{ margin: '0 10px' }}>每行显示:</span>  <Select defaultValue={this.state.OptionCountPerRow + ''} style={{ width: 70 }} onChange={this.ChangeOptionCountPerRow}>
                        <Option value="1">1个</Option>
                        <Option value="2">2个</Option>
                        <Option value="3">3个</Option>
                        <Option value="4">4个</Option>
                    </Select>
                </div> : ''}
                {this.props.AddType === 1 || (this.props.AddType === 4 && this.state.TopicType !== 3) ? this.state.IsImgOption == 0 ? <div className='choose-One-box'>
                    {this.state.QtnTopicOption.map((item, idx) => {
                        return (
                            <div key={idx}>
                                <span>{String.fromCharCode(idx + 65)}.</span>
                                <input value={item.OptionContent} maxLength={70} type="text" placeholder='请在此输入选项内容...' onChange={(e) => { this.changeOptionContent(e, idx) }} /> <br />
                                <span onClick={() => { this.CHangeIsBlank(idx) }}> <i className={item.IsBlank === 1 ? 'IsBlank' : 'UnIsBlank'}> </i>包含填空 </span>  <span> {idx != this.state.QtnTopicOption.length - 1 ? <span className='one-down' onClick={() => { this.optionDown(idx) }}><i></i>下移</span> : ''} {idx != 0 ? <span className='one-up' onClick={() => { this.optionUp(idx) }} ><i></i>上移</span> : ''} {this.state.QtnTopicOption.length > 2 ? <span className='one-del' onClick={() => { this.optionDel(idx) }}><i></i>删除</span> : ''} {this.state.QtnTopicOption.length < 10 ? <span className='one-add' onClick={() => { this.optionAdd(idx) }}><i></i>添加</span> : ''}</span>
                            </div>
                        )
                    })}
                </div> : <ul className="upload-img-now">
                        {this.state.IsImgOptionArr.length > 0 && this.state.IsImgOptionArr.map((item, idx1) => {
                            return <li style={{ border: item.url ? 'none' : 'solid 2px #bac7d9' }} key={idx1} ><span className='num'>{String.fromCharCode(idx1 + 65)}.</span> {!item.url ? <span className='click-span' onClick={() => { $('#file66').click() }}><b>单次最多上传6张图片~</b> <i className='i1'></i>  <i className='i2'></i></span> : <span> <input placeholder='请输入内容...' value={item.text} onChange={(e) => { this.ChangeIsImgtext(e, idx1) }}></input> <img src={sessionStorage.getItem('ResourceServerAddr') + item.url}></img> <i className='i3' onClick={() => { this.closeIsoption(idx1) }}></i> </span>}
                                {idx1 > 0 && idx1 <= this.state.IsImgOptionArr.length - 3 || (idx1 == 4 && this.state.IsImgOptionArr.length == 6 && this.state.IsImgOptionArr[5].url) ? <span className='ImgOptionMove'> <p onClick={() => { this.ImgOptionUp(idx1) }}> <i></i> 上移</p> <p></p> <p onClick={() => { this.ImgOptionDown(idx1) }}> <i></i>下移</p>   </span> : ''}
                                {idx1 == 0 && this.state.IsImgOptionArr.length > 2 ? <span className='ImgOptionUp ImgOptionDown' onClick={() => { this.ImgOptionDown(idx1) }}>  <i></i> 下移   </span> : ''}
                                {idx1 == 5 && item.url || (idx1 == this.state.IsImgOptionArr.length - 2 && !this.state.IsImgOptionArr[idx1 + 1].url && this.state.IsImgOptionArr.length > 2) ? <span className='ImgOptionUp' onClick={() => { this.ImgOptionUp(idx1) }}>  <i></i>上移   </span> : ''}</li>
                        })}

                    </ul>
                    : ''}

                <form id="uploadImg66" >
                    <input multiple type="file" id="file66" onChange={(e) => { this.formDataRemind66(e, 'uploadImg66') }} />
                </form>
                <Modal
                    className='Add-Topic-view'
                    title="预览"
                    visible={this.state.visible}
                    onCancel={this.handleCancel1}
                    width='700px'
                    footer={null}
                    centered={true}
                    destroyOnClose={true}
                >
                    {this.state.fileList.length > 0 && this.state.fileType === 'img' ? <img src={this.state.fileViewUrl} alt="  " /> : ''}
                    {this.state.fileList.length > 0 && this.state.fileType === 'mp4' ? <Player ref="player" autoPlay videoId="video-1" fluid={false} width={500} height={400}>

                        <source src={this.state.fileList[0].AttachmentUrl.indexOf('http:')==-1?sessionStorage.getItem('ResourceServerAddr') + this.state.fileList[0].AttachmentUrl:this.state.fileList[0].AttachmentUrl} />
                    </Player>
                        : ''}
                    {this.state.fileList.length > 0 && this.state.fileType === 'mp3' ? <audio style={{ margin: '180px' }} src={ this.state.fileList[0].AttachmentUrl.indexOf('http:')==-1?sessionStorage.getItem('ResourceServerAddr') + this.state.fileList[0].AttachmentUrl:this.state.fileList[0].AttachmentUrl} controls></audio> : ''}

                </Modal>
            </Modal>
        )

    }

}

export default AddQueTopic;