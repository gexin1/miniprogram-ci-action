import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
  createProject,
  getProjectType,
  readProjectConfig,
} from "../src/utils/project.ts";

function makeTempProject(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), "miniprogram-ci-action-"));
}

test("readProjectConfig reads and decodes project.config.json", () => {
  const projectPath = makeTempProject();
  const configPath = path.join(projectPath, "project.config.json");

  fs.writeFileSync(
    configPath,
    JSON.stringify({
      appid: "wx123",
      projectname: "%E6%B5%8B%E8%AF%95",
      libVersion: "3.8.0",
      compileType: "miniprogram",
      ignoreUploadUnusedFiles: true,
    }),
  );

  assert.deepEqual(readProjectConfig(projectPath), {
    appid: "wx123",
    projectname: "测试",
    libVersion: "3.8.0",
    compileType: "miniprogram",
    ignoreUploadUnusedFiles: true,
  });
});

test("readProjectConfig throws for missing config", () => {
  assert.throws(() => readProjectConfig(makeTempProject()), /未找到/);
});

test("createProject uses project root and maps compileType", () => {
  const projectPath = path.resolve("workspace", "demo");
  const oldPrivateKey = process.env.PRIVATE_KEY;
  const oldPrivateKeyPath = process.env.PRIVATE_KEY_PATH;

  delete process.env.PRIVATE_KEY;
  delete process.env.PRIVATE_KEY_PATH;

  try {
    assert.deepEqual(
      createProject(projectPath, {
        appid: "wx123",
        projectname: "demo",
        libVersion: "3.8.0",
        miniprogramRoot: "miniprogram",
        compileType: "plugin",
        ignoreUploadUnusedFiles: true,
      }),
      {
        appid: "wx123",
        type: "miniProgramPlugin",
        projectPath,
        ignores: ["node_modules/**/*"],
      },
    );
  } finally {
    if (oldPrivateKey === undefined) {
      delete process.env.PRIVATE_KEY;
    } else {
      process.env.PRIVATE_KEY = oldPrivateKey;
    }

    if (oldPrivateKeyPath === undefined) {
      delete process.env.PRIVATE_KEY_PATH;
    } else {
      process.env.PRIVATE_KEY_PATH = oldPrivateKeyPath;
    }
  }
});

test("getProjectType defaults to miniProgram", () => {
  assert.equal(getProjectType(undefined), "miniProgram");
  assert.equal(getProjectType("miniprogram"), "miniProgram");
  assert.equal(getProjectType("plugin"), "miniProgramPlugin");
  assert.equal(getProjectType("game"), "miniGame");
  assert.equal(getProjectType("minigame"), "miniGame");
});
