import '../style/listStyle.css'
import React, {useEffect, useState} from "react";
import { Link } from "react-router-dom";
import axios from  'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2'
import { useNavigate } from "react-router-dom";
 
function List(props){

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
                            <td>{data.title} </td>
                            <td>{data.content} </td>
                            <td>{write_date} </td>
                            <td>{data.write_id} </td>
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
    
    
    return (
            <div className="listcontainer">
                <div className="col-md-12">
                    <h2>게시글 목록</h2>
                    <div>
                        <Link to={'/Board/register'}>등록</Link>
                    </div>
                    <div>
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>no.</th>
                                    <th>제목</th>
                                    <th>내용</th>
                                    <th>날짜</th>
                                    <th>작성자</th>
                                </tr>
                            </thead>
                        </table>
                        <table className="table table-striped">
                            <tbody>
                                {append_List}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
      
    )
}
export default List;