import { execSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = dirname(fileURLToPath(import.meta.url));

// 安装 action 运行时依赖，仓库无需提交 node_modules。
execSync("npm ci --omit=dev --ignore-scripts", {
  cwd: resolve(currentDir, ".."),
  stdio: "inherit",
});
