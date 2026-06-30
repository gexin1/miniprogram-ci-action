import * as fs from "fs";
import { readJSON } from "./json.ts";
import {
  getPackageConfigPath,
  getProjectConfigPath,
} from "./path.ts";
import type { Project, ProjectConfig } from "../types.ts";

export function readProjectConfig(rootPath: string): ProjectConfig {
  const projectFilePath = getProjectConfigPath(rootPath);

  if (fs.existsSync(projectFilePath)) {
    const config = readJSON<ProjectConfig>(projectFilePath);

    if (config) {
      config.projectname = decodeURIComponent(config.projectname);

      return config;
    }

    throw new Error("project.config.json 文件解析失败");
  }

  throw new Error("未找到 project.config.json 文件");
}

export function createProject(
  rootPath: string,
  projectConfig: ProjectConfig,
): Project {
  const privateKey = process.env.PRIVATE_KEY;
  const privateKeyPath = process.env.PRIVATE_KEY_PATH;

  return {
    appid: projectConfig.appid,
    type: getProjectType(projectConfig.compileType),
    projectPath: rootPath,
    ...(privateKey ? { privateKey } : {}),
    ...(privateKeyPath ? { privateKeyPath } : {}),
    ignores: ["node_modules/**/*"],
  };
}

export function getProjectType(
  compileType?: ProjectConfig["compileType"],
): Project["type"] {
  if (compileType === "plugin") {
    return "miniProgramPlugin";
  }

  if (compileType === "game" || compileType === "minigame") {
    return "miniGame";
  }

  return "miniProgram";
}

export function hasPackageJSON(rootPath: string): boolean {
  return fs.existsSync(getPackageConfigPath(rootPath));
}
