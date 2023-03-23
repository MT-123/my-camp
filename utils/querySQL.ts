const mysql = require('mysql2');
const host = process.env.HOST_SQL || 'localhost';
const user = process.env.MYSQL_USER || 'root';
const password = process.env.MYSQL_PASSWORD || '';
const DBname = process.env.MYSQL_DATABASE || 'my_camp';
import type {PoolConnection} from 'mysql2';

const pool = mysql.createPool({
  host: host,
  user: user,
  password: password,
  database: DBname,
  multipleStatements: false, // prevent SQL injection
});

const query = function (sql:string, values:(string | number)[]) {
  return new Promise((resolve, reject) => {
    pool.getConnection( (err:any, connection:PoolConnection) => {
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
          console.log('V SQL connection ended');
        })
      }
    })
  })
};

module.exports = query;
export {};
