import '../style/boardStyle.css';
import '../style/listStyle.css';
import React, { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import Lists from './Lists';

import { DeleteOutlined, EditOutlined, HomeOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
const { TextArea } = Input;

function Board() {
    const params = useParams();
    const beforeSwtcode = params.article_no;
    let navigate = useNavigate();

    useEffect(() => {
        if (beforeSwtcode === 'register') {
            document.querySelector('.modifyClass').style.display = 'none';
            document.querySelector('.deleteClass').style.display = 'none';
            document.querySelector('.saveClass').style.display = 'inline-block';
            clearFormFields();
        } else {
            document.querySelector('.saveClass').style.display = 'none';
            document.querySelector('.modifyClass').style.display = 'inline-block';
            document.querySelector('.deleteClass').style.display = 'inline-block';
            callSwToolInfoApi();
        }
    }, [beforeSwtcode]);


    //등록 누를 시 폼 내용 사라지도록
    const clearFormFields = () => {
        document.querySelector('#is_title').value = '';
        document.querySelector('#is_author').value = '';
        document.querySelector('#is_text').value = '';
    };

    const callSwToolInfoApi = () => {
        axios.post('/api/board/swboard?type=list', {
            article_no: beforeSwtcode,
        }).then(response => {
            let data = response.data.json[0];
            document.querySelector('#is_title').value = data.title;
            document.querySelector('#is_author').value = data.write_id;
            document.querySelector('#is_text').value = data.content;
        }).catch(error => { alert('조회 오류'); });
    };

    const deleteSwtool = (e) => {
        e.preventDefault();
        sweetalertDelete('정말 삭제하시겠습니까?', () => {
            axios.post('/api/board/swboard?type=delete', {
                is_SwtCd: beforeSwtcode
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then(response => {
                if (response.data && response.data.code === 'succ') {
                    sweetalertSucc('삭제 성공', false);
                    setTimeout(() => {
                        navigate('/');
                    }, 1500);
                } else {
                    alert('삭제에 실패했습니다.');
                }
            }).catch(error => {
                alert('작업중 오류가 발생하였습니다.');
            });
        });
    };

    const sweetalertDelete = (title, callbackFunc) => {
        Swal.fire({
            title: title,
            text: "",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
        }).then((result) => {
            if (result.value) {
                Swal.fire(
                    'Deleted!',
                    '삭제되었습니다.',
                    'success'
                );
                callbackFunc();
            }
        });
    };

    const sweetalertSucc = (title, showConfirmButton) => {
        Swal.fire({
            icon: 'success',
            title: title,
            showConfirmButton: showConfirmButton,
            timer: 1000
        });
    };

    const submitClick = (type, e) => {
        e.preventDefault();
        let title_checker = document.querySelector("#is_title").value;
        let author_checker = document.querySelector("#is_author").value;
        let text_checker = document.querySelector("#is_text").value;

        if (title_checker === '') {
            document.querySelector('#is_title').classList.add('border_validate_err');
            alert('제목을 입력하세요');
            return;
        }
        document.querySelector('#is_title').classList.remove('border_validate_err');

        if (author_checker === '') {
            document.querySelector('#is_author').classList.add('border_validate_err');
            alert('작성자를 입력하세요');
            return;
        }
        document.querySelector('#is_author').classList.remove('border_validate_err');

        if (text_checker === '') {
            document.querySelector('#is_text').classList.add('border_validate_err');
            alert('글을 입력하세요');
            return;
        }
        document.querySelector('#is_text').classList.remove('border_validate_err');

        const formData = new FormData(document.querySelector("#frm"));
        const Json_form = JSON.stringify(Object.fromEntries(formData));
        fetch('/api/board/swboard?type=' + type, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: Json_form,
        }).then(response => {
            if (!response.ok) {
                throw new Error(`${response.status} 에러 발생`);
            }
            return response.json();
        }).then(body => {
            if (body.code === "succ") {
                if (type === 'save') {
                    sweetalertSucc('게시글 등록 성공', false);
                } else if (type === 'modify') {
                    sweetalertSucc('게시글 수정 성공', false);
                }
                setTimeout(() => {
                    navigate('/');
                }, 1500);
            } else {
                alert('insert 오류');
            }
        }).catch(err => alert(err));
    };

    return (
        <section className="home">
            <div className="container">
                <div className="listcontainer">
                    <Lists />
                </div>
                <div className="boardcontainer">
                    <div>
                        <h2>게시글 수정/삭제</h2><br />
                    </div>
                    <div>
                        <Form name="frm" id="frm" action="" method="post">
                            <input id="article_no" type="hidden" name="article_no" />
                            <input id="is_Email" type="hidden" name="is_Email" value="guest" />
                            <input id="is_beforeSwtcode" type="hidden" name="is_beforeSwtcode" value={beforeSwtcode} />
                            <div className='tableClass'>
                                <table className="table">
                                    <tbody>
                                        <tr>
                                            <td>
                                                <Form.Item label="제목" name="is_title" htmlFor="is_title" 
                                                      rules={[
                                                        {
                                                          required: true,
                                                          message: '제목을 입력하세요',
                                                        },
                                                      ]}
                                                labelCol={{ style: { fontFamily: "Gowun Dodum", fontWeight: 400 } }}>
                                                    <Input type="text" name="is_title" id="is_title" style={{ fontFamily: "Gowun Dodum", fontWeight: 400 }} />
                                                </Form.Item>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <Form.Item label="작성자" name="is_author" htmlFor="is_author" labelCol={{ style: { fontFamily: "Gowun Dodum", fontWeight: 400 } }}
                                                    rules={[
                                                        {
                                                        required: true,
                                                        message: '작성자를 입력하세요',
                                                        },
                                                    ]}>
                                                    <Input type="text" name="is_author" id="is_author" style={{ fontFamily: "Gowun Dodum", fontWeight: 400 }} />
                                                </Form.Item>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <Form.Item label="내용" name="is_text" htmlFor="is_text" labelCol={{ style: { fontFamily: "Gowun Dodum", fontWeight: 400 } }}
                                                    rules={[
                                                        {
                                                        required: true,
                                                        message: '내용을 입력하세요',
                                                        },
                                                    ]}>
                                                    <TextArea rows={10} name="is_text" id="is_text" style={{ fontFamily: "Gowun Dodum", fontWeight: 400 }} />
                                                </Form.Item>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div style={{ "marginBottom": "44px" }}>
                                    <Link to={'/'} ><span><HomeOutlined style={{ color: 'gray', fontSize: '20px', marginRight: '120px'}}/></span></Link>
                                    <a href="" className='saveClass' onClick={(e) => submitClick('save', e)}><span><UploadOutlined style={{ color: 'blue', fontSize: '20px', marginLeft: '140px'}}/></span></a>
                                    <a href="" className='modifyClass' onClick={(e) => submitClick('modify', e)}>
                                        <span>
                                            <EditOutlined style={{ color: 'green', fontSize: '20px', marginRight: '120px'}}/>
                                        </span>
                                    </a>
                                    <a href="#n" className='deleteClass' onClick={(e) => deleteSwtool(e)}>
                                        <span>
                                            <DeleteOutlined style={{ color: 'red', fontSize: '20px' }}/>
                                        </span>
                                    </a>
                                </div>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Board;