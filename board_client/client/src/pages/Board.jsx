import '../style/boardStyle.css'
import '../style/listStyle.css'
import React, {useEffect} from "react";
import { Link, useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import List from './List'

function Board() {
    const params = useParams();
    const beforeSwtcode = params.article_no;

    let navigate = useNavigate();
    let handleFileInput = () => {};

    //폼 필드를 초기화하는 함수
    const clearFormFields = () => {
        document.querySelector('#is_title').value = '';
        document.querySelector('#is_author').value = '';
        document.querySelector('#is_text').value = '';
    };

    useEffect(() => {
        if(beforeSwtcode === 'register') {
            //등록에 왔을 때는 수정, 삭제 버튼을 사라지게 함
            document.querySelector('.modifyClass').style.display = 'none';
            document.querySelector('.deleteClass').style.display = 'none';
            document.querySelector('.saveClass').style.display = 'inline-block';
            // 등록 시 폼 필드 초기화
            clearFormFields();
        }
        else {
            //수정에 왔을 때는 저장버튼을 사라지게 함
            document.querySelector('.saveClass').style.display = 'none';
            document.querySelector('.modifyClass').style.display = 'inline-block';
            document.querySelector('.deleteClass').style.display = 'inline-block';

            callSwToolInfoApi();
        }
    }, [beforeSwtcode]); // beforeSwtcode가 변경될 때만 실행

    let callSwToolInfoApi = () => {
        axios.post('/api/board/swboard?type=list', {
            article_no: beforeSwtcode,

        }).then(response => {
            console.log('API 응답:', response.data);
            let data = response.data.json[0];
            document.querySelector('#is_title').value = data.title;
            document.querySelector('#is_author').value = data.content;
            document.querySelector('#is_text').value = data.write_id;
        }).catch(error => {alert('조회 오류'); return false;});
    };

    let deleteSwtool = (e) => {
        e.preventDefault();
        console.log('deleteSwtool()');
        let event_target = e.target
        //alert(event_target.getAttribute('id'));
        sweetalertDelete('정말 삭제하시겠습니까?', function () {
            axios.post('/api/board/swboard?type=delete', {
                is_SwtCd: event_target.getAttribute('id')
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then(response => {
                console.log('삭제 응답:', response.data);
                if (response.data && response.data.code === 'succ') {
                    sweetalertSucc('삭제 성공', false);
                    setTimeout(function() {
                        navigate('/');  // 삭제 후 목록 페이지로 이동
                    }, 1500);
                } else {
                    console.error('삭제 실패:', response.data);
                    alert('삭제에 실패했습니다.');
                }
            }).catch(error => { 
                console.error('작업 중 오류 발생:', error);
                alert('작업중 오류가 발생하였습니다.'); return false; });
        })
    }

    let sweetalertDelete = (title, callbackFunc) => {
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
                )
            } else {
                return false;
            }
            callbackFunc();
            setTimeout(function() {
                navigate('/');
            }, 1500);
        })
    }

    let submitClick = (type, e) => {
        //화면갱신 방지
        e.preventDefault();

        let title_checker = document.querySelector("#is_title").value;
        let author_checker = document.querySelector("#is_author").value;
        let text_checker = document.querySelector("#is_text").value;

        let fnValidate = (e) => {
            if (title_checker === '') {
                document.querySelector('#is_title').setAttribute('class', 'border_validate_err')
                alert('제목을 다시 확인해주세요.')
                return false;
            }
            document.querySelector('#is_author').removeAttribute('class');

            if (author_checker === '') {
                document.querySelector('#is_author').setAttribute('class', 'border_validate_err')
                alert('작성자를 다시 확인해주세요.')
                return false;
            }
            document.querySelector('#is_author').removeAttribute('class');

            if (text_checker === '') {
                document.querySelector('#is_text').setAttribute('class', 'border_validate_err')
                alert('글 다시 확인해주세요.')
                return false;
            }
            document.querySelector('#is_text').removeAttribute('class');
            return true;
        }

        if(fnValidate()) {
            const formData = new FormData(document.querySelector("#frm"));
            var Json_form = JSON.stringify(Object.fromEntries(formData));
            const response = fetch('/api/board/swboard?type=' + type, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: Json_form,
            }).then(response => {
                if(!response.ok) {
                    throw new Error(`${response.status} 에러 발생`);
                }
                return response.json();
            })
            .then(body => {
                if(body.code === "succ") {
                    if(type === 'save') {
                        sweetalertSucc('게시글 등록 성공', false);
                    }
                    else if(type === 'modify') {
                        sweetalertSucc('게시글 수정 성공', false);
                    }
                    setTimeout(function() {
                        navigate('/');
                    }, 1500);
                }
                else {
                    alert('insert 오류');
                }
            }).catch(err => alert(err));
        }
    };


    let sweetalertSucc = (title, showConfirmButton) => {
        Swal.fire({
            position: 'bottom-end',
            icon: 'success',
            title: title,
            showConfirmButton: showConfirmButton,
            timer: 1000
        });
    }

    return (
        <section className="home">
            <div className="container">
            <div className="listcontainer">
                <List/>
            </div>
            <div className="boardcontainer">
                <div>
                    <h2>게시글 수정/삭제</h2>
                </div>
                <div>
                    <form name="frm" id="frm" action="" method="post" >
                        <input id="article_no" type="hidden" name="article_no" />
                        <input id="is_Email" type="hidden" name="is_Email" value="guest" />
                        <input id="is_beforeSwtcode" type="hidden" name="is_beforeSwtcode" value={beforeSwtcode} />
                        <p style={{ "textAlign": "right" }}>
                            (*)표시는 필수입력사항 입니다.
                        </p>
                        <div className='tableClass'>
                            <table className="table">
                                <tbody>
                                    <tr>
                                        <th>
                                            <label htmlFor="is_title">제목<span>(*)</span></label>
                                        </th>
                                        <td>
                                            <input type="text" name="is_title" id="is_title" />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>
                                            <label htmlFor="is_author">작성자(*)</label>
                                        </th>
                                        <td>
                                            <input type="text" name="is_author" id="is_author" />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>
                                            <label htmlFor="is_text">설명(*)</label>
                                        </th>
                                        <td>
                                            <textarea name="is_text" id="is_text" rows="" cols=""></textarea>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <div style={{ "marginBottom": "44px" }}>
                                <Link to={'/'} ><span className="badge bg-secondary">취소</span></Link>
                                <a href="" className='saveClass' onClick={(e) => submitClick('save', e)}><span className="badge bg-primary">저장</span></a>
                                <a href="" className='modifyClass' onClick={(e) => submitClick('modify', e)}><span className="badge bg-primary">수정</span></a>
                                <a href="#n" className='deleteClass' onClick={(e) => deleteSwtool(e)}>
                                    <span id={beforeSwtcode} className="badge bg-danger">삭제</span>
                                </a>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            </div>
        </section>
    );
}

export default Board;

