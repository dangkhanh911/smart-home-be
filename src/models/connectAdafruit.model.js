const Model = require("./model")
const axios = require("axios");
const EventsController = require('../controllers/events.controller')
const formatDate = require('../utils/formatDate')

require('dotenv').config()
const mqtt = require('mqtt')
let client = mqtt.connect(`mqtt://${process.env.ADAFRUIT_IO_USERNAME}:${process.env.ADAFRUIT_IO_KEY}@io.adafruit.com`,
  8883
);

// console.log(client)


const GetData = () => {
  const model = new Model;

  client.on("connect", function () {
    client.subscribe(`${process.env.ADAFRUIT_IO_USERNAME}/feeds/cambien1`); // tem
    client.subscribe(`${process.env.ADAFRUIT_IO_USERNAME}/feeds/cambien2`); // hum
    client.subscribe(`${process.env.ADAFRUIT_IO_USERNAME}/feeds/cambien3`); // hong ngoai True/False
    client.subscribe(`${process.env.ADAFRUIT_IO_USERNAME}/feeds/nutnhan1`); // quat
    client.subscribe(`${process.env.ADAFRUIT_IO_USERNAME}/feeds/nutnhan2`); // may bom
    client.subscribe(`${process.env.ADAFRUIT_IO_USERNAME}/feeds/nutnhan3`); // cửa
    console.log("Connect to adafruit success");
  });

  client.on("message", async function (topic, message) {
    if (topic == `${process.env.ADAFRUIT_IO_USERNAME}/feeds/cambien1`) {
      let data = Number.parseFloat(message)
      const day = formatDate(new Date())
      model.conn.query(
        `INSERT INTO RecordT(TimeDate, Temperature, SensorID) VALUES ('${day}',${data},'1')`,
        (error, results) => {
          if (error)
            console.log(error)
        }
      )
    }
    if (topic == `${process.env.ADAFRUIT_IO_USERNAME}/feeds/cambien2`) {
      let data = Number.parseFloat(message)
      const day = formatDate(new Date())
      model.conn.query(
        `INSERT INTO RecordH(TimeDate, Humidity, SensorID) VALUES ('${day}',${data},'1')`,
        (error, results) => {
          if (error)
            console.log(error)
        }
      )
    }
    if (topic == `${process.env.ADAFRUIT_IO_USERNAME}/feeds/cambien3`) {
      let data = (message.toString())
      let id = 1
      let queryH = ""
      const day = formatDate(new Date())
      if (data === "True")
        queryH = queryH.concat(`INSERT INTO Device_History (ID, Turn_on_Time) VALUES (${id}, '${day}')`)
      else
        queryH = queryH.concat(`UPDATE Device_History SET Turn_off_Time = '${day}' WHERE ID = ${id}`)
      model.conn.query(queryH, (error, results) => {
        if (error) {
          console.log(error)
        }
      })
    }
    if (topic == `${process.env.ADAFRUIT_IO_USERNAME}/feeds/nutnhan1`) {
      let data = Number.parseInt(message)
      let id = 2
      let queryH = ""
      const day = formatDate(new Date())
      if (data === "True")
        queryH = queryH.concat(`INSERT INTO Device_History (ID, Turn_on_Time) VALUES (${id}, '${day}')`)
      else
        queryH = queryH.concat(`UPDATE Device_History SET Turn_off_Time = '${day}' WHERE ID = ${id}`)
      model.conn.query(queryH, (error, results) => {
        if (error) {
          console.log(error)
        }
      })
    }
    if (topic == `${process.env.ADAFRUIT_IO_USERNAME}/feeds/nutnhan2`) {
      let data = Number.parseInt(message)
      let id = 3
      let queryH = ""
      const day = formatDate(new Date())
      if (data === "True")
        queryH = queryH.concat(`INSERT INTO Device_History (ID, Turn_on_Time) VALUES (${id}, '${day}')`)
      else
        queryH = queryH.concat(`UPDATE Device_History SET Turn_off_Time = '${day}' WHERE ID = ${id}`)
      model.conn.query(queryH, (error, results) => {
        if (error) {
          console.log(error)
        }
      })
    }
  })

  

  // setInterval(() => {
  //   const model = new Model;
  //   const url_cambien2 = "https://io.adafruit.com/api/v2/phatnguyen1604/feeds/cambien2"

  //   const getLatestData = async () => {
  //     const { data } = await axios.get(url_cambien2);
  //     return data;
  //   }

  //   const day = formatDate(new Date())

  //   getLatestData()
  //     .then((data) => {
  //       if (data.last_value != lastTemp) {
  //         EventsController.sendEventsToAll(data.last_value)
  //         lastTemp = data.last_value
  //       }
  //       model.conn.query(
  //         `INSERT INTO Record(TimeDate, Temperature, Humidity, SensorID) VALUES ('${day}',${data.last_value},${data.last_value},'1')`,
  //         (error, results) => {
  //           if (error)
  //             console.log(error)
  //           else
  //             console.log("sucess")
  //         }
  //       )
  //     })
  //     .catch(error => console.log(error))
  // }, 5000)
}

const postData = (id, data) => {
  let des;
  if (id === 1) 
    des = "nutnhan1"
  else if (id === 2)
    des = "nutnhan2"
  console.log(`${process.env.ADAFRUIT_IO_USERNAME}/feeds/${des} ` + data)
  try {
    client.publish(`${process.env.ADAFRUIT_IO_USERNAME}/feeds/${des}`, data.toString())
  }
  catch (error) {
    console.log(error)
  }
   //hong ngoai 
}
module.exports = {GetData, postData}