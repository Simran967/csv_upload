require("dotenv").config();
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);
mongoose.connect(`mongodb+srv://simran_singh:${process.env.PASSWORD}@codingninjas.chfmur6.mongodb.net/csv_upload_db`, () => {
  console.log("Connected to MongoDB");
});