import '../style/listStyle.css'
import React, {useEffect, useState} from "react";
import { Link } from "react-router-dom";
import axios from  'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";

import { Avatar, Button, List, Skeleton} from 'antd';
import { FormOutlined } from '@ant-design/icons';
 
function Lists(props){

    let navigate = useNavigate();
    const [append_List, setAppend_List] = useState([]);

    let callListApi = async () => {
        axios.post('/api/board/swboard?type=list', {  
        }).then(response => {
            try {
                let result = [];
                let SwToolList = response.data;
                for(let i = 0; i < SwToolList.json.length; i++) {
                    let data = SwToolList.json[i];
                    // let title = data.title;
                    // let content = data.content;
                    let date = data.write_date;
                    let year = date.substr(0,4);
                    let month = date.substr(5,2);
                    let day = date.substr(8,2);
                    let write_date = year + '.' + month + '.' + day;
                    // let write_id = data.write_id;
 
                    result.push(
                        <tr key={i} onClick={() => handleRowClick(data.article_no)}>
                            <td>{data.article_no} </td>
                            <td className="truncate">{data.title} </td>
                            <td className="truncate">{data.content} </td>
                            <td>{write_date} </td>
                            <td className="truncate">{data.write_id} </td>
                        </tr>
                    )
                }
                setAppend_List(result);
            }catch(error){
                alert('목록작업중 오류');
            }
        }).catch(error => {
            alert('axios 호출 에러');
            return false;
        });
    };

    const handleRowClick = (articleNo) => {
        navigate(`/Board/${articleNo}`); // Navigate to the Board view with article number
    };
    
    useEffect(() => {
        callListApi();
    },[]);

    useEffect(() => {
        console.log("List updated: ", append_List);
    }, [append_List]);  // append_List가 변경될 때마다 로그를 출력
    
    
    return (
            <div className="listcontainer">
                <div className="col-md-12">
                    <h2>게시글 목록</h2>
                    <div className='buttoncontainer'>
                        <Link to={'/Board/register'}>
                            <FormOutlined style={{ color: 'blue-3', fontSize: '20px'}}/>
                            {/* <Button type="primary" style={{ fontFamily: "Gowun Dodum", fontWeight: 400, fontSize: 12}}>글쓰기
                            </Button> */}
                        </Link>
                    </div>
                    <div>
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th scope="col">no.</th>
                                    <th scope="col">제목</th>
                                    <th scope="col">내용</th>
                                    <th scope="col">날짜</th>
                                    <th scope="col">작성자</th>
                                </tr>
                            </thead>
                        </table>
                        <table className="table table-hover">
                            <tbody>
                                {append_List}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
      
    )
}
export default Lists;