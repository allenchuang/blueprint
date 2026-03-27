/**
 * PM2 Ecosystem Config
 * Manages all Blueprint OS apps on the VPS.
 *
 * Usage:
 *   pm2 start ecosystem.config.cjs       # Start all apps
 *   pm2 restart ecosystem.config.cjs     # Restart all apps
 *   pm2 reload ecosystem.config.cjs      # Zero-downtime reload
 */

module.exports = {
  apps: [
    {
      name: "web",
      script: "npx",
      args: "next start -p 3000",
      cwd: "/home/deploy/repos/blueprint/apps/web",
      env: {
        NODE_ENV: "production",
        PORT: "3000",
      },
    },
    {
      name: "server",
      script: "npx",
      args: "tsx src/index.ts",
      cwd: "/home/deploy/repos/blueprint/apps/server",
      env: {
        NODE_ENV: "production",
        PORT: "3001",
      },
    },
    {
      name: "admin",
      script: "npx",
      args: "next start -p 3002",
      cwd: "/home/deploy/repos/blueprint/apps/admin",
      env: {
        NODE_ENV: "production",
        PORT: "3002",
      },
    },
    {
      name: "docs",
      script: "npx",
      args: "mintlify dev --port 3003",
      cwd: "/home/deploy/repos/blueprint/apps/docs",
      env: {
        NODE_ENV: "production",
        PORT: "3003",
      },
    },
    {
      name: "remotion",
      script: "npx",
      args: "remotion studio --port 3004 --no-open",
      cwd: "/home/deploy/repos/blueprint/apps/remotion",
      env: {
        NODE_ENV: "production",
        PORT: "3004",
      },
    },
    {
      name: "clawdash",
      script: "npx",
      args: "next start -p 3005",
      cwd: "/home/deploy/repos/blueprint/apps/clawdash",
      env: {
        NODE_ENV: "production",
        PORT: "3005",
      },
    },
    {
      name: "paperclip",
      script: "pnpm",
      args: "dev",
      cwd: "/home/deploy/repos/blueprint/apps/paperclip",
      env: {
        NODE_ENV: "development",
        PORT: "3100",
      },
    },
    {
      name: "os",
      script: "npx",
      args: "next start -p 7777",
      cwd: "/home/deploy/repos/blueprint/apps/os",
      env: {
        NODE_ENV: "production",
        PORT: "7777",
      },
    },
  ],
};
