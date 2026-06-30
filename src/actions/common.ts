import * as core from "@actions/core";
import * as ci from "miniprogram-ci";
import type { ActionContext } from "../types.ts";

export type CIProject = InstanceType<typeof ci.Project>;

export function createCIProject(context: ActionContext): CIProject {
  return new ci.Project(context.project);
}

export function getRequiredInput(name: string): string {
  const value = core.getInput(name).trim();

  if (!value) {
    throw new Error(`${name} is required`);
  }

  return value;
}

export function getOptionalInput(name: string): string | undefined {
  const value = core.getInput(name).trim();

  return value || undefined;
}

export function setResultOutput(result: unknown = { success: true }): void {
  core.setOutput("result_json", JSON.stringify(toJSONValue(result)));
}

export function createUploadOptions(
  context: ActionContext,
  project: CIProject,
): Record<string, unknown> {
  return removeUndefined({
    project,
    version: context.version,
    desc: context.description,
    setting: context.setting,
    robot: context.robot,
    threads: context.threads,
    useCOS: context.useCOS,
  });
}

export function removeUndefined<T extends Record<string, unknown>>(value: T): T {
  for (const key of Object.keys(value)) {
    if (value[key] === undefined) {
      delete value[key];
    }
  }

  return value;
}

function toJSONValue(value: unknown): unknown {
  if (Buffer.isBuffer(value)) {
    return {
      type: "Buffer",
      byteLength: value.byteLength,
    };
  }

  if (Array.isArray(value)) {
    return value.map(toJSONValue);
  }

  if (value && typeof value === "object") {
    const result: Record<string, unknown> = {};

    for (const [key, item] of Object.entries(value)) {
      result[key] = toJSONValue(item);
    }

    return result;
  }

  return value;
}
