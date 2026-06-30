import * as core from "@actions/core";
import * as ci from "miniprogram-ci";
import { onProgressUpdate } from "../utils/context.ts";
import type { ActionContext } from "../types.ts";
import {
  createCIProject,
  createUploadOptions,
  setResultOutput,
} from "./common.ts";

async function upload(context: ActionContext): Promise<void> {
  const project = createCIProject(context);

  core.info("start upload");

  const result = await ci.upload({
    ...createUploadOptions(context, project),
    onProgressUpdate,
  } as Parameters<typeof ci.upload>[0]);

  setResultOutput(result);
}

export default upload;
