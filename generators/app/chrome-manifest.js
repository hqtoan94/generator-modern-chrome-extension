/* eslint-disable camelcase */
'use strict';

const headerize = require('headerize');
const Manifest = require('chrome-manifest');
const { isChecked } = require('./utils');

const chromePrimaryPermissions = [];

const chromeUIActions = [];

const chromeUIFeatures = ['optionsUI', 'contentScripts', 'omnibox'];

function getChoices(target) {
  return target.map(function(p) {
    return {
      value: p,
      name: headerize(p),
      checked: false
    };
  });
}

module.exports = {
  primaryPermissions: chromePrimaryPermissions,
  uiActions: chromeUIActions,
  uiFeatures: chromeUIFeatures,
  permissionChoices: function(allOfPermissions) {
    let permissions = chromePrimaryPermissions;

    if (allOfPermissions) {
      permissions = permissions.concat(
        Object.keys(
          Manifest.queryMetadata({
            channel: 'stable',
            extensionTypes: ['extension']
          }).permissions
        )
      );
    }

    return getChoices(permissions);
  },
  uiActionChoices: function() {
    return getChoices(chromeUIActions);
  },
  uiFeatureChoices: function() {
    return getChoices(chromeUIFeatures);
  },
  createManifest: function(opts) {
    const manifest = new Manifest({
      name: '__MSG_appName__',
      version: '0.0.1',
      manifest_version: 3,
      description: '__MSG_appDescription__',
      icons: {
        '16': 'images/icon-16.png',
        '128': 'images/icon-128.png'
      },
      default_locale: 'en',
      background: {
        service_worker: 'scripts/backgroundScripts.js'
      }
    });

    manifest.merge(
      new Manifest({
        fields: opts.fields,
        permissions: opts.permissions
      })
    );

    if (isChecked(opts.fields, 'contentScripts')) {
      manifest.merge({
        content_scripts: [
          {
            css: ['styles/contentscript.css']
          }
        ]
      });
    }

    return manifest;
  }
};
