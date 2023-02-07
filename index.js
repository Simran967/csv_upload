// Storing/Importing required libraries in variables
const express = require("express");
const app = express();
const port = 8000;
const path = require("path");
// importing multipart to support csv file while uploading
var multipart = require("connect-multiparty");
// importing to convert csv to json to store in db(json format)
const CSVToJSON = require("csvtojson");
const csvFile = require("./models/csvFileSchema");
const db = require("./config/mongoose");
var multipartMiddleware = multipart();

// Setting the path for views directory
app.set("views", path.join(__dirname, "views"));
// Setting view engine as ejs
app.set("view engine", "ejs");
app.use(express.static("assets"));
// Setting the renderFile method as the rendering engine for ejs files
app.engine("ejs", require("ejs").renderFile);
// middleware
app.use(express.urlencoded());

// finding files which are present in db and render it on front screen
app.get("/", (_req, res) => {
  csvFile.find({}, { "data.csvFileName": 1 }, (_err, csvFiles) => {
    try {
      res.render("csv", { showTableData: false, csvFiles });
    } catch (err) {
      console.log(`Error in showing csv: ${err}`);
      return;
    }
  });
});

// using multipart middleware creating csv to json (stored in db)
app.post("/", multipartMiddleware, (req, res) => {
  CSVToJSON()
    .fromFile(req.files.csv.path)
    .then((datas) => {
      if (req.files.csv.type === "text/csv") {
        csvFile.create({
          data: {
            csvFileName: req.files.csv.name,
            csvData: datas,
          },
        });
      }
    });
  return res.redirect("back");
});

// get csv file  whose data needs to be shown
app.get("/csv_data_file/:csvFileName", (req, res) => {
  csvFile.findOne(
    { "data.csvFileName": req.params.csvFileName },
    (_err, data) => {
      try {
        res.render("csv", {
          showTableData: true,
          data: data.data,
        });
      } catch (err) {
        console.log(err);
      }
    }
  );
});

// listening port number
app.listen(port, function (err) {
  if (err) {
    console.log(`Error in running the server : ${err}`);
    return;
  }
  console.log(`Server is up and running on port : ${port}`);
});
