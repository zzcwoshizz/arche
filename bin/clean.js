/* eslint-disable @typescript-eslint/no-var-requires */
const rimraf = require('rimraf');
const fs = require('fs');
const path = require('path');

rimraf.sync('dist');

function main() {
  process.chdir('packages');
  const dirs = fs.readdirSync('.');

  dirs.forEach((dir) => {
    rimraf.sync(path.join(process.cwd(), dir, 'dist'));
  });
}

main();
