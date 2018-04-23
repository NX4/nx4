const express = require("express");
const formidable = require("formidable");
util = require("util");
fs = require("fs");

const router = express.Router();

router.post("/", (req, res) => {
  var form = new formidable.IncomingForm();

  form.parse(req, function(err, fields, files) {
    res.writeHead(200, { "content-type": "text/plain" });
    fs.readFile(files.upload.path, function (err, data) {
      res.end(data);
    });
  });
});

module.exports = router;
