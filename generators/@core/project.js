"use strict";
const fs = require("fs");
const ProjectType = require("./project-type");
const xml2js = require("xml2js");
const path = require("path");

/**
 *
 */

class Project {
  constructor() {
    this.execDir = process.cwd();
  }

  /**
   * Retorna o tipo de projeto.
   * @returns {Promise<string>}
   */
  async getType() {
    if (fs.existsSync(`${this.execDir}/package.json`)) {
      let pjson = JSON.parse(fs.readFileSync(`${this.execDir}/package.json`));
      if (pjson.dependencies && pjson.dependencies["@angular/core"]) {
        return ProjectType.ANGULAR;
      }
    } else if (fs.existsSync(`${this.execDir}/pom.xml`)) {
      let pom = await xml2js.parseStringPromise(
        fs.readFileSync(`${this.execDir}/pom.xml`),
        { explicitArray: false }
      );
      if (pom.project.parent) {
        if (pom.project.parent.artifactId === "spring-boot-starter-parent") {
          let dirName = path.basename(this.execDir);
          if (
            fs.existsSync(`${this.execDir}/${dirName}-backend`) &&
            fs.existsSync(`${this.execDir}/${dirName}-frontend`)
          ) {
            return ProjectType.FULLSTACK;
          }

          return ProjectType.SPRINGBOOT;
        }
      }
    }

    return ProjectType.NONE;
  }
}

const singletonProject = new Project();
Object.freeze(singletonProject);
module.exports = singletonProject;
