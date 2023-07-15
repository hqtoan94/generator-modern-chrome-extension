/* eslint-disable camelcase */
'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');

var chromeManifest = require('./chrome-manifest');

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(
        `Welcome to the majestic ${chalk.red(
          'generator-modern-chrome-extension'
        )} generator!`
      )
    );

    const prompts = [
      {
        type: 'checkbox',
        name: 'uiFeatures',
        message: 'Would you like more UI Features?',
        choices: chromeManifest.uiFeatureChoices
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  git() {
    this.fs.copyTpl(
      this.templatePath('gitignore'),
      this.destinationPath('.gitignore')
    );
  }

  editorConfig() {
    this.fs.copy(
      this.templatePath('editorconfig'),
      this.destinationPath('.editorconfig')
    );
  }

  manifest() {
    const manifest = {
      fields: this.props.uiFeatures
    };
    this.manifest = chromeManifest.createManifest(manifest);

    this.fs.writeJSON(this.destinationPath('app/manifest.json'), this.manifest);
  }

  install() {
    this.installDependencies({
      yarn: true
    });
  }
};
