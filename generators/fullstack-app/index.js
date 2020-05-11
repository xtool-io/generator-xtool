"use strict";
const Generator = require("yeoman-generator");
const recursive = require("recursive-readdir");
const path = require("path");
const ejs = require("ejs");

/**
 * Gerador de scaffolding de projetos Spring Boot e Angular.
 * Os templates são organizados em /templates obedecendo o formato: VERSÃO_SPRINGBOOT:VERSÃO_ANGULAR
 * @type {exports}
 */
module.exports = class extends Generator {
  async prompting() {
    const prompts = [
      {
        type: "input",
        name: "projectName",
        message: "Digite o nome do projeto"
      },
      {
        type: "list",
        name: "versionOption",
        message: "Escolha a versão do Spring Boot e Angular",
        choices: [
          {
            name: "Spring Boot 2.1.0.RELEASE - Angular 7.1.0",
            value: "2.1.0:7.1.0"
          }
        ]
      }
    ];
    this.answers = await this.prompt(prompts);
  }

  /**
   * Itera por todos os arquivos do diretório de acordo com a versão especificada em 'versionOption'.
   * Caso o arquivo possui a extensão .ejs o mesmo será copiado com templatização e a extensão .ejs será removida
   * no final da cópia.
   * Caso não possua a extensão .ejs uma cópia sem templatização será realizada.
   * @returns {Promise<void>}
   */
  async writing() {
    const versionOption = this.answers.versionOption;
    let files = await recursive(`${this.sourceRoot()}/${versionOption}`);
    this.destinationRoot(this.answers.projectName);
    this.sourceRoot(`${this.sourceRoot()}/${versionOption}`);
    files
      .map(file => path.relative(this.sourceRoot(), file))
      .forEach(file => {
        let _file = ejs.render(file, this.answers);
        if (path.extname(_file) === ".ejs") {
          this.fs.copyTpl(
            this.templatePath(file),
            this.destinationPath(_file.replace(".ejs", "")),
            this.answers
          );
          return;
        }

        this.fs.copy(
          this.templatePath(file),
          this.destinationPath(_file),
          this.answers
        );
      });
  }
};