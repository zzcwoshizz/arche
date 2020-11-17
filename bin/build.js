/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const copySync = require('./copySync');
const execSync = require('./execSync');

const argv = ['--rootDir', 'packages', '--outDir', 'dist'];

execSync('node_modules/.bin/tsc ' + argv.join(' '));

function main() {
  process.chdir('dist');

  const dirs = fs.readdirSync('.');

  dirs.forEach((dir) => {
    copySync(dir + '/src', `../packages/${dir}/dist`);
    copySync(`../packages/${dir}/package.json`, `../packages/${dir}/dist/package.json`);
  });
}

main();
