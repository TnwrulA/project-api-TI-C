const { ObjectId } = require("mongodb");

function getReportModel(db) {
  return db.collection("reports");
}

module.exports = getReportModel;
