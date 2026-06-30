import * as core from "@actions/core";
import { pathToFileURL } from "node:url";
import * as actions from "./actions/index.ts";
import { getProjectPath } from "./utils/path.ts";
import {
  createProject,
  hasPackageJSON,
  readProjectConfig,
} from "./utils/project.ts";
import { getCIBot, getThreads } from "./utils/context.ts";
import { parseActionType } from "./utils/input.ts";
import type { ActionContext } from "./types.ts";

export async function activate(): Promise<void> {
  const actionType = parseActionType(core.getInput("action_type"));
  const projectPath = getProjectPath();
  const projectConfig = readProjectConfig(projectPath);
  const project = createProject(projectPath, projectConfig);
  const version = core.getInput("version") || "1.0.0";
  const description = core.getInput("description") ||
    "通过 MiniProgram GitHub Action 上传";
  const context: ActionContext = {
    project,
    version,
    description,
    robot: getCIBot(),
    threads: getThreads(),
  };

  if (core.isDebug()) {
    console.debug("env", process.env);
  }

  try {
    if (hasPackageJSON(project.projectPath)) {
      await actions.npm(context);
    }

    await actions[actionType](context);
  } catch (error) {
    core.setFailed(error instanceof Error ? error : String(error));
    process.exitCode = 1;
  }
}

const entrypoint = process.argv[1]
  ? pathToFileURL(process.argv[1]).href
  : "";

if (import.meta.url === entrypoint) {
  await activate();
}
