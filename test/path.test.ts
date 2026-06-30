import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";
import { getMiniProgramRootPath } from "../src/utils/path.ts";

test("getMiniProgramRootPath resolves miniprogramRoot against project root", () => {
  const projectPath = path.resolve("workspace", "demo");

  assert.equal(
    getMiniProgramRootPath(projectPath, "miniprogram"),
    path.resolve(projectPath, "miniprogram"),
  );
  assert.equal(getMiniProgramRootPath(projectPath), projectPath);
});
