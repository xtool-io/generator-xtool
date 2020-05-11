"use strict";
const Generator = require("yeoman-generator");
const project = require("../@core/project.js");
const ProjectType = require("../@core/project-type");

/**
 * Gerador principal.
 *
 * @type {exports}
 */
module.exports = class extends Generator {
  async initializing() {
    this.projectType = await project.getType();
  }

  async prompting() {
    const prompts = [
      {
        type: "list",
        name: "mainOption",
        message: "O que vc deseja fazer?",
        choices: [
          {
            name: "Gerar um projeto Spring Boot e Angular?",
            value: "../fullstack-app"
          }
        ],
        when: this.projectType === ProjectType.NONE
      }
    ];
    this.answers = await this.prompt(prompts);
  }

  end() {
    this.composeWith(require.resolve(this.answers.mainOption));
  }
};
