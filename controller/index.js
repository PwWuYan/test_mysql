const mysql = require('mysql');
const { list } = require('../config/index');
const connection = mysql.createConnection({
    host: list.host,
    user: list.user,
    password: list.password,
    database: list.database,
    port: list.port
})
connection.connect((error) => {
    if (error) {
        console.log("数据库连接失败")
    } else {
        console.log("数据库连接成功")
    }
})

module.exports = connection