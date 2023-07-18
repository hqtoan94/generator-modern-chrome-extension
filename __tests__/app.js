'use strict';
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
  it('initiate project', async () => {
    await generateChomeExtension({
      uiFeatures: []
    });

    assert.file([
      '.gitignore',
      '.editorconfig',
      'app/manifest.json',
      'app/_locales/en/messages.json',
      'app/images/icon-16.png',
      'app/images/icon-128.png'
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
      'app/manifest.json',
      'app/_locales/en/messages.json',
      'app/images/icon-16.png',
      'app/images/icon-128.png',
      'app/scripts/contentscript.js'
    ]);

    assert.fileContent('app/manifest.json', '"content_scripts"');
  });
});
