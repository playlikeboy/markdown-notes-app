// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.resolver.sourceExts = config.resolver.sourceExts.filter(ext => ext !== 'wasm');
config.resolver.assetExts.push('wasm');

module.exports = config;
