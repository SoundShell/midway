'use strict';

const path = require('path');
const mkdirp = require('mkdirp');
const os = require('os');
const fs = require('fs');

module.exports = appInfo => {
  const exports = {};

  exports.rundir = path.join(appInfo.appDir, 'run');
  // 修改默认的日志名
  exports.midwayLogger = {
    clients: {
      coreLogger: {
        fileLogName: 'midway-core.log',
      },
      appLogger: {
        fileLogName: 'midway-web.log',
        aliasName: 'logger',
      },
      agentLogger: {
        fileLogName: 'midway-agent.log',
      },
    },
  };

  exports.pluginOverwrite = false;

  exports.security = {
    csrf: {
      ignoreJSON: false,
    },
  };

  // alinode runtime 写入的日志策略是: 如果 NODE_LOG_DIR 有设置，写入 NODE_LOG_DIR 设置的目录；否则为 /tmp
  let alinodeLogdir = fs.existsSync('/tmp') ? '/tmp' : os.tmpdir();
  // try to use NODE_LOG_DIR first
  if (process.env.NODE_LOG_DIR) {
    alinodeLogdir = process.env.NODE_LOG_DIR;
  }
  mkdirp.sync(alinodeLogdir);

  exports.alinode = {
    logdir: alinodeLogdir,
    error_log: [
      path.join(appInfo.root, `logs/${appInfo.pkg.name}/common-error.log`),
      path.join(appInfo.root, 'logs/stderr.log'),
    ],
    packages: [path.join(appInfo.appDir, 'package.json')],
  };

  return exports;
};
