import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import minify from 'rollup-plugin-babel-minify';
import replace from 'rollup-plugin-replace';
// Require understands JSON files.
const packageJson = require('./package.json');

const peerDependencies = Object.keys(packageJson.peerDependencies);
const dependencies = Object.keys(packageJson.dependencies);

function baseConfig() {
  return {
    moduleName: 'ReactEmptyState',
    entry: 'src/index.js',
    plugins: [
      nodeResolve(),
      commonjs({
        include: 'node_modules/**'
      }),
      babel({
        plugins: ['external-helpers'],
      }),
    ],
    sourceMap: true,
  };
}

function baseUmdConfig(minified) {
  const config = Object.assign(baseConfig(), {
    globals: {
      react: 'React',
      'react-dom': 'ReactDOM',
    },
    external: peerDependencies,
  });
  config.plugins.push(replace({
    'process.env.NODE_ENV': JSON.stringify('production'),
  }));

  if (minified) {
    config.plugins.push(minify({ comments: false }));
  }

  return config;
}

/*
  COMMONJS / MODULE CONFIG
  ------------------------

  Goal of this configuration is to generate bundles to be consumed by bundlers.
  This configuration is not minimized and will import all dependencies.
*/
const libConfig = baseConfig();
// Do not include any of the dependencies
libConfig.external = peerDependencies.concat(dependencies);
libConfig.targets = [
  { dest: 'dist/react-empty-state.cjs.js', format: 'cjs' },
  { dest: 'dist/react-empty-state.es.js', format: 'es' },
];

const umdFullConfig = baseUmdConfig(false);
umdFullConfig.targets = [
  { dest: 'dist/react-empty-state.full.js', format: 'umd' },
];

// Validate globals in main UMD config
const missingGlobals = peerDependencies.filter(dep => !(dep in umdFullConfig.globals));
if (missingGlobals.length) {
  console.error('All peer dependencies need to be mentioned in globals, please update rollup.config.js.');
  console.error('Missing: ' + missingGlobals.join(', '));
  console.error('Aborting build.');
  process.exit(1);
}

const umdFullConfigMin = baseUmdConfig(true);
umdFullConfigMin.targets = [
  { dest: 'dist/react-empty-state.full.min.js', format: 'umd' },
];

const external = umdFullConfig.external.slice();
external.push('react-transition-group/Transition');
external.push('react-popper');

const globals = Object.assign({}, umdFullConfig.globals, {
  'react-popper': 'ReactPopper',
  'react-transition-group/Transition': 'ReactTransitionGroup.Transition',
});

const umdConfig = baseUmdConfig(false);
umdConfig.external = external;
umdConfig.globals = globals;
umdConfig.targets = [
  { dest: 'dist/react-empty-state.js', format: 'umd' },
];

const umdConfigMin = baseUmdConfig(true);
umdConfigMin.external = external;
umdConfigMin.globals = globals;
umdConfigMin.targets = [
  { dest: 'dist/react-empty-state.min.js', format: 'umd' },
];


export default [
  libConfig,
  umdFullConfig,
  umdFullConfigMin,
  umdConfig,
  umdConfigMin,
];
