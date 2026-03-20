const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");
const fs = require("fs");

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, "../..");
const appModules = path.resolve(projectRoot, "node_modules");

const config = getDefaultConfig(projectRoot);

config.watchFolders = [monorepoRoot];
config.resolver.nodeModulesPaths = [
  appModules,
  path.resolve(monorepoRoot, "node_modules"),
];
config.resolver.unstable_enablePackageExports = true;
config.resolver.unstable_enableSymlinks = true;

const nativeWindConfig = withNativeWind(config, { input: "./global.css" });

const pinnedPackages = ["react", "react-native", "react-dom"];

function resolveFromApp(pkg) {
  const pkgPath = path.resolve(appModules, pkg);
  if (fs.existsSync(pkgPath)) return fs.realpathSync(pkgPath);
  return null;
}

const pinnedRealPaths = {};
for (const pkg of pinnedPackages) {
  pinnedRealPaths[pkg] = resolveFromApp(pkg);
}

const fakeOrigin = path.join(projectRoot, "_package-pin");

const originalResolveRequest = nativeWindConfig.resolver.resolveRequest;
nativeWindConfig.resolver.resolveRequest = (context, moduleName, platform) => {
  for (const pkg of pinnedPackages) {
    if (moduleName === pkg || moduleName.startsWith(pkg + "/")) {
      const resolve = originalResolveRequest || context.resolveRequest;
      return resolve(
        { ...context, originModulePath: fakeOrigin },
        moduleName,
        platform,
      );
    }
  }

  if (originalResolveRequest) {
    return originalResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = nativeWindConfig;
