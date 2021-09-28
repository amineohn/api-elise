const mysql = require('mysql')
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'database',
    port: '3306',
})

if (connection) {
    console.log('database is connected.')
    connection.connect()
} else {
    console.log('error an occured.')
    connection.end()
}
module.exports = connection
