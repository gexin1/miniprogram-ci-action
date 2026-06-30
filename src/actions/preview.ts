import * as fs from "fs";
import * as core from "@actions/core";
import * as ci from "miniprogram-ci";
import { onProgressUpdate } from "../utils/context.ts";
import { parseNumberInput } from "../utils/input.ts";
import { getTemporaryPath } from "../utils/path.ts";
import type { ActionContext } from "../types.ts";

async function preview(context: ActionContext): Promise<void> {
  const project = new ci.Project(context.project);
  const pagePath = core.getInput("page_path");
  const pageQuery = core.getInput("page_query");
  const scene = parseNumberInput("scene", core.getInput("scene"), 1011, {
    min: 1,
  });
  const tempImagePath = getTemporaryPath(project.appid);

  core.info("start preview");

  await ci.preview({
    project,
    version: context.version,
    desc: context.description,
    setting: {
      useProjectConfig: true,
    },
    robot: context.robot,
    threads: context.threads,
    qrcodeFormat: "base64",
    qrcodeOutputDest: tempImagePath,
    pagePath,
    searchQuery: pageQuery,
    scene,
    onProgressUpdate,
  });

  const base64 = await fs.promises.readFile(tempImagePath, "utf-8");

  core.setOutput("preview_qrcode", base64);
  core.setOutput("preview_qrcode_path", tempImagePath);
}

export default preview;
