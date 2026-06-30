import * as core from "@actions/core";
import { pathToFileURL } from "node:url";
import * as actions from "./actions/index.ts";
import { getProjectPath } from "./utils/path.ts";
import { createProject, readProjectConfig } from "./utils/project.ts";
import { getCIBot, getThreads } from "./utils/context.ts";
import {
  parseActionType,
  parseBooleanInput,
  parseJSONInput,
} from "./utils/input.ts";
import type { ActionContext } from "./types.ts";

export async function activate(): Promise<void> {
  const actionType = parseActionType(core.getInput("action_type"));
  const projectPath = getProjectPath();
  const projectConfig = readProjectConfig(projectPath);
  const project = createProject(projectPath, projectConfig);
  const version = core.getInput("version") || "1.0.0";
  const description = core.getInput("description") ||
    "通过 MiniProgram GitHub Action 上传";
  const setting = {
    useProjectConfig: true,
    ...parseJSONInput<Record<string, unknown>>(
      "setting_json",
      core.getInput("setting_json"),
      {},
    ),
  };
  const context: ActionContext = {
    project,
    version,
    description,
    setting,
    robot: getCIBot(),
    threads: getThreads(),
    useCOS: parseBooleanInput("use_cos", core.getInput("use_cos")),
  };

  if (core.isDebug()) {
    console.debug("env", process.env);
  }

  try {
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
