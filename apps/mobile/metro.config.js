const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// 1. Watch monorepo
config.watchFolders = [monorepoRoot];

// 2. Resolve packages from local mobile node_modules first
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];

// 3. Block root hoisted React 18.3.1 from Next.js to prevent duplicate React runtime conflict
config.resolver.blockList = [
  new RegExp(`^${path.resolve(monorepoRoot, 'node_modules/react')}/.*$`),
  new RegExp(`^${path.resolve(monorepoRoot, 'node_modules/react-dom')}/.*$`),
];

// 4. Force all imports of 'react' and 'react-native' to local 18.2.0
config.resolver.extraNodeModules = {
  react: path.resolve(projectRoot, 'node_modules/react'),
  'react-native': path.resolve(projectRoot, 'node_modules/react-native'),
  'react-dom': path.resolve(projectRoot, 'node_modules/react-dom'),
};

module.exports = config;
