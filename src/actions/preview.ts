import * as fs from "fs";
import * as core from "@actions/core";
import * as ci from "miniprogram-ci";
import { onProgressUpdate } from "../utils/context.ts";
import { parseBooleanInput, parseNumberInput } from "../utils/input.ts";
import { getTemporaryPath } from "../utils/path.ts";
import type { ActionContext } from "../types.ts";
import {
  createCIProject,
  createUploadOptions,
  setResultOutput,
} from "./common.ts";

async function preview(context: ActionContext): Promise<void> {
  const project = createCIProject(context);
  const pagePath = core.getInput("page_path");
  const pageQuery = core.getInput("page_query");
  const scene = parseNumberInput("scene", core.getInput("scene"), 1011, {
    min: 1,
  });
  const qrcodeFormat = core.getInput("qrcode_format") || "base64";
  const tempImagePath = core.getInput("qrcode_output_dest") ||
    getTemporaryPath(project.appid);

  core.info("start preview");

  const result = await ci.preview({
    ...createUploadOptions(context, project),
    qrcodeFormat,
    qrcodeOutputDest: tempImagePath,
    pagePath,
    searchQuery: pageQuery,
    scene,
    bigPackageSizeSupport: parseBooleanInput(
      "big_package_size_support",
      core.getInput("big_package_size_support"),
    ),
    onProgressUpdate,
  } as Parameters<typeof ci.preview>[0]);

  if (qrcodeFormat === "base64") {
    const base64 = await fs.promises.readFile(tempImagePath, "utf-8");

    core.setOutput("preview_qrcode", base64);
  }

  core.setOutput("preview_qrcode_path", tempImagePath);
  setResultOutput(result);
}

export default preview;
