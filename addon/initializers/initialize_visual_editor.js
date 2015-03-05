/* globals ve: true, $: true */

import LazyLoader from 'ember-cli-lazyloader/lib/lazy-loader';
import veMock from '../lib/ve-mock';

var _scripts = [
  'visualEditor-base.js',
  'visualEditor-model.js',
  'visualEditor-ui.js'
];

function initPlatform(assetsRoot) {
  // HACK: this produces a failing request with fallback to 'en'
  // so we use 'en' right away
  if ($.i18n().locale.toLowerCase() === "en-us") {
    $.i18n().locale = "en";
  }
  // TODO: make this configurable
  ve.init.platform.addMessagePath(assetsRoot + 'ember-cli-visualeditor/i18n/oojs-ui/');
  ve.init.platform.addMessagePath(assetsRoot + 'ember-cli-visualeditor/i18n/ve/');
  return ve.init.platform.initialize();
}

var initializeVisualEditor = function(env) {
  // TODO: is there a way to get the addon name programmatically
  // so that we do not have 'ember-cli-visualeditor' as literal here
  var options = env["ember-cli-visualeditor"] || {};

  if (options.useMock) {
    window.ve = veMock;
    return;
  }

  var assetsRoot = options.assetsRoot || "";
  // append a trailing "/" to the assets route
  if (assetsRoot[assetsRoot.length-1] !== "/") {
    assetsRoot += "/";
  }
  assetsRoot += "ember-cli-visualeditor/";

  var scripts = _scripts.map(function(uri) {
    return assetsRoot +  uri;
  });

  var promise = LazyLoader.loadScripts(scripts);

  promise.then(function() {
    var stylesheet = assetsRoot + "styles/visualEditor.css";
    LazyLoader.loadCSS(stylesheet);
    return initPlatform(assetsRoot);
  }).catch(function() {
    console.error('Failed to load assets for ember-cli-visualeditor', arguments);
  });

  return promise;
};

export default initializeVisualEditor;
