import * as core from "@actions/core";
import ci from "../utils/miniprogram-ci.ts";
import { onProgressUpdate } from "../utils/context.ts";
import type { ActionContext } from "../types.ts";

async function upload(context: ActionContext): Promise<void> {
  const project = new ci.Project(context.project);

  core.info("start upload");

  await ci.upload({
    project,
    version: context.version,
    desc: context.description,
    setting: {
      useProjectConfig: true,
    },
    robot: context.robot,
    threads: context.threads,
    onProgressUpdate,
  });
}

export default upload;
