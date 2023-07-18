'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const { isChecked } = require('./utils');

var chromeManifest = require('./chrome-manifest');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.srcScript = 'app/scripts/';

    this.option('typescript');
  }

  _copyScript(src, dest, metadata) {
    if (!dest) {
      dest = src;
    }

    if (this.options.typescript) {
      dest = dest.replace('.js', '.ts');
    }

    this.fs.copyTpl(
      this.templatePath('scripts/' + src),
      this.destinationPath(this.srcScript + dest),
      {
        ...metadata,
        typescript: this.options.typescript
      }
    );
  }

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
        name: 'name',
        message: 'What would you like to call this extension?',
        default: this.appname ? this.appname : 'MyChromeExtension'
      },
      {
        name: 'description',
        message: 'How would you like to describe this extension?',
        default: 'My Chrome Extension'
      },
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

  contentScript() {
    if (!isChecked(this.props.uiFeatures, 'contentScripts')) {
      return;
    }

    this._copyScript('contentscript.js');
  }

  assets() {
    const locale = {
      name: this.props.name,
      description: this.props.description
    };
    this.fs.copyTpl(
      this.templatePath('_locales/en/messages.json'),
      this.destinationPath('app/_locales/en/messages.json'),
      locale
    );

    this.fs.copy(
      this.templatePath('images/icon-16.png'),
      this.destinationPath('app/images/icon-16.png')
    );

    this.fs.copy(
      this.templatePath('images/icon-128.png'),
      this.destinationPath('app/images/icon-128.png')
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
