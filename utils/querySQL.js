const mysql = require('mysql');
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'paulsql101',
  database: 'my_camp',
  multipleStatements: false, // prevent SQL injection
});

const query = function (sql, values) {
  return new Promise((resolve, reject) => {
    pool.getConnection( (err, connection) => {
      if (err) {
        console.log('X SQL connection failed!!!');
        reject(err);
      } else {
        console.log('V SQL connection established');
        connection.query(sql, values, (err, results) => {
          if (err) {
            reject(err)
          } else {
            resolve(results)
          }
          connection.release();
          console.log('! SQL connection ended');
        })
      }
    })
  })
};

module.exports = query;
