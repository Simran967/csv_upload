const mongoose = require("mongoose");

const csvFileSchema = new mongoose.Schema(
  {
    data: {
      csvFileName: String,
      csvData: Array,
    },
  },
  {
    timestamps: true,
  }
);

const csvFile = mongoose.model("csvFile", csvFileSchema);
module.exports = csvFile;