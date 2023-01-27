const mysql = require('mysql');

class JDBCClient {
  createShared(config) {
    if(this.conn == undefined) {
      this.conn = mysql.createConnection(config);
      this.conn.connect((err) => {
        if (err) {
          console.log('Error connection to MySQL', err.stack);
          return;
        }
        console.log('MySQL connection established');
      });
    }
    return this;
  }
  getConnection(callback) {
    if(callback != undefined
      && typeof callback == 'function') {
      callback(this.conn);
    }
  }
  close() {
    this.conn.end((err) => {
      // The connection is terminated gracefully
      // Ensure all previously enqueued are still
      // before sending a COM_QUIT packet to the MySQL server
    });
  }
}

class JDBCRepository {
  constructor(jdbcClient) {
    this.jdbcClient = jdbcClient;
  }
  procedureQuery(procedureName, params, callback) {
    let query = `CALL ${procedureName}(${params.map(() => '?')})`;
    this.jdbcClient.getConnection(function(conn) {
      // check conn
      conn.query(query, params.map(param => param.value), (err, rows) => {
        //if(err) throw err;
        //console.log('Data received from MySQL\n');
        if(callback != undefined
          && typeof callback == 'function') {
          callback(err, rows);
        }
      });

    });
  }
}

class SqlParam {
  constructor(name, value) {
    this.name = name;
    this.value = value;
  }
}

module.exports = {
  JDBCClient,
  JDBCRepository,
  SqlParam
}
