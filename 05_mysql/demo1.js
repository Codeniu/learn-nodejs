var mysql = require('mysql')

var con = mysql.createConnection({
  host: '47.96.156.194',
  port: '3309',
  user: 'root',
  password: 'aliyun123',
  database: 'niudb',
})

con.connect(function (err) {
  if (err) throw err
  console.log('Connected!')

  // query

  // con.query(sql, function (err, result) {
  //   if (err) throw err
  //   console.log('Result: ' + result)
  // })

  // create

  // con.query('CREATE DATABASE niudb', function (err, result) {
  //   if (err) throw err
  //   console.log('Database created')
  // })

  // create and set primary key

  // var sql = 'CREATE TABLE customers (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), address VARCHAR(255))'
  // con.query(sql, function (err, result) {
  //   if (err) throw err
  //   console.log('Table created')
  // })

  // add primary key on exiting table
  // var sql = 'ALTER TABLE customers ADD COLUMN id INT AUTO_INCREMENT PRIMARY KEY'
  // con.query(sql, function (err, result) {
  //   if (err) throw err
  //   console.log('Table altered')
  // })

  // insert
  // var sql = "INSERT INTO customers (name, address) VALUES ('Company Inc', 'Highway 37')"
  // con.query(sql, function (err, result) {
  //   if (err) throw err
  //   console.log('1 record inserted')
  // })

  // insert more
  var sql = 'INSERT INTO customers (name, address) VALUES ?'
  var values = [
    ['John', 'Highway 71'],
    ['Peter', 'Lowstreet 4'],
    ['Amy', 'Apple st 652'],
    ['Hannah', 'Mountain 21'],
    ['Michael', 'Valley 345'],
    ['Sandy', 'Ocean blvd 2'],
    ['Betty', 'Green Grass 1'],
    ['Richard', 'Sky st 331'],
    ['Susan', 'One way 98'],
    ['Vicky', 'Yellow Garden 2'],
    ['Ben', 'Park Lane 38'],
    ['William', 'Central st 954'],
    ['Chuck', 'Main Road 989'],
    ['Viola', 'Sideway 1633'],
  ]
  con.query(sql, [values], function (err, result) {
    if (err) throw err
    console.log('Number of records inserted: ' + result.affectedRows)
  })
})

class DB {}
