var mysql = require('mysql2');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'shahbaz',
    database : 'assign'
  });
   
   
connection.connect(function(err) {
    if (err) throw err
    console.log('You are now connected...')
})

module.exports = connection;