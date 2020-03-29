const express = require("express");
const mongoose = require("mongoose");

const users = require("./routes/api/users");

const app = express();
console.log(__dirname);
// Db config
const db = require("./config/keys").mongoURI;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
mongoose
  .connect(db, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => console.log("db connected"))
  .catch(err => console.log(err));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); 
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token");
  next();
});

//   Routes
app.use("/api/users", users);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening at ${port}`));
