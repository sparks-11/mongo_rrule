const express = require("express");
const bodyParser = require("body-parser");
const process = require("process");
const app = express();
const port = process.env.PORT || 1337;
const mongoose = require("mongoose");
const path = require("path");

const User = require("./models/User");
const moment = require("moment/moment");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var uri =
  "mongodb+srv://sparks_WTdb:5MKvRmzFoFVsOLdd@wtcluster.vteglbf.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true });
const connection = mongoose.connection;
connection.once("open", function () {
  console.log("MongoDB database connection established successfully");
});

var RRule = require("rrule").RRule;
const todayFormat = moment().format("YYYY-MM-DD");

console.log("new time", new Date(`${todayFormat} `));

let list = {
  shopName: "dhaba",
  address: 137,
  status: "active",
  happyHourDetails: {
    type: "custom",
    value: [
      {
        day: "monday",
        startTime: "8:00",
        endTime: "9:00",
      },
      {
        day: "tuesday",
        startTime: "8:00",
        endTime: "9:00",
      },
    ],
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    ProductDetails: [
      {
        itemCategory: [
          {
            category: "breakFast",
            discount: "10",
          },
        ],
        individualItems: [
          {
            itemName: "pizza",
            dicount: "5",
            itemPrice: "200",
          },
        ],
      },
    ],
  },
};

function ruleCase(day) {
  switch (day) {
    case "monday":
      return RRule.MO;
      break;
    case "tuesday":
      return RRule.TU;
      break;
    case "wednesday":
      return RRule.WE;
      break;
    case "thursday":
      return RRule.TH;
      break;
    case "friday":
      return RRule.FR;
      break;
    case "saturday":
      return RRule.SA;
      break;
    case "sunday":
      return RRule.SU;
      break;

    default:
      break;
  }
}

function monthlyRule(data) {
  let monthlyRule = [];
  data.happyHourDetails.value.map((i) => {
    const newRule = new RRule({
      freq: RRule.MONTHLY,
      count: 4,
      interval: 1,
      wkst: RRule.SU,
      byweekday: [ruleCase(i.day)],
      byhour: [16],
      byminute: [0],
    }).all();

    monthlyRule = [...monthlyRule, ...newRule];

    //this is for getting the individual start time and end time
    // const monthlyEvents = [];
    // newRule.map((rule) => {
    //   const monthlyEvent = {
    //     rule,
    //     startHour: i.startTime,
    //     endHour: i.endTime,
    //     eventDate: `${new Date(rule).getFullYear()}-${
    //       new Date(rule).getMonth() + 1
    //     }-${new Date(rule).getDate()}`,
    //   };
    //   monthlyEvents.push(monthlyEvent);
    // });

    // monthlyRule = [...monthlyRule, ...monthlyEvents];
  });
  return monthlyRule;
}

// monthlyRule();

const isOverlap = (createEvent, presentEvent) => {
  for (let i = 0; i < presentEvent.length; i++) {
    console.log(createEvent[i] === presentEvent[i]);
    if (createEvent.includes(presentEvent[i])) return true;
  }
  return false;
};

const findIsOverLap = (req, res) => {
  // console.log(req.body);
  User.findOne({
    shopName: req.body.shopName,
  })
    .then((data) => {
      let presentEvent = [];
      let createEvent = [];
      presentEvent = monthlyRule(data);
      createEvent = monthlyRule(req.body);

      console.log(presentEvent, createEvent);
      const isOverLaped = isOverlap(createEvent, presentEvent);
      console.log("isover lapping status", isOverLaped);
      if (!isOverLaped) {
        User.create(req.body)
          .then(() => {
            res.send("listning on port" + port);
          })
          .catch((err) => {
            res.status(400).json({ error: err });
          });
      } else {
        res.status(400).json({ error: "it is over laping " });
      }
    })
    .catch((err) => {
      User.create(req.body)
        .then((result) => {
          res.send("successfully created" + result);
        })
        .catch((err) => {
          res.status(400).json({ error: err });
        });
    });
};

app.get("/", (req, res) => {
  User.create(list)
    .then(() => {
      res.send("listning on port" + port);
    })
    .catch((err) => {
      res.send("err" + err);
    });
});

app.post("/create", (req, res) => {
  findIsOverLap(req, res);
});

// app.post("/", (req, res) => {
//   User.create(list)
//     .then(() => {
//       res.send("listning on port" + port);
//     })
//     .catch((err) => {
//       res.send("err" + err);
//     });
// });

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
