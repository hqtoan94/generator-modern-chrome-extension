'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const _s = require('underscore.string');
const { isChecked } = require('./utils');

const chromeManifest = require('./chrome-manifest');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.srcScript = 'src/';
    this.srcConfig = 'config/';

    this.option('typescript');
  }

  _copyConfig(src, dest, metadata) {
    if (!dest) {
      dest = src;
    }

    this.fs.copyTpl(
      this.templatePath('config/' + src),
      this.destinationPath(this.srcConfig + dest),
      {
        ...metadata,
        typescript: this.options.typescript
      }
    );
  }

  _copyScript(src, dest, metadata) {
    if (!dest) {
      dest = src;
    }

    if (this.options.typescript) {
      dest = dest.replace('.js', '.ts');
    }

    this.fs.copyTpl(
      this.templatePath('src/' + src),
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

  webpackCommon() {
    this._copyConfig('webpack.common.js', null, {
      contentScript: isChecked(this.props.uiFeatures, 'contentScripts')
    });
  }

  webpackDev() {
    this._copyConfig('webpack.dev.js');
  }

  webpackProd() {
    this._copyConfig('webpack.prod.js');
  }

  packageJSON() {
    const devDependencies = {
      '@babel/core': '7.22.9',
      '@babel/preset-env': '7.22.9',
      'babel-loader': '9.1.3',
      webpack: '5.88.2',
      'webpack-cli': '5.1.4',
      'css-loader': '6.8.1',
      'node-sass': '9.0.0',
      'sass-loader': '13.3.2',
      'mini-css-extract-plugin': '^2.7.6'
    };

    if (this.options.typescript) {
      devDependencies.typescript = '^5.1.6';
      devDependencies['ts-loader'] = '^9.4.4';
    }

    this.packageJson.merge({
      name: _s.slugify(this.appname),
      version: '1.0.0',
      description: this.props.description,
      private: true,
      scripts: {
        test: 'echo "Error: no test specified" && exit 1',
        build: 'webpack --config config/webpack.prod.js',
        start: 'webpack --config config/webpack.dev.js'
      },
      author: '',
      license: 'ISC',
      devDependencies
    });
  }

  typeScriptConfig() {
    if (!this.options.typescript) {
      return;
    }

    this.fs.copyTpl(
      this.templatePath('_tsconfig.json'),
      this.destinationPath('tsconfig.json')
    );
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

  contentScript() {
    if (!isChecked(this.props.uiFeatures, 'contentScripts')) {
      return;
    }

    this._copyScript('entries/contentscript.js');
    this._copyScript('styles/contentscript.scss');
  }

  backgroundScript() {
    this._copyScript('entries/backgroundServiceWorker.js');
  }
};
