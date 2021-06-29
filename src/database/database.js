const mysql = require('mysql')
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'database',
    port: '8889',
})

connection.connect()
module.exports = connection
