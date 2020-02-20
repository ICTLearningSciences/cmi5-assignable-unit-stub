const path = require('path');
const fs = require('fs-extra');
const appRoot = require('app-root-path').path;

const installCmi5Lib = async () => {
  const libPath = path.join(
    appRoot,
    'node_modules',
    'redux-cmi5',
    'lib',
    'cmi5.js'
  );
  try {
    if (!(await fs.exists(libPath))) {
      console.warn(
        `react-cmi5 should install client lib 'cmi5.js' to public in the react project where it is installed, but library not found at ${libPath}`
      );
      // we probably are inside the react-cmi project itself and did `npm install`
      // there's no reason to do this library install in that context.
      // The library install is for clients/projects that *use* react-cmi5
      return;
    }
    const packagePath = path.join(appRoot, 'package.json')
    const dependencies = ((await fs.exists(packagePath)) ? require(packagePath).dependencies: {}) || {}
    const publicDir = 'gatsby' in dependencies ? 'static': 'public'
    const tgtPath = path.join(appRoot, publicDir, 'cmi5.js');
    console.log(
      `react-cmi5 will attempt to install client lib from ${libPath} to ${tgtPath}...`
    );
    await fs.ensureDir(path.dirname(tgtPath));
    await fs.copyFile(libPath, tgtPath);
  } catch (err) {
    console.error(`failed to install cmi5.js lib with error ${err.message}`);
  }
};

installCmi5Lib();
