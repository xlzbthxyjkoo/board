var express = require('express');
var router = express.Router();
const mysql = require('mysql2');
const bodyParser = require('body-parser');

router.use(bodyParser.json());

const pool = mysql.createPool({
    //connection pool 최대 50개
    connectionLimit: 50,
    //50개 넘으면 wait하게 함
    waitForConnections: true,
    host: 'localhost',
    port: '3306',
    database: 'react_test',
    user: 'react',
    password: '1234',

})

router.post('/', (req, res) => {
    const mybatisMapper = require('mybatis-mapper');
    var param = req.body;

    mybatisMapper.createMapper(['./models/' + param.mapper + '.xml']);
    
    var format = {language: 'sql', indent: '    '};

    //namespace / namspace 아래 id
    var query = mybatisMapper.getStatement(param.mapper, param.mapper_id, param, format);
    
    //pool에 있는 거 꺼내 옴
    pool.getConnection(function (err, connection){
        connection.query(query, function (error, results) {
            if(error) {
                console.log('db error : ' + error);
            }
            console.log('db result : ' + results);
            if(results != undefined) {
                string = JSON.stringify(results);
                var json = JSON.parse(string);
                if(req.body.crud == "select") {
                    res.send({json});
                }
                else {
                    res.send({code: 'succ'});
                }     
            }
            else {
                res.send({code: 'error'});
            }
            connection.release();
        });
    })
})

module.exports = router;