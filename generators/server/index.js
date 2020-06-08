"use strict";
const Generator = require("yeoman-generator");
const express = require("express");
const app = express();
const port = 3000;

module.exports = class extends Generator {
  initializing() {
    app.get("/", (req, res) => res.send("Hello World!"));
    app.listen(port, () =>
      console.log(`Example app listening at http://localhost:${port}`)
    );
  }

  prompting() {}

  writing() {}

  install() {}
};
COmunica;
