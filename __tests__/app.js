const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

const defaultAppPrompts = {
  name: 'ModernChromeExtension',
  description: 'Test description',
  uiFeatures: []
};

const generateChomeExtension = (appPrompts, appOptions = {}) => {
  return helpers
    .run(path.join(__dirname, '../generators/app'))
    .withPrompts({
      ...defaultAppPrompts,
      ...appPrompts
    })
    .withOptions(appOptions);
};

describe('generator-modern-chrome-extension:app', () => {
  describe('generate js project', () => {
    it('initiate project without uiFeatures', async () => {
      await generateChomeExtension({
        uiFeatures: []
      });

      assert.file([
        '.gitignore',
        '.editorconfig',
        'package.json',
        'config/webpack.common.js',
        'config/webpack.dev.js',
        'config/webpack.prod.js',
        'app/manifest.json',
        'app/_locales/en/messages.json',
        'app/images/icon-16.png',
        'app/images/icon-128.png',
        'src/entries/backgroundServiceWorker.js'
      ]);

      assert.fileContent([
        ['app/manifest.json', '"service_worker"'],
        ['app/manifest.json', '"scripts/backgroundServiceWorker.js"'],
        ['config/webpack.common.js', "'babel-loader'"],
        ['config/webpack.common.js', 'backgroundServiceWorker'],
        [
          'config/webpack.common.js',
          './src/entries/backgroundServiceWorker.js'
        ],
        ['config/webpack.common.js', 'contentscript'],
        ['config/webpack.common.js', './src/entries/contentscript.js']
      ]);
      assert.noFile(['app/scripts/contentscript.js']);
      assert.noFileContent('app/manifest.json', '"content_scripts"');
    });

    it('initiate content script project', async () => {
      await generateChomeExtension({
        uiFeatures: ['contentScripts']
      });

      assert.file([
        '.gitignore',
        '.editorconfig',
        'package.json',
        'config/webpack.common.js',
        'config/webpack.dev.js',
        'config/webpack.prod.js',
        'app/manifest.json',
        'app/_locales/en/messages.json',
        'app/images/icon-16.png',
        'app/images/icon-128.png',
        'src/entries/backgroundServiceWorker.js',
        'src/entries/contentscript.js'
      ]);

      assert.fileContent([
        ['app/manifest.json', '"service_worker"'],
        ['app/manifest.json', '"content_scripts"'],
        ['app/manifest.json', '"scripts/backgroundServiceWorker.js"'],
        ['config/webpack.common.js', "'babel-loader'"],
        ['config/webpack.common.js', 'backgroundServiceWorker'],
        [
          'config/webpack.common.js',
          './src/entries/backgroundServiceWorker.js'
        ],
        ['config/webpack.common.js', 'contentscript'],
        ['config/webpack.common.js', './src/entries/contentscript.js']
      ]);
    });
  });

  describe('generate ts project', () => {
    it('initiate project', async () => {
      await generateChomeExtension(
        {
          uiFeatures: []
        },
        { typescript: true }
      );

      assert.file([
        '.gitignore',
        '.editorconfig',
        'package.json',
        'tsconfig.json',
        'config/webpack.common.js',
        'config/webpack.dev.js',
        'config/webpack.prod.js',
        'app/manifest.json',
        'app/_locales/en/messages.json',
        'app/images/icon-16.png',
        'app/images/icon-128.png',
        'src/entries/backgroundServiceWorker.ts'
      ]);

      assert.fileContent([
        ['app/manifest.json', '"service_worker"'],
        ['app/manifest.json', '"scripts/backgroundServiceWorker.js"'],
        ['config/webpack.common.js', "'ts-loader'"],
        ['config/webpack.common.js', 'backgroundServiceWorker'],
        [
          'config/webpack.common.js',
          './src/entries/backgroundServiceWorker.ts'
        ],
        ['config/webpack.common.js', 'contentscript'],
        ['config/webpack.common.js', './src/entries/contentscript.ts']
      ]);
      assert.noFile(['app/scripts/contentscript.ts']);
      assert.noFileContent('app/manifest.json', '"content_scripts"');
    });

    it('initiate content script project', async () => {
      await generateChomeExtension(
        {
          uiFeatures: ['contentScripts']
        },
        { typescript: true }
      );

      assert.file([
        '.gitignore',
        '.editorconfig',
        'package.json',
        'tsconfig.json',
        'config/webpack.common.js',
        'config/webpack.dev.js',
        'config/webpack.prod.js',
        'app/manifest.json',
        'app/_locales/en/messages.json',
        'app/images/icon-16.png',
        'app/images/icon-128.png',
        'src/entries/backgroundServiceWorker.ts',
        'src/entries/contentscript.ts'
      ]);

      assert.fileContent([
        ['app/manifest.json', '"service_worker"'],
        ['app/manifest.json', '"content_scripts"'],
        ['app/manifest.json', '"scripts/backgroundServiceWorker.js"'],
        ['config/webpack.common.js', "'ts-loader'"],
        ['config/webpack.common.js', 'backgroundServiceWorker'],
        [
          'config/webpack.common.js',
          './src/entries/backgroundServiceWorker.ts'
        ],
        ['config/webpack.common.js', 'contentscript'],
        ['config/webpack.common.js', './src/entries/contentscript.ts']
      ]);
    });
  });
});
