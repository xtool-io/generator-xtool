"use strict";
const Generator = require("yeoman-generator");
const project = require("../@core/project.js");
const ProjectType = require("../@core/project-type");

module.exports = class extends Generator {
  async prompting() {
    const prompts = [
      {
        type: "confirm",
        name: "someAnswer",
        message: "Bem vindo as opções de um projeto Angular?",
        default: true,
        when: (await project.getType()) === ProjectType.ANGULAR
      },
      {
        type: "confirm",
        name: "someAnswer",
        message: "Bem vindo as opções de um projeto Fullstack?",
        default: true,
        when: (await project.getType()) === ProjectType.FULLSTACK
      }
    ];
    this.answers = await this.prompt(prompts);
  }

  writing() {
    console.log("Writing...");
    project.getType().then(value => console.log(value));
    console.log(this.answers);
    // This.fs.copy(
    //   this.templatePath('dummyfile.txt'),
    //   this.destinationPath('dummyfile.txt')
    // );
  }
};
