require('dotenv').config();
const { upload } = require('bugsnag-sourcemaps');
const { resolve } = require('path');
const fs = require('fs');

const config = {
  apiKey: process.env.REACT_APP_BUGSNAG_KEY,
  appVersion: process.env.REACT_APP_APP_VERSION,
  releaseStage: process.env.REACT_APP_RELEASE_STAGE,
  overwrite: true
};

let sourceMapPath = '';

fs.readdirSync('build/static/js').forEach(file => {
  const isMinifiedFile = /main\.(\w+)\.js$/.test(file);
  if (isMinifiedFile) {
    const url = process.env.REACT_APP_SITE_URL.replace('://', '://*'); // Wildcard fix

    config.minifiedUrl = `${url}/static/js/${file}`;
    config.minifiedFile = resolve(__dirname, `./build/static/js/${file}`);
  }

  const isSourceMapFile = /main\.(\w+)\.js.map$/.test(file);
  if (isSourceMapFile) {
    sourceMapPath = resolve(__dirname, `./build/static/js/${file}`);
    config.sourceMap = sourceMapPath;
  }
});

console.log('~~ Sourcemap Config ~~');
console.log(config);

new upload(config)
  .then(() => {
    console.log('Sourcemap uploaded to Bugsnag!!!');
    fs.unlinkSync(sourceMapPath);
    process.exit();
  })
  .catch(err => {
    console.log('[Sourcemap Upload Error]');
    console.log(err);
    process.exit(1);
  });
