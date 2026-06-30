import * as core from "@actions/core";
import * as exec from "@actions/exec";
import * as ci from "miniprogram-ci";
import type { ActionContext } from "../types.ts";

async function npm(context: ActionContext): Promise<void> {
  const project = new ci.Project(context.project);

  core.info("start npm install");

  await exec.exec("npm", ["install"], {
    cwd: context.project.projectPath,
  });

  core.info("start npm build");

  const warning = await ci.packNpm(project, {
    reporter: console.log,
  });

  if (warning.length > 0) {
    console.warn(warning);
  }
}

export default npm;
