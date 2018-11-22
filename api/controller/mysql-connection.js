const mysql = require('mysql')
const pool = mysql.createPool({
  connectionLimit   :   5,
  host              :   process.env.MYSQL_IP,
  user              :   process.env.MYSQL_UN,
  password          :   process.env.MYSQL_PW,
  database          :   process.env.MYSQL_SM
})

exports.queryUser = (username) => {
  return new Promise((resolve, reject) => {
    var sqlQuery = "SELECT `username`,`password`,`admin`," + 
      "`access-group` AS `accessGroup`,`last-active` AS `lastActive`,`date-created` AS `dateCreated` " + 
      "FROM `users` WHERE `username`=?;";
    var inserts = [username];
    sqlQuery = mysql.format(sqlQuery,inserts);
    
    pool.query(sqlQuery, (err, rows) =>{
			if (err) reject({code:500, message:err})
			else resolve(rows)
		})
	})
}

exports.insertNewUser = (user) => {
  const { username, password, admin, access } = user

  return new Promise((resolve, reject) => {
    var sqlQuery = "INSERT INTO `users` " + 
      "(`username`,`password`,`admin`,`access-group`,`last-active`,`date-created`) " + 
      "VALUES (?,?,?,?,'1970-01-01 12:00:00',NOW());";
    var inserts = [username, password, admin, access];
    sqlQuery = mysql.format(sqlQuery,inserts);

    pool.query(sqlQuery, (err, rows) =>{
			if (err) reject({code:500, message:err})
			else resolve()
		})
  })
}

exports.updateUserLastActive = (username) => {
  return new Promise((resolve, reject) => {
    var sqlQuery = "UPDATE `users` SET `last-active`=NOW() WHERE `username`=?;";
    var inserts = [username];
    sqlQuery = mysql.format(sqlQuery,inserts);
    
    pool.query(sqlQuery, (err, rows) =>{
			if (err) reject({code:500, message:err})
			else resolve(rows)
		})
	})
}

exports.updateUser = (user) => {
  const {username, password, admin, access } = user

  return new Promise((resolve, reject) => {
    var sqlQuery = "UPDATE `users` SET `password`=?, `admin`=?, `access-group`=? WHERE `username`=?;";
    var inserts = [password, admin, access, username];
    sqlQuery = mysql.format(sqlQuery,inserts);
    
    pool.query(sqlQuery, (err, rows) =>{
			if (err) reject({code:500, message:err})
			else resolve(rows)
		})
	})
}

exports.deleteUser = (username) => {
  return new Promise((resolve, reject) => {
    var sqlQuery = "DELETE FROM `users` WHERE `username`=?;";
    var inserts = [username];
    sqlQuery = mysql.format(sqlQuery,inserts);
    
    pool.query(sqlQuery, (err, rows) =>{
			if (err) reject({code:500, message:err})
			else resolve(rows)
		})
	})
}