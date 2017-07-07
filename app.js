const config = require('config')
const mysql = require('mysql')

function app () {
  const dbConfig = config.get('mysql')
  const connection = mysql.createConnection(dbConfig)

  connection.connect()

  const sql = `SELECT DISTINCT TABLE_NAME FROM information_schema.TABLES WHERE table_schema = '${dbConfig.database}' AND table_collation != 'utf8_bin'`

  connection.query(sql, function (error, results, fields) {
    if (error) throw error

    const sqlStrings = results
      .map(({TABLE_NAME, COLUMN_NAME}) => `ALTER TABLE ${TABLE_NAME} CONVERT TO CHARACTER SET utf8 COLLATE utf8_bin;`)

    console.log(sqlStrings.join('\n'))
  })

  connection.end()
}

app()
