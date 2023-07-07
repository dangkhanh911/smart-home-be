const Model = require("./model");
const formatDate = require('../utils/formatDate')
const ada = require('../models/connectAdafruit.model')

class DeviceModel extends Model {
  constructor() {
    super()
  }
  
  getAll(callback) {
    ada.postData(1, 1)
    this.conn.query(
      `SELECT * 
      FROM Device`,
      (error, results) => {
        if (error)
          return callback(null)
        else
          return callback(results)
      }
    )
  }
  
  getAllH(type, id, callback) {
    this.conn.query(
      `SELECT DH.ID, D.Devicename, Room.Roomname, DH.Turn_on_time, DH.Turn_off_time
      FROM Device_History DH, ${type}, Device D, Room
      WHERE DH.ID = ${type}.ID AND DH.ID = D.ID AND D.RoomID = Room.ID AND Room.HouseID = ${id}
      ORDER BY Turn_off_time DESC`,
      (error, results) => {
        if (error)
          return callback(null)
        else {
          results.forEach((element) => {
            let begin = new Date(element.Turn_on_time)
            let end = new Date(element.Turn_off_time)
            element.TimeUse = end - begin;
          });
          return callback(results)
        }
      }
    )
  }

  getH(id, callback) {
    this.conn.query(
      `SELECT * 
      FROM Device_History D
      Where D.ID = ?
      ORDER BY Turn_off_time DESC`,
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

  get(id, callback) {
    this.conn.query(
      `SELECT * 
      FROM Device
      Where Device.ID = ?`,
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
      FROM Device
      WHERE ID = ?`,
      [id],
      (error, results) => {
        if (error || results.length === 0) return callback(404, "Invalid ID")
        
        let query = ""
        if (updateInfo.Devicename) {
          if (query != "")
            query = query.concat(", ")
          query = query.concat(`Devicename = '${updateInfo.Devicename}'`)
        }
        if (updateInfo.Mode) {
          // this.sendData(updateInfo.Mode === "on" ? 1 : 0)
          if (query != "")
            query = query.concat(", ")
          query = query.concat(`Mode = '${updateInfo.Mode}'`)
        }
        if (updateInfo.RoomID) {
          if (query != "")
            query = query.concat(", ")
          query = query.concat(`RoomID = '${updateInfo.RoomID}'`)
        }
        if (query !== "") {
          this.conn.query(`UPDATE Device SET ${query} WHERE ID = ${id}`,
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

  turn(id, updateInfo, callback) {
    this.conn.query(
      `SELECT ID
      FROM Device
      WHERE ID = ?`,
      [id],
      (error, results) => {
        if (error || results.length === 0) return callback(404, "Invalid ID")
        let query = ""
        if (updateInfo.Device_Status !== "") {
          if (query != "")
            query = query.concat(", ")
          query = query.concat(`Device_Status = '${updateInfo.Device_Status}'`)
          query = query.concat(", ")
          query = query.concat(`Mode = '${updateInfo.Mode}'`)
        }
        ada.postData(id, updateInfo.Device_Status === "on" ? 1 : 0)
        if (query !== "") {
          this.conn.query(`UPDATE Device SET ${query} WHERE ID = ${id}`,
            (error, results) => {
              if (error)
                return callback(405, "invalid input")
              else {
                let queryH = ""
                const day = formatDate(new Date())
                if (updateInfo.Device_Status === "on") 
                  queryH = queryH.concat(`INSERT INTO Device_History (ID, Turn_on_Time) VALUES (${id}, '${day}')`)
                else 
                  queryH = queryH.concat(`UPDATE Device_History SET Turn_off_Time = '${day}' WHERE ID = ${id}`)
                console.log(queryH)
                  this.conn.query( queryH,
                  (error, results) => {
                    if (error) {
                      console.log(error)
                      return callback(405, "invalid input")
                    }
                    else
                      return callback(200, "success")
                  })
              }
            })
        } else {
          return callback(405, "empty input")
        }
      }
    )
  }
}

module.exports = DeviceModel