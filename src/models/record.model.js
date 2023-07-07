const Model = require("./model");

class RecordModel extends Model {
  constructor() {
    super()
  }

  getAllT(id, callback) {
    this.conn.query(
      `SELECT S.ID, Temperature 
      FROM RecordT R, Sensor S, Device D, Air_Condition A
      WHERE R.SensorID = S.ID AND S.DeviceID = D.ID AND D.RoomID = ? AND D.ID = A.ID
      ORDER BY TimeDate DESC LIMIT 20`,
      [id],
      (error, results) => {
        if (error) 
          return callback(null)
        else 
          return callback(results)
      }
    )
  }

  getT(id, callback) {
    this.conn.query(
      `SELECT S.ID, Temperature 
      FROM RecordT R, Sensor S, Device D, Air_Condition A
      WHERE R.SensorID = S.ID AND S.DeviceID = D.ID AND D.RoomID = ? AND D.ID = A.ID
      ORDER BY TimeDate DESC LIMIT 1`,
      [id],
      (error, results) => {
        if (error)
          return callback(405, null)
        else if (results.length === 0) 
          return callback(404, null)
        else
          return callback(200, results)
      }
    )
  }

  getAllH(id, callback) {
    this.conn.query(
      `SELECT S.ID, Humidity 
      FROM RecordH R, Sensor S, Device D, Air_Condition A
      WHERE R.SensorID = S.ID AND S.DeviceID = D.ID AND D.RoomID = ? AND D.ID = A.ID
      ORDER BY TimeDate DESC LIMIT 20`,
      [id],
      (error, results) => {
        if (error) 
          return callback(null)
        else 
          return callback(results)
      }
    )
  }

  getH(id, callback) {
    this.conn.query(
      `SELECT S.ID, Humidity 
      FROM RecordH R, Sensor S, Device D, Air_Condition A
      WHERE R.SensorID = S.ID AND S.DeviceID = D.ID AND D.RoomID = ? AND D.ID = A.ID
      ORDER BY TimeDate DESC LIMIT 1`,
      [id],
      (error, results) => {
        if (error)
          return callback(405, null)
        else if (results.length === 0) 
          return callback(404, null)
        else
          return callback(200, results)
      }
    )
  }


  getAllTS(id, callback) {
    this.conn.query(
      `SELECT S.ID, Temperature 
      FROM RecordT R, Sensor S, Device D, Water_pumps A
      WHERE R.SensorID = S.ID AND S.DeviceID = D.ID AND D.RoomID = ? AND D.ID = A.ID
      ORDER BY TimeDate DESC LIMIT 20`,
      [id],
      (error, results) => {
        if (error) 
          return callback(null)
        else 
          return callback(results)
      }
    )
  }

  getTS(id, callback) {
    this.conn.query(
      `SELECT S.ID, Temperature 
      FROM RecordT R, Sensor S, Device D, Water_pumps A
      WHERE R.SensorID = S.ID AND S.DeviceID = D.ID AND D.RoomID = ? AND D.ID = A.ID
      ORDER BY TimeDate DESC LIMIT 1`,
      [id],
      (error, results) => {
        if (error)
          return callback(405, null)
        else if (results.length === 0) 
          return callback(404, null)
        else
          return callback(200, results)
      }
    )
  }

  getAllHS(id, callback) {
    this.conn.query(
      `SELECT S.ID, Humidity 
      FROM RecordH R, Sensor S, Device D, Water_pumps A
      WHERE R.SensorID = S.ID AND S.DeviceID = D.ID AND D.RoomID = ? AND D.ID = A.ID
      ORDER BY TimeDate DESC LIMIT 20`,
      [id],
      (error, results) => {
        if (error) 
          return callback(null)
        else 
          return callback(results)
      }
    )
  }

  getHS(id, callback) {
    this.conn.query(
      `SELECT S.ID, Humidity 
      FROM RecordH R, Sensor S, Device D, Water_pumps A
      WHERE R.SensorID = S.ID AND S.DeviceID = D.ID AND D.RoomID = ? AND D.ID = A.ID
      ORDER BY TimeDate DESC LIMIT 1`,
      [id],
      (error, results) => {
        if (error)
          return callback(405, null)
        else if (results.length === 0) 
          return callback(404, null)
        else
          return callback(200, results)
      }
    )
  }

}

module.exports = RecordModel