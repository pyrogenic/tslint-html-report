
(function () {

  'use strict';

  const fs = require('fs');
  const funkyLogger = require('./funky-logger');
  const path = require('path');

  function validateConfig(config) {

    const basePath = path.join(__dirname, '..', '..');
    let extendedConfig = {};

    function recursiveMkDir(outDir) {
      let folders = outDir.split('/');
      let folderPath = basePath;
      folders.forEach((folder) => {
        if (folder) {
          folderPath = path.join(folderPath + '/' + folder);
          if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath);
          }
        }
      });
    }

    const defaultConfig = {
      tslint: 'node_modules/tslint-html-report/tslint.json',
      srcFiles: 'src/**/*.ts',
      outDir: 'reports/tslint-html-report',
      json: 'tslint-report.json',
      html: 'tslint-report.html',
      exclude: [],
      breakOnError: false,
      tsconfig: 'tsconfig.json',
      typeCheck: false,
      fast: false,
    }

    if (config) {
      if (config.tslint && !fs.existsSync(__dirname + '/../../' + config.tslint)) {
        console.info(funkyLogger.color('yellow', 'info: tslint.json not found, using default config file'));
        config.tslint = defaultConfig.tslint;
      }
      if (config.typeCheck && !fs.existsSync(__dirname + '/../../' + config.tsconfig)) {
        console.info(funkyLogger.color('yellow', 'info: tsconfig.json not found, type checking will be disabled'));
        config.typeCheck = defaultConfig.typeCheck;
      }
      extendedConfig.tslint = config.tslint || defaultConfig.tslint;
      extendedConfig.srcFiles = config.srcFiles || defaultConfig.srcFiles;
      extendedConfig.outDir = config.outDir || defaultConfig.outDir;
      extendedConfig.json = config.json || defaultConfig.json;
      extendedConfig.html = config.html || defaultConfig.html;
      extendedConfig.exclude = defaultConfig.exclude;
      extendedConfig.breakOnError = config.breakOnError;
      extendedConfig.typeCheck = config.typeCheck;
      extendedConfig.tsconfig = config.tsconfig  || defaultConfig.tsconfig;
      if (config.exclude) {
        extendedConfig.exclude = Array.isArray(config.exclude) ? config.exclude : extendedConfig.exclude.push(config.exclude);
      }
      extendedConfig.fast = config.fast === undefined ? extendedConfig.fast : config.fast;
    } else {
      extendedConfig = defaultConfig;
    }

    recursiveMkDir(extendedConfig.outDir);

    extendedConfig.tslint = path.join(basePath, extendedConfig.tslint);
    extendedConfig.tsconfig = path.join(basePath, extendedConfig.tsconfig);
    extendedConfig.srcFiles = path.join(basePath, extendedConfig.srcFiles);
    extendedConfig.outDir = path.join(basePath, extendedConfig.outDir);

    extendedConfig.jsonReport = path.join(extendedConfig.outDir, extendedConfig.json);
    extendedConfig.finalReport = path.join(extendedConfig.outDir, extendedConfig.html);


    console.info('Config used for generation of report: ');
    console.info(funkyLogger.color('cyan', 'Path to tslint.json: '),
      funkyLogger.color('magenta', extendedConfig.tslint));
    if (extendedConfig.typeCheck) {
      console.info(funkyLogger.color('cyan', 'Path to tsconfig.json: '),
        funkyLogger.color('magenta', extendedConfig.tsconfig));
    }
    console.info(funkyLogger.color('cyan', 'Source files to be linted: '),
      funkyLogger.color('magenta', extendedConfig.srcFiles));
    console.info(funkyLogger.color('cyan', 'Output path for HTML report: '),
      funkyLogger.color('magenta', extendedConfig.finalReport));

    return extendedConfig;

  }

  module.exports = validateConfig;

}());
