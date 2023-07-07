const Model = require('./model')

class User extends Model {
  constructor() {
    super()
  }

  getAll(callback) {
    this.query(
      'SELECT * FROM User',
    )
    .then(results => callback(results))
    .catch((error) => {
      console.log(error)
      callback(null)
    })
  }

  get(id, callback) {
    this.conn.query(
      `SELECT * 
      FROM User
      Where User.ID = ?`,
      [id],
      (error, results) => {
        if (error)
          return callback(405, null)
        else if (results.length === 0) 
          return callback(404, null)
        else
          return callback(200, results[0])
      }
    )
  }

  update(id, updateInfo, callback) {
    this.conn.query(
      `SELECT ID
      FROM User
      WHERE ID = ?`,
      [id],
      (error, results) => {
        if (error || results.length === 0) return callback(404, "Invalid ID")

        let query = ""
        if (updateInfo.Email !== "") {
          if (query != "")
            query = query.concat(", ")
          query = query.concat(`Email = '${updateInfo.Email}'`)
        }
        if (updateInfo.Phone !== "") {
          if (query != "")
            query = query.concat(", ")
          query = query.concat(`Phone = '${updateInfo.Phone}'`)
        }
        if (updateInfo.FName !== "") {
          if (query != "")
            query = query.concat(", ")
          query = query.concat(`FName = '${updateInfo.FName}'`)
        }
        if (updateInfo.LName !== "") {
          if (query != "")
            query = query.concat(", ")
          query = query.concat(`LName = '${updateInfo.LName}'`)
        }
        if (updateInfo.Username !== "") {
          if (query != "")
            query = query.concat(", ")
          query = query.concat(`Username = '${updateInfo.Username}'`)
        }
        // let queryLight = ""
        // if (updateInfo.Mode !== "") {
        //   if (queryLight != "")
        //     queryLight = queryLight.concat(", ")
        //   queryLight = queryLight.concat(`Mode = '${updateInfo.Mode}'`)
        // }
        if (query !== "") {
          this.conn.query(`UPDATE User SET ${query} WHERE ID = ?`, [id],
            (error, results) => {
              if (error)
                return callback(405, "invalid input")
              else
                return callback(200, "success")
            })
        } else {
          return callback(405, "empty input")
        }

      }
    )
  }

  create(newUser, callback) {
    this.query(
      'INSERT INTO Device SET ?',
      {
        SSN: newUser.SSN,
        Email: newUser.Email,
        Phone: newUser.Phone,
        FName: newUser.FName,
        LName: newUser.LName,
        Username: newUser.Username,
        Pass: newUser.Pass
      }
    )
      .then(() => {
        callback(200, true, 'Create success')
      })
      .catch((error) => {
        console.log(error)
        if (error.includes('Duplicate entry'))
          callback(400, false, 'Duplicate entry')
        else
          callback(400, false, 'something wrong happened, please try again')
      })
  }

  delete(id, callback) {
    this.query(
      `SELECT * FROM User WHERE ID = ?`,
      [id]
    )
      .then(results => {
        if (results.length === 0)
          throw Error('invalid id')
        else
          return this.query(
            `DELETE FROM User WHERE ID = ${id}`
          )
      })
      .then(() => {
        callback(200, true, 'delete success')
      })
      .catch(error => {
        console.log(error);
        if (error.message === 'invalid id')
          callback(406, false, error.message)
        else
          callback(400, false, 'something wrong happened, please try again')
      })
  }
}

module.exports = User