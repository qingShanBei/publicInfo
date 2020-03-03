import React, { Component } from 'react';
import { Modal, Upload, message, Button, Icon, DatePicker, TimePicker, Spin } from 'antd';
import moment from 'moment';
import './scss/CreateNotice.scss';
import './scss/NewsList.scss';
import { getData, postData, GUID } from '../../common/js/fetch';
import Alert from '../../common/compont/alert_dialog_wrapper';
import $ from 'jquery';
import UEditor from './UEditor';
const format = 'HH:mm';
const BYTES_PER_SLICE = 1024 * 1024;
window.jquery = $;
class CreateNotice extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            time: '12:30',
            noticeTitle: '',
            fileList: [],
            id: '',
            AttachmentID: '',
            AttachmentUrl: '',
            AttachmentName: '',
            AttachmentSize: '',
            isupload: false,
            serverTime: '',
            TemplateList: [],
            NoticeContent: '',
            NoticeMain: 0,
            visible4: false,
            NoticeID: '',
            loading: false,
            ImportClick: false,
            isMouseOut: false,
            isMouseOut1: false,
            isMouseOut2: false,
            Newstype: {newsTypeName:''},
            NewsTypeList: [],
            NewsTypeListIDx: 0,
            TypeName: '',
            message: '是否要删除该类别？',
            isOpen: false,
            NewsTitleImg: ''
        };
        this.createNotice = this.createNotice.bind(this);
        this.clooseType = this.clooseType.bind(this);
        this.formDataRemind = this.formDataRemind.bind(this);

    }
    // hideModal = () => {
    //     this.setState({
    //         visible: false,
    //     });
    // };
    option1Click = () => {
        if (this.state.option1 !== 'notice-create-choose') {
            this.setState({
                option1: 'notice-create-choose',
                option2: 'notice-create-unchoose',
                EffectType: 1,
            });
        }

    }

    option2Click = () => {
        if (this.state.option2 !== 'notice-create-choose') {
            this.setState({
                option2: 'notice-create-choose',
                option1: 'notice-create-unchoose',
                EffectType: 2,

            });
        }

    }
    changeNoticeTitle(e) {
        this.setState({
            noticeTitle: e.target.value
        })
    }





    componentDidMount() {



    }


    uploadFile(uploadType, slice, index, fileName, file, fileType, json, guid) {
        let $this = this;
        
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
        let type = '';
        if (fileType == 'mp4') {
            type = 'video/mp4';
        } else if (fileType == 'mp3') {
            type = 'audio/mp3';
        } else {
            type = 'image/' + fileType;
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
        formData.append('chunk', $this.state.hasSendNum);
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
                    // let fileList = $this.state.fileList;
                    if (uploadType) {
                        // console.log(diskName + '/' + guid + file.name.slice(file.name.lastIndexOf('.'), file.name.length));
                        $this.setState({
                            NewsTitleImg: diskName + '/' + guid + file.name.slice(file.name.lastIndexOf('.'), file.name.length),
                        })
                    } else {
                        $this.setState({
                            isupload: false,
                        })
                        // message.success('上传成功~');
                        $this.setState({
                            AttachmentID: guid,
                            AttachmentUrl: diskName + '/' + guid + file.name.slice(file.name.lastIndexOf('.'), file.name.length),
                            AttachmentName: file.name,
                            AttachmentSize: file.size,
                            isupload: false,
                        })
                        message.success('上传附件成功~');
                    }
                } else {
                    $this.setState({
                        hasSendNum: $this.state.hasSendNum + 1
                    }, () => {
                        // console.log(index);

                        // console.log(index*BYTES_PER_SLICE);
                        let end = index * BYTES_PER_SLICE + BYTES_PER_SLICE;
                        if (index * BYTES_PER_SLICE + BYTES_PER_SLICE >= file.size) {
                            end = file.size
                        }
                        slice = file.slice(index * BYTES_PER_SLICE, end);
                        //  console.log(end);
                        // console.log($this.state.hasSendNum);
                        index = index + 1;
                        $this.uploadFile(uploadType, slice, index, fileName, file, fileType, json, guid)
                    })
                }
            })
        }).fail(function (res) {
            if (uploadType) {
                $this.setState({
                    NewsTitleImg: '',
                })
            } else {
                $this.setState({
                    AttachmentID: '',
                    AttachmentUrl: '',
                    AttachmentName: '',
                    AttachmentSize: '',
                    isupload: false,
                })
                message.error('上传失败~');
            }

        });
    }
    formDataRemind(e, type) {
        let $this = this;
        let file = '';
        let uploadType = [];
        if (type) {
            file = $('#file1')[0].files[0];
            if (!file) {
                $this.setState({
                    NewsTitleImg: '',
                })
                $('#file1').val('');
                return;
            }
            if (file.size > 1024 * 10240) {
                message.error('上传附件不能大于10MB~');
                $this.setState({
                    NewsTitleImg: '',
                })
                $('#file1').val('');
                return;
            }
            uploadType = ['jpg', 'jpeg', 'png'];
            if (uploadType.indexOf(file.name.slice(file.name.lastIndexOf('.') + 1, file.name.length)) === -1) {
                message.error('上传文件格式不正确~');
                $this.setState({
                    NewsTitleImg: '',
                })
                $('#file1').val('');
                return;
            }
        } else {
            file = $('#file')[0].files[0];
            if (!file) {
                $this.setState({
                    AttachmentID: '',
                    AttachmentUrl: '',
                    AttachmentName: '',
                    AttachmentSize: '',
                })
                $('#file').val('');
                return;
            }
            if (file.size > 1024 * 10240) {
                message.error('上传附件不能大于10MB~');
                $this.setState({
                    AttachmentID: '',
                    AttachmentUrl: '',
                    AttachmentName: '',
                    AttachmentSize: '',
                })
                $('#file').val('');
                return;
            }
            uploadType = ['jpg', 'jpeg', 'png', 'bmp', 'gif', 'mp3', 'mp4', 'zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'cab', 'iso', 'mp4', 'mp3', 'txt', 'doc', 'docx', 'docs', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf'];
            if (uploadType.indexOf(file.name.slice(file.name.lastIndexOf('.') + 1, file.name.length)) === -1) {
                message.error('上传文件格式不正确~');
                $this.setState({
                    AttachmentID: '',
                    AttachmentUrl: '',
                    AttachmentName: '',
                    AttachmentSize: '',
                })
                $('#file').val('');
                return;
            }
            $this.setState({
                isupload: 'true',
            })
        }

       
        getData('PublicInfo/GetServerInfo', {},
        ).then((res) => {
            return res.json();
        }).then((json) => {
            if (json.StatusCode === 200) {
                // console.log(json.Data.ServerDate);
                // let guid = new GUID().newGUID();
                // let formData = new FormData($('#uploadImg')[0]);
                // let diskName = 'Notice/Attachment/' + json.Data.ServerDate.slice(0, 4) + json.Data.ServerDate.slice(5, 7);
                // formData.append('method', 'doUpload_WholeFile');
                // formData.append('guid', guid);
                // formData.append('name', file.name);
                // formData.append('id', '');
                // formData.append('type', '');
                // formData.append('lastModifiedDate', file.lastModifiedDate);
                // formData.append('diskName', diskName);
                // formData.append('size', file.size);
                // formData.append('file', file);
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
                        this.uploadFile(type, slice, this.state.hasSendNum + 1, this.state.fileName, file, uploadType, json);
                    }
                })
                return;
                // $.ajax({
                //     url: json.Data.ResourceServerAddr+'PsnInfo_WebUploadHandler.ashx',
                //     type: 'POST',
                //     cache: false,
                //     data: formData,
                //     //dataType: 'json',
                //     //async: false,
                //     processData: false,
                //     contentType: false,
                // }).done(function (res) {
                //     $this.setState({
                //         AttachmentID: guid,
                //         AttachmentUrl: diskName + '/' + guid + file.name.slice(file.name.lastIndexOf('.'), file.name.length),
                //         AttachmentName: file.name,
                //         AttachmentSize: file.size,
                //         isupload: false,
                //     })
                //     message.success('上传附件成功~');
                // }).fail(function (res) {
                //     $this.setState({
                //         AttachmentID: '',
                //         AttachmentUrl: '',
                //         AttachmentName: '',
                //         AttachmentSize: '',
                //         isupload: false,
                //     })
                //     message.error('上传附件失败~');
                // });
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
    uploadDel() {
        let $this = this;
        $.ajax({
            url: sessionStorage.getItem('ResourceServerAddr') + '/PsnInfo_WebUploadHandler.ashx',
            type: 'POST',
            // cache: false,
            data: {
                method: 'doDelete',
                params: this.state.AttachmentUrl,
            },
            //dataType: 'json',
            //async: false,
            // processData: false,
            // contentType: false,
        }).done(function (res) {
            $this.setState({
                AttachmentID: '',
                AttachmentUrl: '',
                AttachmentName: '',
                AttachmentSize: '',
                isupload: false,
            })
            $('#file').val('');
            message.success('附件删除成功~');
        }).fail(function (res) {
            $('#file').val('');
            message.error('附件删除失败~');
        });
    }
    createNotice() {
        var $this = this;
        if (!this.state.noticeTitle) {
            message.error('新闻标题不能为空~');
            let count = 0;
            let timer = setInterval(() => {
                count++;
                setTimeout(() => {
                    if (count === 3) {
                        clearInterval(timer);
                    }

                    $('.notice-create-title').focus();
                }, 200);
                $('.notice-create-title').blur();
            }, 400);
            return;
        }
        if (!this.state.Newstype.newsTypeName) {
            message.error('新闻类型不能为空~');
            let count = 0;
            let timer = setInterval(() => {
                count++;
                setTimeout(() => {
                    if (count === 3) {
                        clearInterval(timer);
                        $('.div-select').css('border', 'solid 1px #bac7d9');
                        return;
                    }
                    $('.div-select').css('border', 'solid 2px #bac7d9');
                }, 200);
                $('.div-select').css('border', 'solid 2px #1890ff');

            }, 400);
            return;
        }
        if (window.UE.getEditor('editor').getContent()) {

        } else {
            message.error('新闻内容不能为空');
            return
        }
        // console.log(this.state.Newstype.userTypeStr);
        postData('PublicInfo/News/CreateNews/PublishNews', {
            // UserID: sessionStorage.getItem('UserID'),
            UserTypeStr:this.state.Newstype.userTypeStr,
            SchoolID: sessionStorage.getItem('SchoolID'),
            UserType: sessionStorage.getItem('UserType'),
            NewsTitle: this.state.noticeTitle,
            NewsContent: window.UE.getEditor('editor').getContent(),
            NewsCoverPath: this.state.NewsTitleImg,
            NewsTypeName:this.state.Newstype.newsTypeName,
            PublisherID: sessionStorage.getItem('UserID'),
            PublisherName: decodeURIComponent(sessionStorage.getItem('UserName')),
            AttachmentID: this.state.AttachmentID,
            AttachmentUrl: this.state.AttachmentUrl,
            AttachmentName: this.state.AttachmentName,
            AttachmentSize: this.state.AttachmentSize,
        }).then((res) => {
            return res.json();
        }).then((json) => {
            
            if (json.StatusCode === 200 && json.Data.BackCode === 1) {
                $this.props.hideModal();
                //    this.uploadFn();
                message.success('发布新闻成功~', 3);
                if($this.state.NoticeMain==1){
                    window.opener.postMessage('1', '*');
                    setTimeout(()=>{
                        window.open("about:blank","_self").close();
                        // window.opener=null;   
                        // //window.opener=top;   
                        // window.open("","_self");   
                        // window.close();   
                    },2000)
                    return;
                }else{
                    $this.setState({
                        NoticeMain: 0,
                    })
                    this.props.changeNoticeList(1);
                    $('#file').val('');
                }
                let ue = window.UE.getEditor('editor');
                ue.setContent('');
            } else {
                message.error(json.Msg, 3);
            }
        })
    }
    TypeOver() {
        // console.log('移入');

        if (!this.state.isMouseOut1) {
            this.setState({
                isMouseOut1: true,
                isMouseOut: false,
                isMouseOut2: false,
            })
            if (this.state.NewsTypeList.length > 0) {
                this.setState({
                    isMouseOut: true
                })
                return;
            }
            getData('PublicInfo/News/CreateNews/GetAllNewsTypeList', {
                UserType: sessionStorage.getItem('UserType'),
                unloading: 1
            }).then((res) => {
                return res.json()
            }).then((json) => {
                // console.log(json);
                // hide();
                if (json.StatusCode == 200) {
                    // json.Data.NewsTypeList.unshift('全部');
                    this.setState({
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
    chooseType(type) {
        this.setState({
            Newstype: type,
            isMouseOut: false,
            isMouseOut1: false,
        }, () => {
            // this.getQuelist('');
        })
    }

    //如果条件不存在必须要返回null   
    static getDerivedStateFromProps(props, current_state) {
        // console.log(props.NoticeMain,current_state.NoticeMain );
        if (props.NoticeMain !== 0 && current_state.NoticeMain !== 1) {
            let NewsContent = props.NoticeMain.NewsContent;
            let timer = setInterval(function () {
                if ($('#editor').length > 0) {
                    // console.log( NoticeContent);
                    sessionStorage.setItem('editor', 'editor');
                    let ue = window.UE.getEditor('editor');
                    ue.setContent(NewsContent);
                    clearInterval(timer);
                    // ue.ready(() => {
                    //     ue.setContent(NoticeContent);
                    //     clearInterval(timer);
                    // })
                }
            }, 100)
            if(!props.NoticeMain.NewsCoverPath){
                props.NoticeMain.NewsCoverPath='';
            }
            return {
                NewsID: props.NoticeMain.NewsID,
                NoticeMain: 1,
                noticeTitle: props.NoticeMain.NewsTitle,
                AttachmentID: props.NoticeMain.AttachmentID,
                AttachmentName: props.NoticeMain.AttachmentName,
                AttachmentSize: props.NoticeMain.AttachmentSize,
                AttachmentUrl: props.NoticeMain.AttachmentUrl,
                NoticeContent: props.NoticeMain.NewsContent,
                Newstype:  { newsTypeName:  props.NoticeMain.NewsTypeName,UserTypeStr:props.NoticeMain.UserTypeStr },
                NewsTitleImg:props.NoticeMain.NewsCoverPath
            }
        }
        if (props.NoticeMain === 0 && current_state.NoticeMain !== 2) {

            return {
                NewsID: '',
                NoticeMain: 2,
                noticeTitle: '',
                AttachmentID: '',
                AttachmentName: '',
                AttachmentSize: '',
                AttachmentUrl: '',
                NoticeContent: '',
                Newstype:  { newsTypeName: '',UserTypeStr:'' },
                NewsTitleImg:'',
               
            }
        }
        return null
    }
    onoK4() {
        if (!this.state.noticeTitle) {
            message.error('新闻标题不能为空~');
            let count = 0;
            let timer = setInterval(() => {
                count++;
                setTimeout(() => {
                    if (count === 3) {
                        clearInterval(timer);
                    }

                    $('.notice-create-title').focus();
                }, 200);
                $('.notice-create-title').blur();
            }, 400);
            return;
        }
        if (!this.state.Newstype.newsTypeName) {
            message.error('新闻类型不能为空~');
            let count = 0;
            let timer = setInterval(() => {
                count++;
                setTimeout(() => {
                    if (count === 3) {
                        clearInterval(timer);
                        $('.div-select').css('border', 'solid 1px #bac7d9');
                        return;
                    }
                    $('.div-select').css('border', 'solid 2px #bac7d9');
                }, 200);
                $('.div-select').css('border', 'solid 2px #1890ff');

            }, 400);
            return;
        }   
        if (window.UE.getEditor('editor').getContent()) {
            let myDate = new Date();
            let year = myDate.getFullYear();    //获取完整的年份(4位,1970-????)
            let Month = myDate.getMonth() * 1 + 1;       //获取当前月份(0-11,0代表1月)
            let Date1 = myDate.getDate();
            let Hours = myDate.getHours();       //获取当前小时数(0-23)
            if(Hours<10){
                Hours='0'+Hours;
            }
            let Minutes = myDate.getMinutes();
          
            if(Minutes<10){
                Minutes='0'+Minutes;
            }
            console.log(Hours,Minutes);
            this.setState({
                visible4: true,
                serverTime: year + '-' + Month + '-' + Date1 + ' ' + Hours + ':' + Minutes
            })
        } else {
            message.error('新闻内容不能为空');
        }

    }
    handleCancel4 = () => {
        this.setState({
            visible4: false
        })
    }
    handleCancel3 = () => {
        this.setState({
            visible3: false,
            isMouseOut2: false,
        })
    }
    handleOk3 = () => {
        postData('PublicInfo/News/CreateNews/AddNewsType', {
            UserID: sessionStorage.getItem('UserID'),
            UserType: sessionStorage.getItem('UserType'),
            NewsTypeName: this.state.TypeName,
            unloading: 1
        }).then((res) => {
            return res.json()
        }).then((json) => {
            // console.log(json);
            // hide();
            if (json.StatusCode == 200 && json.Data.BackCode == 1) {
                let NewsTypeList = this.state.NewsTypeList;
                NewsTypeList.push({
                    "NewsTypeID": json.Data.NewsTypeID,
                    "newsTypeName": this.state.TypeName,
                    "UserID": sessionStorage.getItem('UserID'),
                    "userTypeStr": json.Data.UserTypeStr,
                })
                this.setState({
                    visible3: false,
                    isMouseOut2: true,
                    NewsTypeList: NewsTypeList,
                    TypeName: '',
                })
            } else {
                message.error(json.Msg, 3);
            }
        })
    }
    clooseType(e, idx) {
        e.stopPropagation();

        this.setState({
            NewsTypeListIDx: idx,
            isOpen: true,
            isMouseOut2: true,
        })
    }
    addType(e) {
        e.stopPropagation();
        this.setState({
            visible3: true,
            isMouseOut: true,
            isMouseOut2: true,
            isMouseOut1: true,
        })
    }
    ChangeTypeName(e) {
        this.setState({
            TypeName: e.target.value
        })
        // console.log( e.target.value);
    }
    DeleTypeFn(data) {
        if (data) {
            getData('PublicInfo/News/CreateNews/DeleteNewsType', {
                UserType: sessionStorage.getItem('UserType'),
                UserID: sessionStorage.getItem('UserID'),
                NewsTypeID: this.state.NewsTypeList[this.state.NewsTypeListIDx].newsTypeID
            }).then((res) => {
                return res.json()
            }).then((json) => {
                // console.log(json);
                // hide();
                if (json.StatusCode == 200) {
                    let NewsTypeList = this.state.NewsTypeList;
                    if (this.state.NewsTypeList[this.state.NewsTypeListIDx].newsTypeID == this.state.Newstype.newsTypeID) {

                        this.setState({
                            Newstype: { newsTypeName: '',UserTypeStr:'' },
                        })
                    }
                    NewsTypeList.splice(this.state.NewsTypeListIDx, 1);
                    this.setState({
                        NewsTypeList: NewsTypeList,
                        isMouseOut: true,
                        isOpen: false,
                    })
                } else {
                    message.error(json.Msg, 3);
                }
            })
        } else {
            this.setState({
                isOpen: false,
            })
        }

    }
    render() {
        // console.log(this.props.NoticeMain)
        function showhtml(htmlString) {
            var html = { __html: htmlString };
            return <div className="Template-content" dangerouslySetInnerHTML={html}></div>;
        }

        return (
            <div className='notice-create'>
                <Modal
                    className='notice-create-modal'
                    title="发布新闻资讯"
                    visible={this.props.visible}
                    onOk={this.createNotice}
                    onCancel={this.props.hideModal}
                    okText="发布"
                    cancelText="取消"
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                    centered
                    width='1000px'
                    maskClosable={false}
                // destroyOnClose={false}
                // wrapClassName='notice-create-Modal'
                >
                    <div className='notice-create-bottom3' onClick={() => { this.onoK4() }}>预览</div>
                    {/* <UEditor ref="ueditor" initData={this.state.initData} /> */}
                    <label><span className="notice-create-span">标题:</span> <input maxLength='50' className="notice-create-title" placeholder="请输入新闻标题" value={this.state.noticeTitle} onChange={(e) => { this.changeNoticeTitle(e) }} /><b className="notice-title-length" >{this.state.noticeTitle.length}/50</b></label>
                    <div className="create-time-div" ><span className="notice-create-span">类型:</span><div className='div-select' onMouseOver={() => { this.TypeOver() }} onMouseLeave={() => { this.TypeOut() }}>
                        <div className='Mouse-div'><span className='type-name'>{this.state.Newstype.newsTypeName}</span><i className={(this.state.isMouseOut && this.state.isMouseOut1) || this.state.isMouseOut2 ? 'select-img1' : 'select-img'}></i></div>
                        {(this.state.isMouseOut && this.state.isMouseOut1) || this.state.isMouseOut2 ? <div className='div-select-bottom'></div> : ''}
                        {(this.state.isMouseOut && this.state.isMouseOut1) || this.state.isMouseOut2 ? <div className='div-select-list'>
                            {this.state.NewsTypeList.map((item, idx) => {
                                return <b key={idx} onClick={() => {
                                    this.chooseType(item)
                                }}>  {item.newsTypeName} <i className='cloose' onClick={(e) => { this.clooseType(e, idx) }}></i> </b>
                            })}
                            <span className='add-type' onClick={(e) => { this.addType(e) }}> <i></i> 添加类别</span>
                        </div> : ''}
                    </div > 
                    <div className='news-title-div'> <i className='news-title-img' style={this.state.NewsTitleImg.length>0?{backgroundImage:'url('+sessionStorage.getItem('ResourceServerAddr')+'/'+this.state.NewsTitleImg+')'}:{}} onClick={(e) => { $('#file1').click() }}> <b>更换封面</b> </i> <div className='news-title-div1'>
                        <p>格式要求:</p>
                        <p>1. 限JPG/JPEG/PNG格式；</p>
                        <p>2. 限140px*95px尺寸。</p>
                    </div>
                    </div></div>
                    <div className='upload-success-div'> 
                   <span>  附件:</span> <span className='upload-span'><b onClick={()=>{$('#file').click()}}>添加附件</b> [最大10M] </span>
                   <form id="uploadImg" >
                        <input name="file" type="file" id="file" onChange={(e) => { this.formDataRemind(e) }} />
                      
                    </form>
                    {!this.state.AttachmentID ? '' : <span className='upload-success-span'><i className={this.state.AttachmentName.slice(this.state.AttachmentName.lastIndexOf('.') + 1, this.state.AttachmentName.length)}></i><b title={this.state.AttachmentName}>{this.state.AttachmentName}</b><b>{this.state.AttachmentSize / 1024 / 1024 > 1 ? '[' + (this.state.AttachmentSize / 1024 / 1024).toFixed(2) + 'MB]' : '[' + (this.state.AttachmentSize / 1024).toFixed(0) + 'KB]'}</b><b onClick={() => { this.uploadDel() }}>x</b></span>}
                    {this.state.isupload == 'true' ? <span className='upload-success-span upload-success-span1'>正在上传，请稍等~</span> : ''}
                   </div>
                    <form id="uploadImg1">
                        <input name="file" type="file" id="file1" onChange={(e) => { this.formDataRemind(e, 1) }} />
                    </form>
                    <span className="create-content">正文:</span><UEditor id='editor'></UEditor>
                    <Alert message={this.state.message} isOpen={this.state.isOpen} chooseFn={(data) => { this.DeleTypeFn(data) }}></Alert>
                </Modal>
                <Modal
                className='Vews-news'
                    title="预览新闻"
                    visible={this.state.visible4}
                    // onOk={this.handleOk}
                    onCancel={this.handleCancel4}
                    footer={null}
                    width='1166px'
                // destroyOnClose={true}
                >
                    <h1 style={{ textAlign: 'center',padding:'0 80px; ' }}>{this.state.noticeTitle.length > 0 ? this.state.noticeTitle : '您还没有输入新闻标题哦~'}</h1>
                        <p className='notice-details-message'><span> <b>发布时间: </b>{this.state.serverTime}</span><span><b> 类别: </b> {this.state.Newstype.newsTypeName}</span><span><b> 阅读次数:  </b> 0次</span></p>
                    <p className='notice-details-border'></p>
                   {/* <div> <i className='news-title-img news-title-img1' style={this.state.NewsTitleImg.length>0?{backgroundImage:'url('+sessionStorage.getItem('ResourceServerAddr')+'/'+this.state.NewsTitleImg+')'}:{}}>  </i> </div> */}
                    <div className='notice-contect'> {this.state.visible4 ? showhtml(window.UE.getEditor('editor').getContent()) : ''}</div>
                </Modal>
                <Modal
                    className='add-news-type'
                    title="添加类别"
                    visible={this.state.visible3}
                    onOk={this.handleOk3}
                    onCancel={this.handleCancel3}
                    okText="确定"
                    cancelText="取消"
                    centered
                    // footer={null}
                    width='400px'
                // destroyOnClose={true}
                >
                    <div className='add-type-input'> <span>类别名称：</span> <input value={this.state.TypeName} onChange={(e) => { this.ChangeTypeName(e) }} type="text" maxLength='6' placeholder='请输入类别名称（不超过6个字）' /></div>

                </Modal>
                {this.state.loading ? <Spin size="large" /> : ''}
            </div>
        )
    }
}

export default CreateNotice;