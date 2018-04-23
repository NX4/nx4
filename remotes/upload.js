const express = require("express");
const formidable = require("formidable");
const controllers = require("../controllers");

util = require("util");
fs = require("fs");

const router = express.Router();

router.post("/", (req, res) => {
  var form = new formidable.IncomingForm();

  form.parse(req, function(err, fields, files) {
    fs.readFile(files.upload.path, "utf8", (err, data) => {
      controllers.entropy(data).then(responce => {
        res.send(responce);
      });
    });
  });
});

module.exports = router;
