import '../style/listStyle.css'
import React, {useEffect, useState} from "react";
import { Link } from "react-router-dom";
import axios from  'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";

import { FormOutlined } from '@ant-design/icons';
import { Pagination, Table } from 'antd';
const { Column} = Table;
 
function Lists(props){

    let navigate = useNavigate();
    const [datasource, setDatasource] = useState([]);

    let callListApi = async () => {
        axios.post('/api/board/swboard?type=list', { 
        }).then(response => {
            try {
                //let result = [];
                let SwToolList = response.data;

                const newData = SwToolList.json.map((data, i) => {
                    let date = data.write_date;
                    let year = date.substr(0, 4);
                    let month = date.substr(5, 2);
                    let day = date.substr(8, 2);
                    let write_date = `${year}.${month}.${day}`;
    
                    return {
                        key: i,     
                        article_no: data.article_no,
                        title: data.title,
                        content: data.content,
                        write_date: write_date,
                        write_id: data.write_id,
                    };
                });
                setDatasource(newData);

            }catch(error){
                alert('목록작업중 오류');
            }
        }).catch(error => {
            alert('axios 호출 에러');
            return false;
        });
    };

    const handleClick = (articleNo) => {
        navigate(`/Board/${articleNo}`); // Navigate to the Board view with article number
    };

    useEffect(() => {
        callListApi();
    }, []); 
    
    
    return (
            <div className="listcontainer">
                <div className="col-md-12">
                    <h2>게시글 목록</h2>
                    <div className='buttoncontainer'>
                        <Link to={'/Board/register'}>
                            <FormOutlined style={{ color: 'blue-3', fontSize: '20px'}}/>
                        </Link>
                    </div>
                    <div>
                        <Table className="table" dataSource={datasource} pagination={{
                                pageSize: 7, 
                                position: ['bottomCenter']
                            }}
                            onRow={(record) => ({
                                    onClick: () => handleClick(record.article_no),
                            })}>
                            <Column  className="truncate" title='article_no' dataIndex='article_no' key='article_no'></Column>
                            <Column  className="truncate" title='title' dataIndex='title' key='title'></Column>
                            <Column  className="truncate" title='content' dataIndex='content' key='content'></Column>
                            <Column  className="truncate" title='write_date' dataIndex='write_date' key='write_date'></Column>
                            <Column  className="truncate" title='write_id' dataIndex='write_id' key='write_id'></Column>
                        </Table>
                    </div>
                </div>
            </div>
      
    )
}
export default Lists;