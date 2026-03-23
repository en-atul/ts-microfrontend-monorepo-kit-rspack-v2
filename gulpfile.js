const { series, parallel, watch } = require('gulp');
const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs');
const path = require('path');

const execAsync = promisify(exec);

const appsDir = path.resolve('./apps');
const cliDir = path.resolve('./packages/dev-cli');

function getAppDirs() {
  const topLevelDirs = fs.readdirSync(appsDir).filter((dir) => {
    const fullPath = path.join(appsDir, dir);
    return fs.statSync(fullPath).isDirectory();
  });

  const appDirs = [];
  topLevelDirs.forEach((dir) => {
    const fullPath = path.join(appsDir, dir);
    if (fs.existsSync(path.join(fullPath, 'package.json'))) {
      appDirs.push(dir);
      return;
    }

    const nestedDirs = fs.readdirSync(fullPath).filter((nested) => {
      const nestedPath = path.join(fullPath, nested);
      return fs.statSync(nestedPath).isDirectory() && fs.existsSync(path.join(nestedPath, 'package.json'));
    });
    nestedDirs.forEach((nested) => appDirs.push(path.join(dir, nested)));
  });

  return appDirs;
}

function buildApp(appName) {
  return async function buildAppTask() {
    const cwd = path.join(appsDir, appName);
    console.log(`🔧 Building ${appName}...`);
    await execAsync('pnpm gulp', { cwd, stdio: 'inherit' });
    console.log(`✅ Done: ${appName}`);
  };
}

async function buildCli() {
  console.log('🔧 Building CLI...');
  await execAsync('pnpm run build', { cwd: cliDir, stdio: 'inherit' });
  console.log('✅ CLI build complete');
}

function watchCli() {
  console.log('👀 Watching CLI for changes...');
  return watch(
    ['src/**/*.ts'],
    { cwd: cliDir },
    series(buildCli)
  );
}

const buildAllApps = parallel(...getAppDirs().map(buildApp));

exports.default = series(buildAllApps);
exports.cli = series(buildCli);
exports.watch = watchCli;
